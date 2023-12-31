/* tslint:disable */
/* eslint-disable */
/**
 * @pjore/app1
 * DigitalOffice app1 is the main backend of DigitalOffice. It provides an API with primary purpose to serve the DigitalOffice app (ie. the frontend). To use the API you need to authenticate using public/signin endpoint. This will generate an token that needs to be passed as bearer token in every request
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { Configuration } from './configuration';
import globalAxios, { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from './base';

/**
 * 
 * @export
 * @interface AccountAsObject
 */
export interface AccountAsObject {
    /**
     * 
     * @type {Status}
     * @memberof AccountAsObject
     */
    'status'?: Status;
    /**
     * 
     * @type {string}
     * @memberof AccountAsObject
     */
    'updatedAt'?: string;
    /**
     * 
     * @type {string}
     * @memberof AccountAsObject
     */
    'createdAt'?: string;
    /**
     * 
     * @type {string}
     * @memberof AccountAsObject
     */
    'id'?: string;
}
/**
 * 
 * @export
 * @interface AccountAsObjectAllOf
 */
export interface AccountAsObjectAllOf {
    /**
     * 
     * @type {string}
     * @memberof AccountAsObjectAllOf
     */
    'updatedAt'?: string;
    /**
     * 
     * @type {string}
     * @memberof AccountAsObjectAllOf
     */
    'createdAt'?: string;
    /**
     * 
     * @type {string}
     * @memberof AccountAsObjectAllOf
     */
    'id'?: string;
}
/**
 * 
 * @export
 * @interface FlattenPropertiesIAccount
 */
export interface FlattenPropertiesIAccount {
    /**
     * 
     * @type {Status}
     * @memberof FlattenPropertiesIAccount
     */
    'status'?: Status;
}
/**
 * 
 * @export
 * @interface FlattenPropertiesIUser
 */
export interface FlattenPropertiesIUser {
    /**
     * 
     * @type {string}
     * @memberof FlattenPropertiesIUser
     */
    'password'?: string;
    /**
     * 
     * @type {string}
     * @memberof FlattenPropertiesIUser
     */
    'status'?: string;
    /**
     * 
     * @type {Array<Scope>}
     * @memberof FlattenPropertiesIUser
     */
    'scopes'?: Array<Scope>;
    /**
     * 
     * @type {string}
     * @memberof FlattenPropertiesIUser
     */
    'email': string;
    /**
     * 
     * @type {string}
     * @memberof FlattenPropertiesIUser
     */
    'accountId': string;
}
/**
 * 
 * @export
 * @interface ISignInResult
 */
export interface ISignInResult {
    /**
     * 
     * @type {string}
     * @memberof ISignInResult
     */
    'userId'?: string;
    /**
     * 
     * @type {string}
     * @memberof ISignInResult
     */
    'accountId': string;
    /**
     * 
     * @type {string}
     * @memberof ISignInResult
     */
    'productId'?: string;
    /**
     * 
     * @type {string}
     * @memberof ISignInResult
     */
    'groupId'?: string;
    /**
     * 
     * @type {string}
     * @memberof ISignInResult
     */
    'taskId'?: string;
    /**
     * 
     * @type {Array<Scope>}
     * @memberof ISignInResult
     */
    'scopes'?: Array<Scope>;
    /**
     * 
     * @type {string}
     * @memberof ISignInResult
     */
    'token': string;
    /**
     * 
     * @type {string}
     * @memberof ISignInResult
     */
    'orderId'?: string;
}
/**
 * From T, pick a set of properties whose keys are in the union K
 * @export
 * @interface PickFlattenPropertiesIUserExcludeKeyofFlattenPropertiesIUserStatus
 */
export interface PickFlattenPropertiesIUserExcludeKeyofFlattenPropertiesIUserStatus {
    /**
     * 
     * @type {string}
     * @memberof PickFlattenPropertiesIUserExcludeKeyofFlattenPropertiesIUserStatus
     */
    'accountId'?: string;
    /**
     * 
     * @type {string}
     * @memberof PickFlattenPropertiesIUserExcludeKeyofFlattenPropertiesIUserStatus
     */
    'email'?: string;
    /**
     * 
     * @type {Array<Scope>}
     * @memberof PickFlattenPropertiesIUserExcludeKeyofFlattenPropertiesIUserStatus
     */
    'scopes'?: Array<Scope>;
    /**
     * 
     * @type {string}
     * @memberof PickFlattenPropertiesIUserExcludeKeyofFlattenPropertiesIUserStatus
     */
    'password'?: string;
}
/**
 * 
 * @export
 * @enum {string}
 */

export const Scope = {
    Admin: 'admin',
    AccountAdmin: 'account.admin',
    AccountWrite: 'account.write',
    AccountRead: 'account.read',
    UserRead: 'user.read',
    UserWrite: 'user.write',
    UserAdmin: 'user.admin',
    TaskWrite: 'task.write'
} as const;

export type Scope = typeof Scope[keyof typeof Scope];


/**
 * 
 * @export
 * @interface SignInDTO
 */
export interface SignInDTO {
    /**
     * 
     * @type {string}
     * @memberof SignInDTO
     */
    'email': string;
    /**
     * 
     * @type {string}
     * @memberof SignInDTO
     */
    'password': string;
}
/**
 * 
 * @export
 * @interface SignUpAsInputObject
 */
export interface SignUpAsInputObject {
    /**
     * 
     * @type {string}
     * @memberof SignUpAsInputObject
     */
    'validationCode': string;
    /**
     * 
     * @type {string}
     * @memberof SignUpAsInputObject
     */
    'validationToken': string;
    /**
     * 
     * @type {SignUpAsInputObjectAccount}
     * @memberof SignUpAsInputObject
     */
    'account': SignUpAsInputObjectAccount;
    /**
     * 
     * @type {SignUpAsInputObjectUser}
     * @memberof SignUpAsInputObject
     */
    'user': SignUpAsInputObjectUser;
}
/**
 * 
 * @export
 * @interface SignUpAsInputObjectAccount
 */
export interface SignUpAsInputObjectAccount {
    /**
     * 
     * @type {string}
     * @memberof SignUpAsInputObjectAccount
     */
    'name': string;
}
/**
 * 
 * @export
 * @interface SignUpAsInputObjectUser
 */
export interface SignUpAsInputObjectUser {
    /**
     * 
     * @type {string}
     * @memberof SignUpAsInputObjectUser
     */
    'password': string;
    /**
     * 
     * @type {string}
     * @memberof SignUpAsInputObjectUser
     */
    'email': string;
    /**
     * 
     * @type {string}
     * @memberof SignUpAsInputObjectUser
     */
    'lastName': string;
    /**
     * 
     * @type {string}
     * @memberof SignUpAsInputObjectUser
     */
    'firstName': string;
}
/**
 * 
 * @export
 * @interface Signup200Response
 */
export interface Signup200Response {
    /**
     * 
     * @type {string}
     * @memberof Signup200Response
     */
    'token': string;
    /**
     * 
     * @type {UserAsObject}
     * @memberof Signup200Response
     */
    'user': UserAsObject;
    /**
     * 
     * @type {AccountAsObject}
     * @memberof Signup200Response
     */
    'account': AccountAsObject;
}
/**
 * 
 * @export
 * @enum {string}
 */

export const Status = {
    None: 'none',
    Active: 'active',
    Inactive: 'inactive',
    Error: 'error',
    Failure: 'failure',
    Partial: 'partial',
    Pending: 'pending',
    Paused: 'paused',
    Success: 'success'
} as const;

export type Status = typeof Status[keyof typeof Status];


/**
 * 
 * @export
 * @interface UserAsObject
 */
export interface UserAsObject {
    /**
     * 
     * @type {string}
     * @memberof UserAsObject
     */
    'password'?: string;
    /**
     * 
     * @type {string}
     * @memberof UserAsObject
     */
    'status'?: string;
    /**
     * 
     * @type {Array<Scope>}
     * @memberof UserAsObject
     */
    'scopes'?: Array<Scope>;
    /**
     * 
     * @type {string}
     * @memberof UserAsObject
     */
    'email': string;
    /**
     * 
     * @type {string}
     * @memberof UserAsObject
     */
    'accountId': string;
    /**
     * 
     * @type {string}
     * @memberof UserAsObject
     */
    'updatedAt'?: string;
    /**
     * 
     * @type {string}
     * @memberof UserAsObject
     */
    'createdAt'?: string;
    /**
     * 
     * @type {string}
     * @memberof UserAsObject
     */
    'id'?: string;
}

/**
 * AccountApi - axios parameter creator
 * @export
 */
export const AccountApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Create an account is only available for MSPs
         * @param {any} body See schema for mandatory properties
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addAccount: async (body: any, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            assertParamExists('addAccount', 'body', body)
            const localVarPath = `/account`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearerAuth required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(body, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Get list of accounts based on provided query
         * @param {string} query JSON object with filter properties
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getListOfAccounts: async (query: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'query' is not null or undefined
            assertParamExists('getListOfAccounts', 'query', query)
            const localVarPath = `/account`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearerAuth required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)

            if (query !== undefined) {
                localVarQueryParameter['query'] = query;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * AccountApi - functional programming interface
 * @export
 */
export const AccountApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = AccountApiAxiosParamCreator(configuration)
    return {
        /**
         * Create an account is only available for MSPs
         * @param {any} body See schema for mandatory properties
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async addAccount(body: any, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<AccountAsObject>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.addAccount(body, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Get list of accounts based on provided query
         * @param {string} query JSON object with filter properties
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getListOfAccounts(query: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<AccountAsObject>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getListOfAccounts(query, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * AccountApi - factory interface
 * @export
 */
export const AccountApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = AccountApiFp(configuration)
    return {
        /**
         * Create an account is only available for MSPs
         * @param {any} body See schema for mandatory properties
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addAccount(body: any, options?: any): AxiosPromise<AccountAsObject> {
            return localVarFp.addAccount(body, options).then((request) => request(axios, basePath));
        },
        /**
         * Get list of accounts based on provided query
         * @param {string} query JSON object with filter properties
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getListOfAccounts(query: string, options?: any): AxiosPromise<Array<AccountAsObject>> {
            return localVarFp.getListOfAccounts(query, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * AccountApi - object-oriented interface
 * @export
 * @class AccountApi
 * @extends {BaseAPI}
 */
export class AccountApi extends BaseAPI {
    /**
     * Create an account is only available for MSPs
     * @param {any} body See schema for mandatory properties
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AccountApi
     */
    public addAccount(body: any, options?: AxiosRequestConfig) {
        return AccountApiFp(this.configuration).addAccount(body, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Get list of accounts based on provided query
     * @param {string} query JSON object with filter properties
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AccountApi
     */
    public getListOfAccounts(query: string, options?: AxiosRequestConfig) {
        return AccountApiFp(this.configuration).getListOfAccounts(query, options).then((request) => request(this.axios, this.basePath));
    }
}


/**
 * PublicApi - axios parameter creator
 * @export
 */
export const PublicApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * The standard user password sign in endpoint. Pass the generated token as bearer token in sequential requests
         * @param {SignInDTO} signInDTO 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        signin: async (signInDTO: SignInDTO, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'signInDTO' is not null or undefined
            assertParamExists('signin', 'signInDTO', signInDTO)
            const localVarPath = `/public/signin`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(signInDTO, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Create new account and the administrator user
         * @param {SignUpAsInputObject} signUpAsInputObject 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        signup: async (signUpAsInputObject: SignUpAsInputObject, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'signUpAsInputObject' is not null or undefined
            assertParamExists('signup', 'signUpAsInputObject', signUpAsInputObject)
            const localVarPath = `/public/signup`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(signUpAsInputObject, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * PublicApi - functional programming interface
 * @export
 */
export const PublicApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = PublicApiAxiosParamCreator(configuration)
    return {
        /**
         * The standard user password sign in endpoint. Pass the generated token as bearer token in sequential requests
         * @param {SignInDTO} signInDTO 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async signin(signInDTO: SignInDTO, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ISignInResult>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.signin(signInDTO, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Create new account and the administrator user
         * @param {SignUpAsInputObject} signUpAsInputObject 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async signup(signUpAsInputObject: SignUpAsInputObject, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Signup200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.signup(signUpAsInputObject, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * PublicApi - factory interface
 * @export
 */
export const PublicApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = PublicApiFp(configuration)
    return {
        /**
         * The standard user password sign in endpoint. Pass the generated token as bearer token in sequential requests
         * @param {SignInDTO} signInDTO 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        signin(signInDTO: SignInDTO, options?: any): AxiosPromise<ISignInResult> {
            return localVarFp.signin(signInDTO, options).then((request) => request(axios, basePath));
        },
        /**
         * Create new account and the administrator user
         * @param {SignUpAsInputObject} signUpAsInputObject 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        signup(signUpAsInputObject: SignUpAsInputObject, options?: any): AxiosPromise<Signup200Response> {
            return localVarFp.signup(signUpAsInputObject, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * PublicApi - object-oriented interface
 * @export
 * @class PublicApi
 * @extends {BaseAPI}
 */
export class PublicApi extends BaseAPI {
    /**
     * The standard user password sign in endpoint. Pass the generated token as bearer token in sequential requests
     * @param {SignInDTO} signInDTO 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PublicApi
     */
    public signin(signInDTO: SignInDTO, options?: AxiosRequestConfig) {
        return PublicApiFp(this.configuration).signin(signInDTO, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Create new account and the administrator user
     * @param {SignUpAsInputObject} signUpAsInputObject 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PublicApi
     */
    public signup(signUpAsInputObject: SignUpAsInputObject, options?: AxiosRequestConfig) {
        return PublicApiFp(this.configuration).signup(signUpAsInputObject, options).then((request) => request(this.axios, this.basePath));
    }
}


/**
 * UserApi - axios parameter creator
 * @export
 */
export const UserApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Create new user and add to account
         * @param {PickFlattenPropertiesIUserExcludeKeyofFlattenPropertiesIUserStatus} body JSON representation of a User
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addUser: async (body: PickFlattenPropertiesIUserExcludeKeyofFlattenPropertiesIUserStatus, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            assertParamExists('addUser', 'body', body)
            const localVarPath = `/user`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearerAuth required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(body, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * [Internal] Query all users
         * @param {string} query Query representation of a user. Mongoose filter properties are supported
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getListOfUsers: async (query: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'query' is not null or undefined
            assertParamExists('getListOfUsers', 'query', query)
            const localVarPath = `/user`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearerAuth required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)

            if (query !== undefined) {
                localVarQueryParameter['query'] = query;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * UserApi - functional programming interface
 * @export
 */
export const UserApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = UserApiAxiosParamCreator(configuration)
    return {
        /**
         * Create new user and add to account
         * @param {PickFlattenPropertiesIUserExcludeKeyofFlattenPropertiesIUserStatus} body JSON representation of a User
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async addUser(body: PickFlattenPropertiesIUserExcludeKeyofFlattenPropertiesIUserStatus, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UserAsObject>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.addUser(body, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * [Internal] Query all users
         * @param {string} query Query representation of a user. Mongoose filter properties are supported
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getListOfUsers(query: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<UserAsObject>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getListOfUsers(query, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * UserApi - factory interface
 * @export
 */
export const UserApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = UserApiFp(configuration)
    return {
        /**
         * Create new user and add to account
         * @param {PickFlattenPropertiesIUserExcludeKeyofFlattenPropertiesIUserStatus} body JSON representation of a User
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addUser(body: PickFlattenPropertiesIUserExcludeKeyofFlattenPropertiesIUserStatus, options?: any): AxiosPromise<UserAsObject> {
            return localVarFp.addUser(body, options).then((request) => request(axios, basePath));
        },
        /**
         * [Internal] Query all users
         * @param {string} query Query representation of a user. Mongoose filter properties are supported
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getListOfUsers(query: string, options?: any): AxiosPromise<Array<UserAsObject>> {
            return localVarFp.getListOfUsers(query, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * UserApi - object-oriented interface
 * @export
 * @class UserApi
 * @extends {BaseAPI}
 */
export class UserApi extends BaseAPI {
    /**
     * Create new user and add to account
     * @param {PickFlattenPropertiesIUserExcludeKeyofFlattenPropertiesIUserStatus} body JSON representation of a User
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public addUser(body: PickFlattenPropertiesIUserExcludeKeyofFlattenPropertiesIUserStatus, options?: AxiosRequestConfig) {
        return UserApiFp(this.configuration).addUser(body, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * [Internal] Query all users
     * @param {string} query Query representation of a user. Mongoose filter properties are supported
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public getListOfUsers(query: string, options?: AxiosRequestConfig) {
        return UserApiFp(this.configuration).getListOfUsers(query, options).then((request) => request(this.axios, this.basePath));
    }
}


