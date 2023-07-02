import { IConfiguration } from '@pjore/http-server/configurationLoader';
import * as swaggerSpec from './generated/swagger.json'
import * as dotenv from 'dotenv';
dotenv.config();

function get() {
  const config: IConfiguration = {
    port: process.env.PORT,
    reqTimeout: `${29 * 1000}`,
    app1: {
      baseURL: process.env.app1_BASE_URL,
      headers: {
          'Content-Type': 'application/json'
      }
    },
    OAS: swaggerSpec
  };

  return config
};

export default { get };
