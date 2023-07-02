import { BaseAggregation } from "@pjore/common/domains/baseAggregation";
import { FlattenProperties } from "@pjore/common/domains/baseDomain";
import { ResultOrError } from "@pjore/common/types";
import { UserAsInputObject } from "@pjore/common/domains/user";
import { Account } from "@pjore/common/domains/account";
import { User } from "@pjore/common/domains/user";
import * as dotenv from 'dotenv';
dotenv.config();

export interface ISignUp {
    user: User,
    account: Account
}
export type SignUpAsInputObject = { 
    user: {
        firstName: string,
        lastName: string,
        email: string,
        password: string,
    }, 
    account: {
        name: string,
    },
    validationToken: string,
    validationCode: string
 };
export type SignUpAsObject = FlattenProperties<ISignUp>  & { id?: string, createdAt?: string, updatedAt?: string };

export class SignUp extends BaseAggregation<ISignUp> {
    static create(object?: SignUpAsInputObject): ResultOrError<SignUp, any> {
        const { account, user, validationToken,validationCode, ...props } = object;

        const { result: accountResult, error: accountError } = Account.create();
        if (accountError) {
            return ResultOrError.fail(accountError);
        }
        const userWithAccount: UserAsInputObject = { email: user.email, password: user.password, accountId: accountResult._id.toString(), scopes: ['account.admin'] }
        const { result: userResult, error: userError } = User.create(userWithAccount);
        if (userError) {
            return ResultOrError.fail(userError);
        }
        

        return ResultOrError.ok(new SignUp({ user: userResult, account: accountResult } ));
    }
}