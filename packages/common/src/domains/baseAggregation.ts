import { Validator } from "../utilities/validator";
import { BaseEntity } from "./baseEntity";
import { BaseList } from "./baseList";
import { BaseDomain, FlattenProperties } from "./baseDomain";
import { ResultOrError } from "../types/ResultOrError";

//@ts-ignore
export type AggregationAsObject<Aggregation extends BaseAggregation<InterfaceOfAggregation<Aggregation>>> = FlattenProperties<Aggregation>;

export type InterfaceOfAggregation<Aggregation> =
Aggregation extends BaseAggregation<infer Interface> ? Interface : never;

export interface IBaseAggregation<Interface> {
  aggregates: Interface,
}

export abstract class BaseAggregation<Interface> implements IBaseAggregation<Interface> {
    readonly aggregates: Interface;
    constructor(object?: Interface) {
        this.aggregates = object;
    }
    toObject(): AggregationAsObject<BaseAggregation<Interface>> {
		//@ts-ignore
      	return recursiveToObject(this.aggregates);
    }
    static create(object?: any): ResultOrError<BaseAggregation<any>, any> {
        return ResultOrError.fail('Not implemented');
    }
    static isAggregation = (v: any): v is BaseAggregation<any> => {
        return v instanceof BaseAggregation;
    };  

}

function recursiveToObject<Interface>(object: Interface): FlattenProperties<Interface> {
	let obj = {} as FlattenProperties<Interface>;

	Object.getOwnPropertyNames(object).forEach(propertyName => {
		//@ts-ignore
		const property = object[propertyName] as KnownType;
		if (property instanceof BaseDomain) {
			//@ts-ignore
			obj[propertyName] = property.toObject();
		}
		else if (property instanceof BaseEntity) {
			//@ts-ignore
			obj[propertyName] = property.toString();
		}
		else if (property instanceof BaseList) {
			//@ts-ignore
			obj[propertyName] = property.items.map(item => item instanceof BaseDomain ? 
				item.toObject() : 
				item instanceof BaseEntity ? 
					item.toString() :
					item
			);
		}
		else {
			//@ts-ignore
			obj[propertyName] = Validator.isValue(property) ? property : 
				Validator.isObject(property) ? recursiveToObject(property) :
				Validator.isArray(property) ? property.map(item => recursiveToObject(property)) : 
				property
		}
	});

  return obj;
}

