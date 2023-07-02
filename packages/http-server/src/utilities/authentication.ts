import { Scope } from "@pjore/common/types/IUser";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
import { ILocals } from "@pjore/common/types";
dotenv.config();

export interface ITsoaRequest {
    user: ILocals
}

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<ILocals> {
  
  if (securityName === "tsoa_auth" || securityName === "bearerAuth") {
    
    const token = securityName === "tsoa_auth" ?
      request.body.token ||
      request.query.token ||
      request.headers["x-access-token"] :
      securityName === "bearerAuth" ? 
        request.headers["authorization"] ? request.headers["authorization"].slice(7) : 
        undefined :
      undefined;

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error("No token provided"));
      }
      jwt.verify(token, process.env.SECRET_AUTH, function (err: any, decoded: ILocals) {
        if (err) {
          reject(err);
        }
        else {
          // If global admin, skip and resolve
          if (!decoded.scopes.includes('admin')) {
            if (scopes[0] === 'admin') {
              reject(new Error("Internal only"));
            }
            // If account admin, skip and resolve, if not; check each scope
            if (!decoded.scopes.includes('account.admin')) {
              if (!scopes.some(scope => decoded.scopes.includes(scope as Scope))) {
                reject(new Error("Invalid scope"));
              } 
            }
          }
          decoded.token = token;
          resolve(decoded);
        }
      });
    });
  }
}