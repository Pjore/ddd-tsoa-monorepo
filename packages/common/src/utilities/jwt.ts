import { Validator } from '../utilities';
import * as jsonwebtoken from 'jsonwebtoken'
import * as dotenv from 'dotenv';
dotenv.config();

export function generateJWT(objectToSign: unknown, secret?: string): string {
    if(!Validator.isObject(objectToSign)) {
        throw new Error('No object to sign');
    }
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    const payload = { 
        ...objectToSign, 
        exp: parseInt((expirationDate.getTime() / 1000) + '', 10)
    };
  
    return jsonwebtoken.sign(payload, secret? secret : process.env.SECRET_AUTH);
}

export function decryptJWT<T = any>(token: string, secret?: string): T {
    return jsonwebtoken.verify(token, secret ? secret : process.env.SECRET_AUTH) as T
}