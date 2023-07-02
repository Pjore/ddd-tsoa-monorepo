import { AxiosRequestConfig } from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

export interface JsonObject {
  [key: string]: any;
}
export interface IConfiguration {
  port: string,
  reqTimeout: string,
  app1: AxiosRequestConfig,
  OAS?: JsonObject
}

function get() {
  const config: IConfiguration = {
    port: process.env.PORT,
    reqTimeout: `${29 * 1000}`,
    app1: {
      baseURL: process.env.app1_BASE_URL,
      headers: {
          'Content-Type': 'application/json'
      }
    }
  };

  return config
};

export default { get };
