import { BaseDomain, FlattenProperties } from './baseDomain';
import { ObjectId } from './objectId';
import { IUser, ResultOrError } from '../types';
import * as _ from 'lodash';

export type UserAsInputObject = Omit<FlattenProperties<IUser>, "status">;
export type UserAsSignUpObject = Omit<UserAsInputObject, "accountId" | "scopes" >;
export type UserAsObject = FlattenProperties<IUser> & { id?: string, createdAt?: string, updatedAt?: string };
export type UserAsOutputObject = Omit<FlattenProperties<IUser>, 'password'> & { id?: string, createdAt?: string, updatedAt?: string };

export class User extends BaseDomain<IUser> {
    get accountId() {
        return this.properties.accountId;
    }

    toOutputObject(): UserAsOutputObject {
        const { password, ...cleared } = this.toObject();
        return cleared
    }
    
    static create(object?: UserAsObject): ResultOrError<User, any> {
        const { id, accountId, ...props } = object;
        return ResultOrError.ok(new User({...props, accountId: ObjectId.create(accountId).result }, ObjectId.create(id).result ));
    }
}
