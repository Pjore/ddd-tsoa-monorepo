import { Application } from 'express';
import express from 'express';
import cors from 'cors';
import timeout from 'connect-timeout';
import dayjs from 'dayjs';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server as HttpServer } from 'http';
import { IConfiguration } from '../../configurationLoader';
import { Request, Response, Next } from './Http';
import app1Middleware from './middleware';
import * as swaggerUi from "swagger-ui-express";

export class Server {
  server: HttpServer;
  app: Application;

  constructor(private RouterService: any, readonly config: IConfiguration) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.server.listen(config.port);
    this.server.on('error', _onError);
    this.server.on('clientError', _onClientError);
    this.server.on('listening', _onListening);

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(defaultContentTypeMiddleware);

    this.app.use( app1Middleware.logger.log );

    this.app.use(compression());
    this.app.use(cookieParser());
    this.app.use(
        cors({
            exposedHeaders: ['Date', 'ETag', 'timestamp', 'x-ratelimit-reset', 'x-ratelimit-remaining', 'x-ratelimit-limit', 'retry-after'],
        })
    );
    this.app.disable('x-powered-by');

    this.app.use(timeout(config.reqTimeout));
    this.app.use((req, res, next) => {
        !req.timedout && next();
    });

    this.app.use((req, res, next) => {
        res.set('timestamp', dayjs().toString());
        next();
    });

    this.app.use((req:Request, res, next) => {
        req.locals = { ...req.locals };
        next();
    });

    if (config.OAS) {
      this.app.use('/api-docs', swaggerUi.serve);
      this.app.get('/api-docs', swaggerUi.setup(config.OAS));
    }

    RouterService.RegisterRoutes(this.app);

    // Manage exceptions
    this.app.use(async (err: any, req: Request, res: Response, next: Next) => app1Middleware.exceptions.handleError(err, req, res, next));
    this.app.use(async (req: Request, res: Response) => app1Middleware.exceptions.handleNotFound(req, res));
  }
}

const NON_JSON_ENDPOINTS: any = [];

function defaultContentTypeMiddleware(req: Request, res: Response, next: Next) {
    if (NON_JSON_ENDPOINTS.some((urlPath: string) => req?.url?.includes(urlPath))) {
      return next();
    }
  
    req.headers['content-type'] = 'application/json';
  
    return next();
}
/**
 * Event listener for HTTP server "error" event.
 */
function _onError(error: any){
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof this.address() === 'string'
    ? 'Pipe ' + this.address()
    : 'Port ' + this.address();

  // handle specific listen errors with friendly messages
  switch (error.code) {
  case 'EACCES':
    console.error(bind + ' requires elevated privileges');
    process.exit(1);
    break;
  case 'EADDRINUSE':
    console.error(bind + ' is already in use');
    process.exit(1);
    break;
  default:
    throw error;
  }
}

/**
 * Event listener for HTTP server "clientError" event.
 */
function _onClientError(err: any, socket: any) {
  if (socket.readyStatus !== 'closed') {
    console.log(`Error during request: ${err}`);
    const error = 'Error: Invalid request format or query string\r\n\r\n';
    socket.write('HTTP/1.1 400 Bad Request\r\n');
    socket.write('Content-Type: text/plain\r\n');
    socket.write(`Content-Length: ${Buffer.byteLength(error)}\r\n`);
    socket.write('Connection: close\r\n');
    socket.write(error);
    socket.end();
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function _onListening() {
  const bind = typeof this.address() === 'string'
    ? 'Pipe ' + this.address()
    : 'Port ' + JSON.stringify(this.address());
  console.log('Listening on ' + bind);
}
