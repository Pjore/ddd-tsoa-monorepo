import { Next, Request, Response } from "../Http";
import { BaseController } from "../BaseController";


export class Exceptions extends BaseController {
    constructor() {
        super();
    }

    async handleJsonParseError(err: any, req: Request, res: Response, next: Next): Promise<void> {
        if (err.type && err.type === 'entity.parse.failed') {
            this.fail(res, err);
        }

        next(err);
    }

    async handleError(err: any, req: Request, res: Response, next: Next): Promise<void> {
        if (!err) {
            next();
            return;
        }

        this.fail(res, err);
    }

    async handleNotFound(req: Request, res: Response): Promise<void> {
        this.fail(res, `404 - ${req.method} ${req.originalUrl}`)
    }
}