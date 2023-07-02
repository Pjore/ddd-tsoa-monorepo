import { ObjectId } from "../domains/objectId";

export type Role = 'user' | 'accountAdmin';
export type Scope = 'admin' | 'account.admin' | 'account.write' | 'account.read' | 'user.read' | 'user.write' | 'user.admin' | 'task.write';
const Roles = [ 'user', 'accountAdmin' ]
export interface IUser {
    accountId: ObjectId;
    email: string;
    scopes?: Scope[];
    status?: string;
    password?: string;
}
