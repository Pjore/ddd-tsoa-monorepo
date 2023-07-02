import { Scope } from "./IUser";


export interface ILocals {
  userId?: string;
  accountId: string;
  productId?: string;
  groupId?: string;
  taskId?: string;
  scopes?: Scope[];
  token?: string;
  orderId?: string;
}
