
'use strict';
import { BaseController } from '@pjore/http-server/infra/httpServer';
import * as _ from 'lodash';
import { UserAsObject, User, UserAsInputObject } from '@pjore/common/domains/user';
import { UserRepository } from '../repositories/userRepository';
import { userRepository } from '../..';
import { Get, Post, Query, Route, Security, Tags, Request, Body } from "tsoa";
import { Scope } from '@pjore/common/types/IUser';
import { ValidateScopes } from '@pjore/common/utilities/validateScopes';
import { AccountController } from '../../account/controllers/accountsController';
import { ITsoaRequest } from '@pjore/http-server/utilities/authentication';

@Tags('User')
@Route("user")
export class UsersController extends BaseController {
	userRepository: UserRepository;
	constructor () {
		super();
		this.userRepository = userRepository;
	}

	/**
	 * admin and account.admin are excepted from validation
	 * @param req ITsoaRequest
	 * @param userId string
	 */
	static ValidateScope(req: ITsoaRequest, userId: string) {
		if (!(req.user.scopes.includes('admin') || req.user.scopes.includes('account.admin') || req.user.scopes.includes('user.admin')) && req.user.userId !== userId) {
			throw new Error('Query outside of current scope');
		}
	}

	/**
	 * [Internal] Query all users
	 * 
	 * @param query Query representation of a user. Mongoose filter properties are supported
	 * @returns 
	 */
	@Security("bearerAuth", ["admin"])
	@Get("")
	async getListOfUsers(@Request() req: ITsoaRequest, @Query() query: string): Promise<UserAsObject[]> {
		const queryAsObj = query ? JSON.parse(query) : {};
		const {result, error} = await this.userRepository.find(queryAsObj);

		if (error) {
			throw new Error(error.message);
		}
		
		return result.map(user => user.toOutputObject());
	}

	/**
	 * Create new user and add to account
	 * 
	 * @param body JSON representation of a User
	 * @returns 
	 */
	@Security("bearerAuth", ["account.write"])
	@Post("")
	async addUser(@Body() body:UserAsInputObject, @Request() req: ITsoaRequest): Promise<UserAsObject> {
		AccountController.ValidateScope(req, body.accountId);
		
		const validatedScopes: { valid: Scope[], invalid: Scope[] } = ValidateScopes(req.user.scopes, body.scopes);

		if (validatedScopes.invalid?.length > 0) {
			throw new Error('Your user is not entitled to assign following scopes: ' + validatedScopes.invalid);
		}

		const validatedBody:UserAsObject = { 
			...body,
			scopes: validatedScopes.valid
		};
		
		const userToBeSaved = User.create(validatedBody).result;

		const { result, error} = await this.userRepository.saveNew(userToBeSaved);

		if (error) {
			throw new Error(error.message);
		}
		
		return userToBeSaved.toOutputObject();
	}
};

