import { BaseDomain } from './baseDomain';
import { DateEntity } from './date';
import { ObjectId } from './objectId';
import { AccountAsObject, IAccount } from '../types/IAccount';
import { ResultOrError } from '../types/ResultOrError';
import * as _ from 'lodash';
export class Account extends BaseDomain<IAccount> {
    static create(object: AccountAsObject = {}): ResultOrError<Account, any> {
        const { id, createdAt, updatedAt } = object;
        return ResultOrError.ok(new Account( { status: 'active' }, ObjectId.create(id).result, new DateEntity(createdAt), new DateEntity(updatedAt) ));
    }
}
