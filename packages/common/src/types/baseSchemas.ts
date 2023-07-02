import { Schema, Types, Document } from 'mongoose';
import { ILog } from '../domains/logEntry';

type ID = Types.ObjectId

export type Populated<M, K extends keyof M> =
    Omit<M, K> &
    {
        [P in K]: Exclude<M[P], ID[] | ID>
    };

export type Select<M, K extends keyof M>
    = Pick<M, K> & Document

export const logSchema: Record<keyof ILog, any> = {
	date: { type: Schema.Types.Date },
	message: { type: Schema.Types.String },
	type: { type: Schema.Types.String },
	stack: { }
};

