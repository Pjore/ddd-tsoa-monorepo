import Account from "./account/models/account";
import { AccountRepository } from "./account/repositories/accountRepository";
import User from "./user/models/user";
import { UserRepository } from "./user/repositories/userRepository";

const accountRepository = new AccountRepository(Account);
const userRepository = new UserRepository(User);

export { accountRepository, userRepository };
