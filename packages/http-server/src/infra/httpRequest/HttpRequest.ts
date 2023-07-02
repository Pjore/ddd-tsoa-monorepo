import { AxiosRequestConfig } from "axios";
import * as _ from "lodash";
import { Policy } from "@pjore/common/types/Policy";
import { ConstantPolicy } from "@pjore/common/policies/constantPolicy";
import { retryer } from "@pjore/common/utilities/retryer";
import { GetCommand } from "./commands/Get";
import { PatchCommand } from "./commands/Patch";
import { PostCommand } from "./commands/Post";

export class HttpRequest<Entity = any> {
    private _axiosConfig: AxiosRequestConfig
    policy: Policy;
    constructor(configuration: AxiosRequestConfig, policy?: Policy) {
        this._axiosConfig =  configuration;
        this.policy = policy ? policy : new ConstantPolicy();
    }

    async post<ContentType = Entity>(endpoint:string, token?: string, payload?: any, policy?: Policy) {
        let axiosConfig = this._axiosConfig;
        
        if (token && typeof token === 'string') {
            axiosConfig = _.cloneDeep(this._axiosConfig);
            axiosConfig.headers.authorization = token;
        }
        
        const command =  new PostCommand<ContentType>(endpoint, payload, axiosConfig);

        return retryer(command, policy ? policy : this.policy)
    }

    async patch<ContentType = Entity>(endpoint:string, token?: string, payload?: any, policy?: Policy) {
        let axiosConfig = this._axiosConfig;
        
        if (token && typeof token === 'string') {
            axiosConfig = _.cloneDeep(this._axiosConfig);
            axiosConfig.headers.authorization = token;
        }
        
        const command =  new PatchCommand<ContentType>(endpoint, payload, axiosConfig);

        return retryer(command, policy ? policy : this.policy)
    }

    async get<ContentType = Entity>(endpoint:string, token?: string, policy?: Policy) {
        let axiosConfig = this._axiosConfig;
        
        if (token && typeof token === 'string') {
            axiosConfig = _.cloneDeep(this._axiosConfig);
            axiosConfig.headers.authorization = token;
        }
        
        const command =  new GetCommand<ContentType>(endpoint, axiosConfig);

        return retryer(command, policy ? policy : this.policy)
    }
}