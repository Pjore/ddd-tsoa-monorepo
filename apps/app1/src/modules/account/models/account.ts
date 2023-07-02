import _ from 'lodash';
import { Model, model, Schema } from 'mongoose';
import { AccountAsPersistent } from '../repositories/accountRepository';

export interface IAccountModelMethods {
	getRefDocument<T>(path: string): Promise<T>;
} 
export interface IAccountModel extends IAccountModelMethods, AccountAsPersistent {} 

const schema: Schema<IAccountModel> = new Schema<any>(
{
	_id: { type: Schema.Types.ObjectId },
	status: {type: Schema.Types.String},
},
{
	timestamps: true,
	versionKey: false,
	toJSON: {
		transform: function (doc, ret) {
			ret._id = doc._id.toString();
		}
	}
});

schema.method('getRefDocument', async function <T>(path: string): Promise<T> {
	const populated = await this.populate(path);
	return _.get(populated, path) as T;
});

const Account: Model<IAccountModel> = model('Account', schema);

export default Account;

