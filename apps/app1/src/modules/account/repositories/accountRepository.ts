import { IAccountModel } from '../models/account';
import { FilterQuery, Model, Document } from 'mongoose';
import { Account } from '@pjore/common/domains/account';
import { BaseRepository, DomainAsPersistent } from '@pjore/common/repositories/baseRepository';
import { ResultOrError } from '@pjore/common/types/ResultOrError';

import { AccountAsObject } from '@pjore/common/types/IAccount';

export type AccountAsPersistent = DomainAsPersistent<Account>;

export class AccountRepository extends BaseRepository<Account> {
	constructor(model: Model<IAccountModel>) {
		super(model);
	}

    async findPotentialDuplicate(domain: Account): Promise<ResultOrError<Account>> {
        const baseQuery: FilterQuery<IAccountModel> = {
            accountId: { $exists: false },
            email: { $exists: false }
        }

		const query = {...baseQuery, ...AccountRepository.domainToPersistent(domain)};

		const existingAsset = await this.model.findOne(query);
		
		return ResultOrError.ok(existingAsset ? Account.create(this.dbObjectToDomainObject(existingAsset)).result : null );
	}

    async saveNew(domain: Account): Promise<ResultOrError<Account, unknown>> {
        return BaseRepository.saveNew(domain, this);
    }

    async saveExisting(domain: Account): Promise<ResultOrError<Account, unknown>> {
        return BaseRepository.saveExisting(domain, this);
    }
    async find(query: Partial<AccountAsObject> | FilterQuery<AccountAsObject>): Promise<ResultOrError<Account[], unknown>> {
        try {
            const dbQuery = AccountRepository.domainObjectToPersistent(query);
            const result = await this.model.find(dbQuery).exec();
            const accounts: Account[] = [];

            result.forEach(account => {
                const domObj = this.dbObjectToDomainObject(account);
                accounts.push(Account.create(domObj).result);
            });

            return ResultOrError.ok(accounts);
        }
        catch (error) {
            return ResultOrError.fail(error);
        }
    }
    async findOne(query: Partial<AccountAsObject> | FilterQuery<AccountAsObject>): Promise<ResultOrError<Account, unknown>> {
        try {
            const dbQuery = AccountRepository.domainObjectToPersistent(query);
            const result = await this.model.findOne(dbQuery).exec();
            const account = result ? Account.create(this.dbObjectToDomainObject(result)).result : null;

            return ResultOrError.ok(account);
        }
        catch (error) {
            return ResultOrError.fail(error);
        }
    }
    delete(id: string): Promise<ResultOrError<boolean, unknown>>;
    delete(domain: Account): Promise<ResultOrError<boolean, unknown>>;
    async delete(domainOrId: string | Account): Promise<ResultOrError<boolean, unknown>> {
        try {
            const query = typeof domainOrId === 'string' ? { _id: domainOrId } : { _id: domainOrId?._id.toString() }
            const existingAccount = await this.model.findOne(query);
            if (!existingAccount) {
                ResultOrError.fail('Unable to find item to delete');
            }

            return await existingAccount.deleteOne(query) ? ResultOrError.ok(true) : ResultOrError.fail('Unable to delete item');
        }
        catch (error) {
            return ResultOrError.fail(error);
        }
    }
}
