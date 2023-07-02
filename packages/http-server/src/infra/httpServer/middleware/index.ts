import { Exceptions } from "./Exceptions";
import { Logger } from "./Logger";

/**
 * Possible common middleware such as auth and log and similar goes here
 */

export interface IMiddleware {
    logger: Logger;
    exceptions: Exceptions;
}

function getMiddleware(): IMiddleware {
    return {
        logger: new Logger(),
        exceptions: new Exceptions()
    };
}

export default getMiddleware();