import { DomainAsPersistent, BaseRepository } from '@pjore/common/repositories/baseRepository';
import { Scope, ResultOrError } from '@pjore/common/types';
import { FilterQuery, Model, Document } from 'mongoose';
import { User, UserAsObject } from '@pjore/common/domains/user';
import { IUserModel } from '../models/user';
import * as bcrypt from 'bcrypt';

export type UserAsPersistent = DomainAsPersistent<User>;

export class UserRepository extends BaseRepository<User> {
	constructor(model: Model<IUserModel>) {
		super(model);
	}

    async findPotentialDuplicate(domain: User): Promise<ResultOrError<User>> {
		const existingAsset = await this.model.findOne({ email: domain.properties.email });
		
		return ResultOrError.ok(existingAsset ? User.create(this.dbObjectToDomainObject(existingAsset)).result : null );
	}

    async saveNew(domain: User): Promise<ResultOrError<User, unknown>> {
        try {
            const { result: potentialDuplicate, error: findDuplicateError } = await this.findPotentialDuplicate(domain);
            if(potentialDuplicate || findDuplicateError) {
                return ResultOrError.fail(findDuplicateError ?? `User not saved due to potential duplicate of ${potentialDuplicate._id.toString()}`)
            }
            
            const salt = await bcrypt.genSalt(12);
            domain.properties.password = await bcrypt.hash(domain.properties.password, salt);
            const asPersistent = UserRepository.domainToPersistent(domain);
            const newAssetInDb = await this.model.create(asPersistent);

            return await newAssetInDb ? 
                ResultOrError.ok(domain) : 
                ResultOrError.fail('Unable to save new item to db');
		}
		catch(error) {
			return ResultOrError.fail({ message: 'Could not save to db', data: error });
		}
    }

    async saveExisting(domain: User): Promise<ResultOrError<User, unknown>> {
        try {
            const { _id, createdAt, ...props } = UserRepository.domainToPersistent(domain);

            return await this.model.updateOne({ _id: _id }, props) ? 
                ResultOrError.ok(await (await this.findOne({ id: domain._id.toString() })).result) : 
                ResultOrError.fail('Unable to update existing item');
		}
		catch(error) {
			return ResultOrError.fail({ message: 'Could not save to db', data: error });
		}
    }
    async find(query: Partial<UserAsObject> | FilterQuery<UserAsObject>): Promise<ResultOrError<User[], unknown>> {
        try {
            const dbQuery = UserRepository.domainObjectToPersistent(query);
            const result = await this.model.find(dbQuery).exec();
            const users: User[] = [];

            result.forEach(user => {
                const domObj = this.dbObjectToDomainObject(user);
                users.push(User.create(domObj).result);
            });

            return ResultOrError.ok(users);
        }
        catch (error) {
            return ResultOrError.fail(error);
        }
    }
    async findOne(query: Partial<UserAsObject> | FilterQuery<UserAsObject>): Promise<ResultOrError<User, unknown>> {
        try {
            const dbQuery = UserRepository.domainObjectToPersistent(query);
            const result = await this.model.findOne(dbQuery).exec();
            const user = result ? User.create(this.dbObjectToDomainObject(result)).result : null;

            return ResultOrError.ok(user);
        }
        catch (error) {
            return ResultOrError.fail(error);
        }
    }
    delete(id: string): Promise<ResultOrError<boolean, unknown>>;
    delete(domain: User): Promise<ResultOrError<boolean, unknown>>;
    async delete(domainOrId: string | User): Promise<ResultOrError<boolean, unknown>> {
        try {
            const query = typeof domainOrId === 'string' ? { _id: domainOrId } : { _id: domainOrId?._id.toString() }
            const existingUser = await this.model.findOne(query);
            if (!existingUser) {
                ResultOrError.fail('Unable to find item to delete');
            }

            return await existingUser.deleteOne(query) ? ResultOrError.ok(true) : ResultOrError.fail('Unable to delete item');
        }
        catch (error) {
            return ResultOrError.fail(error);
        }
    }
}
