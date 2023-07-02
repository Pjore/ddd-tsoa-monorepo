import { Schema, Types, Document } from 'mongoose';
import { ILog } from '../domains/logEntry';
import { Payload } from './Payload';
import { Target } from './Target';

type ID = Types.ObjectId

export type Populated<M, K extends keyof M> =
    Omit<M, K> &
    {
        [P in K]: Exclude<M[P], ID[] | ID>
    };

export type Select<M, K extends keyof M>
    = Pick<M, K> & Document

export const targetSchema: Record<keyof Target, any> = {
	account: { type: Schema.Types.ObjectId, ref: 'Account' },
	group: { type: Schema.Types.ObjectId, ref: 'Group' },
	product: { type: Schema.Types.ObjectId, ref: 'Product' },
	order: { type: Schema.Types.ObjectId, ref: 'Order' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    app: { type: Schema.Types.ObjectId, ref: 'App' },
    task: { type: Schema.Types.ObjectId, ref: 'Task' },
};

export const payloadSchema: Record<keyof Payload, any> = {
	name: { type: Schema.Types.String },
	description: { type: Schema.Types.String },
	data: {},
	dataInterface: { type: Schema.Types.String },
	providerRef: { type: Schema.Types.String },
	type: { type: Schema.Types.String },
	status: { type: Schema.Types.String },
	...targetSchema
};

export const logSchema: Record<keyof ILog, any> = {
	date: { type: Schema.Types.Date },
	message: { type: Schema.Types.String },
	type: { type: Schema.Types.String },
	stack: { }
};

