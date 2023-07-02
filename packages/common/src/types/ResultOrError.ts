import { LogEntry } from "../domains/logEntry";
import { Status } from "../enums";

export type IResultOrError<RES, ERR> = ResultOrError<RES, ERR>
export class ResultOrError<RES, STACKTYPE=any> {
	private _result?: RES;
	private _error?: LogEntry<STACKTYPE>;
	status: Status;
	constructor(status: Status = 'none', result?: RES, error?: LogEntry<STACKTYPE>) {
		this.status = status;
		this._result = result ? result : null;
		this._error = error ? error : null;
	}

    static try<RESULTTYPE>(value: RESULTTYPE, messageIfError: string): ResultOrError<RESULTTYPE, string> {
        return value ? ResultOrError.ok(value) : ResultOrError.fail(messageIfError);
    }
	static ok<RES>(result?:RES): ResultOrError<RES> {
		return new ResultOrError('success', result, null);
	}
	static fail<STACKTYPE>(error?: any): ResultOrError<null, STACKTYPE> {
		// Get error when LogEntry is instanced from here
		/*const logEntry = new LogEntry({
				message: error?.message ?? Array.isArray(error) ? 'Validation error' : 'Unknown error',
				stack: error,
				date: new Date(),
				type: 'error'
			});*/
			const logEntry = {
				message: typeof error === 'string' ? error : error?.message ?? Array.isArray(error) ? 'Validation error' : 'Unknown error',
				stack: error,
				date: new Date(),
				type: 'error'
			}
		return new ResultOrError('error', null, logEntry as any);
	}
	static partial<RES, STACKTYPE>(result:RES, error: any | LogEntry<STACKTYPE>): ResultOrError<RES, any | STACKTYPE > {
		return new ResultOrError('partial', result, error);
	}
	get result(): RES {
		return this._result;
	}
	set result(newresult: RES) {
		if(this._error) {
			this.status = 'partial';
		}
		else {
			this.status = 'success';
		}
		this._result = newresult;
	}
	get error(): LogEntry<STACKTYPE> {
		return this._error;
	}
	set error(newError: LogEntry<STACKTYPE>) {
		if(this._result) {
			this.status = 'partial';
		}
		else {
			this.status = 'error';
		}
		this._error = newError;
	}
}