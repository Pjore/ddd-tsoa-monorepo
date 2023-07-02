import { ServerResponse } from 'http';
import morgan from 'morgan'
import { Request, Next } from '../Http';

export class Logger {
    constructor() {

    }

    log(req: Request, res: ServerResponse, next: Next) {
        return morgan('combined')(req, res, next);
    }
}