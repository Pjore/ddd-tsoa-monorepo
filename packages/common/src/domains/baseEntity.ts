import { ResultOrError } from "../types/ResultOrError";
import { Validator } from "../utilities/validator";
import { BaseDomain } from "./baseDomain";

export interface IValue<ValueType> {
    value: ValueType
}

export type InterfaceOfEntity<Entity> =
    Entity extends BaseEntity<infer Interface> ? Interface : unknown;
export interface IBaseEntity<ValueType> {
    value: ValueType
}
export abstract class BaseEntity<ValueType> implements IBaseEntity<ValueType> {
    readonly properties: IValue<ValueType>;
    constructor(value?: ValueType) {
        this.properties = { value: value ?? undefined };
    }
    get value() {
        return this.properties.value;
    }
    toObject(): IValue<ValueType> {
        return this.properties;
    }
    toString(): string {
        return this.value ? 
            typeof this.value === 'string' ?
                this.value :
                BaseDomain.isDomain(this.value) ? 
                    JSON.stringify(this.value.toObject()) :
                    Validator.isObject(this.value) ?
                        JSON.stringify(this.value) :
                        //@ts-ignore
                        this.value?.toString() 
            : '';
    }
    equals (object?: any) : boolean {

        if (object == null || object == undefined) {
          return false;
        }
    
        if (this === object) {
          return true;
        }
    
        if (!BaseEntity.isEntity(object)) {
          return false;
        }
    
        return this.value === object.value;
    }

    static isEntity = (v: any): v is BaseEntity<any> => {
        return v instanceof BaseEntity;
    }

    static create(value?: any): ResultOrError<BaseEntity<any>, any> {
        return ResultOrError.fail('Not implemented');
    }
}
