  import { ITsoaRequest } from '../../utilities/authentication';
import { Response } from 'express';


export abstract class BaseController {
  public static jsonResponse(
    res: Response, code: number, message: string
  ): Response<any> {
    res.type('application/json');
    return res.status(code).json({ message });
  }
  
  /**
	 * Default validation of scope in relation to request input. admin are except from validation
	 * @param req ITsoaRequest
	 * @param accountId string
	 */
	static ValidateScope(req: ITsoaRequest, accountId: string) {
		if (!(req.user.scopes.includes('admin')) && req.user.accountId !== accountId) {
			throw new Error('Query outside of current scope');
		}
	}

  public ok<T>(res: Response, dto?: T): Response<any> {
    if (dto) {
      res.type('application/json');
      return res.status(200).json(dto);
    } else {
      return res.sendStatus(200);
    }
  }

  public created(res: Response): Response<any> {
    return res.sendStatus(201);
  }

  public clientError(res: Response, message?: Error | string): Response<any> {
    return BaseController.jsonResponse(res, 400, message ? typeof message === 'string' ? message : JSON.stringify(message) : 'Unauthorized');
  }

  public unauthorized(res: Response, message?: Error | string): Response<any> {
    return BaseController.jsonResponse(res, 401, message ? typeof message === 'string' ? message : JSON.stringify(message) : 'Unauthorized');
  }

  public paymentRequired(res: Response, message?: Error | string): Response<any> {
    return BaseController.jsonResponse(res, 402, message ? typeof message === 'string' ? message : JSON.stringify(message) : 'Payment required');
  }

  public forbidden(res: Response, message?: Error | string): Response<any> {
    return BaseController.jsonResponse(res, 403, message ? typeof message === 'string' ? message : JSON.stringify(message) : 'Forbidden');
  }

  public notFound(res: Response, message?: Error | string): Response<any> {
    return BaseController.jsonResponse(res, 404, message ? typeof message === 'string' ? message : JSON.stringify(message) : 'Not found');
  }

  public conflict(res: Response, message?: Error | string): Response<any> {
    return BaseController.jsonResponse(res, 409, message ? typeof message === 'string' ? message : JSON.stringify(message) : 'Conflict');
  }

  public tooMany(res: Response, message?: Error | string): Response<any> {
    return BaseController.jsonResponse(res, 429, message ? typeof message === 'string' ? message : JSON.stringify(message) : 'Too many requests');
  }

  public todo(res: Response): Response<any> {
    return BaseController.jsonResponse(res, 400, 'TODO');
  }

  public fail(res: Response, message?: Error | string): Response<any> {
    return BaseController.jsonResponse(res, 500, message ? 
      typeof message === 'string' ? 
      message : 
      message.message ? 
        message.message :
        JSON.stringify(message) : 'Failed');
  }
}