'use strict';

import { BaseController } from "@pjore/http-server/infra/httpServer/BaseController";
import { AccountRepository } from "../repositories/accountRepository";
import { Get, Post, Query, Route, Security, Tags, Request, Body } from "tsoa";
import { accountRepository, userRepository } from "../..";
import { AccountAsObject } from "@pjore/common/types/IAccount";
import { UserRepository } from "../../user/repositories/userRepository";
import { ITsoaRequest } from "@pjore/http-server/utilities/authentication";
import { Account } from "@pjore/common/domains";

/**
 * Each customer has 1 account. The Account endpoint provide manage capabilities for your account
 * and provides some administrative capabilities for MSPs that manage multiple customer accounts
 */
@Tags('Account')
@Route("account")
export class AccountController extends BaseController {
	accountRepository: AccountRepository;
	userRepository: UserRepository;
	constructor () {//private accountRepository: AccountRepository, private assetRepository: AssetRepository) {
		super();
		this.accountRepository = accountRepository;
		this.userRepository = userRepository;
	}

	/**
	 * Get list of accounts based on provided query
	 * @param query JSON object with filter properties
	 * @example query { "country": "SE" }
	 */
	@Security("bearerAuth", ["admin"])
	@Get("")
	async getListOfAccounts(@Request() req: ITsoaRequest, @Query() query: string): Promise<AccountAsObject[]> {
		const queryAsObj = query ? JSON.parse(query) : {};
		const {result, error} = await this.accountRepository.find(queryAsObj); 

		if (error) {
			throw new Error(error.message);;
		}
		
		return result.map(account => account.toObject());
	}

	/**
	 * Create an account is only available for MSPs
	 * 
	 * @param body See schema for mandatory properties
	 */
	@Security("bearerAuth", ["admin"])
	@Post("")
	async addAccount(@Body() body: any): Promise<AccountAsObject> {
		const accountToBeSaved = Account.create().result;

		const { result, error} = await this.accountRepository.saveNew(accountToBeSaved);

		if (error) {
			throw new Error(error.message);;
		}
		
		return accountToBeSaved.toObject();
	}
};
