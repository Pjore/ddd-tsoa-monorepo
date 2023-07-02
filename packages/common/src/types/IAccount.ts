import { Status } from "../enums";
import { FlattenProperties } from "../domains/baseDomain";

export interface IAccount {
    status?: Status,
}

export type AccountAsObject = FlattenProperties<IAccount> & { id?: string, createdAt?: string, updatedAt?: string }; 

export interface IEmailValidationPayload {
	email: string,
	expectedCode: string
}