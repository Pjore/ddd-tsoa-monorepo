export interface Locals {
	app1Token: string;
	userId?: string;
	taskId?: string;
	groupId?: string;
	accountId?: string;
	productId?: string;
	appId?: string;
	domain?: string;
}
export interface Request {
	locals?: Locals;
}


export interface Response<ResBody = any> {
};
