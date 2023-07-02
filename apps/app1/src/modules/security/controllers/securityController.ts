'use strict';

import { BaseController } from "@pjore/http-server/infra/httpServer/BaseController";
import { ITsoaRequest } from "@pjore/http-server/utilities/authentication";
import { accountRepository, userRepository } from "../..";
import { AccountRepository } from "../../account/repositories/accountRepository";
import { UserRepository } from "../../user/repositories/userRepository";
import { Post, Route, Request, Body, Tags } from "tsoa";
import { SignUp, SignUpAsInputObject } from "../domain/signup";
import { ISignInResult, SignInDTO } from "../DTOs/signIn";
import { compare } from 'bcrypt'
import { AccountAsObject, IEmailValidationPayload } from "@pjore/common/types/IAccount";
import { getUserToken } from "@pjore/http-server/utilities/getToken";
import { decryptJWT } from "@pjore/common/utilities/jwt";
import * as dotenv from 'dotenv';
import { UserAsObject } from "@pjore/common/domains/user";
dotenv.config();

@Tags('Public')
@Route("public")
export class SecurityController extends BaseController {
	accountRepository: AccountRepository;
	userRepository: UserRepository;
	constructor () {
		super();
		this.accountRepository = accountRepository;
		this.userRepository = userRepository;
	}
	/**
	 * Create new account and the administrator user
	 * 
	 * @param body
	 * @example body {
	 *		"validationCode": "1234",
	 *		"validationToken": "string",
	 *		"account": {
	 *			"name": "Company name"
	 *		},
	 *		"user": {
	 *			"password": "string",
	 *			"email": "john@doe.int",
	 *			"lastName": "Doe",
	 *			"firstName": "John"
	 *		}
	 *	}
	 */
	@Post("signup")
	public async signup(@Body() body: SignUpAsInputObject, @Request() req: ITsoaRequest): Promise<{ account: AccountAsObject, user: UserAsObject, token: string}> {
		const validationObj = await decryptJWT<IEmailValidationPayload>(body.validationToken, process.env.SECRET_VALIDATION);
		if ( !( validationObj.expectedCode === body.validationCode ) ) {
			throw { message: 'Validation key do not match' }
		}
		
		const { result: signUp, error: signUpError} = SignUp.create(body);
		if(signUpError) {
			throw signUpError;
		}

		const { error: accountPersistentError} = await this.accountRepository.saveNew(signUp.aggregates.account);
		if(accountPersistentError) {
			throw new Error(accountPersistentError.message);
		}

		const { error: userPersistentError} = await this.userRepository.saveNew(signUp.aggregates.user);
		if(userPersistentError) {
			await this.accountRepository.delete(signUp.aggregates.account._id.toString());
			throw new Error(userPersistentError.message);
		}

		const { token } = getUserToken(signUp.aggregates.user.accountId.toString(), signUp.aggregates.user._id.toString(), signUp.aggregates.user.properties.scopes);

		return { account: signUp.aggregates.account.toObject(), user: signUp.aggregates.user.toObject(), token: token };
	}

	/**
	 * The standard user password sign in endpoint. Pass the generated token as bearer token in sequential requests 
	 * 
	 * @param body
	 * @example body {
	 * 	"email": "admin@mrbesserwisser.com",
	 * 	"password": "string"
	 * }
	 * @param req 
	 */
	@Post("signin")
	public async signin(@Body() body: SignInDTO, @Request() req: ITsoaRequest): Promise<ISignInResult> {
		const { result: signIn, error } = SignInDTO.transform(body);
		if(error) {
			throw error
		}

		const { result: user } = await userRepository.findOne({ email: signIn.email });
		if (!user) {
			throw 'User not found';
		}
		
		const correctPassword = await compare(signIn.password, user.properties.password);
		if (correctPassword) {
			return getUserToken(user.accountId.toString(), user._id.toString(), user.properties.scopes);
		}
		throw 'Invalid password'
	}
}
