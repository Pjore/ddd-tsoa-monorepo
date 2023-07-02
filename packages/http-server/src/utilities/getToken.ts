import { generateJWT } from '@pjore/common/utilities/jwt'
import { Scope } from "@pjore/common/types/IUser";
import { ILocals } from "@pjore/common/types/ILocals";
import * as dotenv from 'dotenv';
dotenv.config();

export function getUserToken(accountId: string, userId: string, scopes: Scope[]) {
	const locals: ILocals = {
		userId: userId,
		accountId: accountId,
		scopes: scopes
	};
	const jwt = generateJWT(locals, process.env.SECRET_AUTH);
	return { ...locals, token: jwt };
}

export function getProductToken(accountId: string, taskId: string, productId: string, scopes: Scope[]) {
	const locals: ILocals = {
		taskId: taskId,
		accountId: accountId,
		productId: productId,
		scopes: [ ...scopes, 'task.write']	//Append task scope to allow operations within Providers
	};
	const jwt = generateJWT(locals, process.env.SECRET_AUTH);
	return { ...locals, token: jwt };
}