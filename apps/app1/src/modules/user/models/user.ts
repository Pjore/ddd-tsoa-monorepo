import _ from 'lodash';
import { Model, model, Schema, Document } from 'mongoose';
import { User as UserDomain } from '@pjore/common/domains/user';
import { UserAsPersistent } from '../repositories/userRepository';

export interface IUserModelMethods {
	getRefDocument<T>(path: string): Promise<T>;
} 
export interface IUserModel extends IUserModelMethods, UserAsPersistent {} 
export type UserModelDoc = Document<any, any, UserDomain> & UserAsPersistent

const schema: Schema<IUserModel> = new Schema<any>(
{
	_id: { type: Schema.Types.ObjectId },
	accountId: {type:Schema.Types.ObjectId, ref: 'Account'},
	email: { type: Schema.Types.String, required:true},
	scopes: [{ type: Schema.Types.String}],
	status: {type: Schema.Types.String},
	password: {type: Schema.Types.String},
},
{
	timestamps: true,
	versionKey: false,
	toObject: {
		transform: function (doc:any, ret) {
			ret._id = doc._id.toString();
			if (doc.accountId) ret.accountId = doc.accountId.toString();
		}
	},
	toJSON: {
		transform: function (doc, ret) {
			ret._id = doc._id.toString();
			if (doc.accountId) ret.accountId = doc.accountId.toString();
			delete ret.password;
		}
	}
});

schema.method('getRefDocument', async function <T>(path: string): Promise<T> {
	const populated = await this.populate(path);
	return _.get(populated, path) as T;
});

const User: Model<IUserModel> = model('User', schema);

export default User;

