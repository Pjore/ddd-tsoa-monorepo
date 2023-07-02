import { Request as ExpressReq, Response as ExpressRes, NextFunction as ExpressNext } from 'express';
import { Request as BaseRequest, Response as BaseResponse } from '@pjore/common/types/Http';

export interface Request extends ExpressReq, BaseRequest {
}

export interface Response<ResBody = any> extends BaseResponse<ResBody>, ExpressRes {
};

export interface Next extends ExpressNext {
};