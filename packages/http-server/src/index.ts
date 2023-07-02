import { Server } from './infra/httpServer/Server';
import * as dotenv from 'dotenv';
dotenv.config();

export async function startHttpServer(RouterService, configuration) {
  const server = new Server(RouterService, configuration);
}