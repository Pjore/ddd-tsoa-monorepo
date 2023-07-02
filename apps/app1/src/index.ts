import ConfigurationLoader from '@pjore/app1/configurationLoader'
import { startHttpServer } from '@pjore/http-server/index';
import * as dotenv from 'dotenv';
import * as RouterService from './generated/routes';
import { connectToDB } from './infra/mongoose';
dotenv.config();

async function start() {
  const configuration = ConfigurationLoader.get();
  const mongoDbUrl = process.env.MONGODB_URL;
  await connectToDB(mongoDbUrl);
  const server = startHttpServer(RouterService, configuration);
}

start();