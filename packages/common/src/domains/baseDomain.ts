import { Validator } from "../utilities/validator";
import { BaseEntity, IBaseEntity } from "./baseEntity";
import { BaseList, IBaseList } from "./baseList";
import { ObjectId } from "./objectId";
import { DateEntity } from "./date";
import { ResultOrError } from "../types/ResultOrError";

type IScope = any; //TODO: Type it or remove it
/*
class ResultOrError<T = any, Y = any> {
	constructor(obj?) {}
  static fail(obj) { return new ResultOrError()}
}*/

export type FlattenProperties<T> =
    T extends (string | Number) ? T :
		T extends ( Date | DateEntity) ? string :
    T extends IBaseEntity<infer U> ? string :
    T extends IBaseDomain<infer U> ? FlattenProperties<U> & { id?: string, createdAt?: string, updatedAt?: string } :
    T extends IBaseList<infer U> ? FlattenProperties<U>[] :
    T extends Array<infer U> ? FlattenProperties<U>[] :
    T extends object ? { [K in keyof T as T[K] extends Function ? never : K]: FlattenProperties<T[K]> } : T;

export type DomainInterface<Interface> = FlattenProperties<Interface> & { id?: string, createdAt?: string, updatedAt?: string };

//@ts-ignore
export type DomainAsObject<Domain extends BaseDomain<InterfaceOfDomain<Domain>>> = FlattenProperties<Domain> & { id?: string, createdAt?: string, updatedAt?: string };
//@ts-ignore
export type DomainAsInputObject<Domain extends BaseDomain<InterfaceOfDomain<Domain>>> = FlattenProperties<Domain> & { id?: string };


//@ts-ignore
export type InterfaceOfDomain<Domain> =
  Domain extends BaseDomain<infer Interface> ? Interface : never;

export interface IDomain {
  _id: ObjectId,
  createdAt: DateEntity,
  updatedAt: DateEntity
}
export interface IBaseDomain<Interface > extends IDomain {
  properties: Interface
}

export abstract class BaseDomain<Interface> implements IBaseDomain<Interface> {
    properties: Interface;
    _id: ObjectId;
    readonly createdAt: DateEntity;
    readonly updatedAt: DateEntity;
    constructor(object?: Interface, id?: ObjectId, createdAt?: DateEntity, updatedAt?: DateEntity) {
        this._id = id ?? new ObjectId();
        this.properties = object;
        this.createdAt = createdAt ?? new DateEntity();
        this.updatedAt = updatedAt ?? new DateEntity();
    }
    get id() {
        return this._id;
    }
    //@ts-ignore
    toObject(): DomainAsObject<BaseDomain<Interface>> {

      return { ...recursiveToObject(this.properties), id: this._id.toString(), createdAt: this.createdAt.toString(), updatedAt: this.updatedAt.toString() };
    }
    //@ts-ignore
    toInputObject(): DomainAsInputObject<BaseDomain<Interface>> {

      return { ...recursiveToObject2(this.properties, false), id: this._id.toString() };
    }
    equals (existing?: BaseDomain<Interface>) : boolean {

        if (existing == null || existing == undefined) {
          return false;
        }

        if ( this === existing) {
          return true;
        }
    
        if (BaseDomain.isDomain(existing)) {
          return isPropertiesEqual<Interface>(this.properties, existing.properties);
        }
    
        return false;
    }
    static create(object?: any, scope?: IScope): ResultOrError<BaseDomain<any>, any> {
        return ResultOrError.fail('Not implemented');
    }
    static isDomain = (v: any): v is BaseDomain<any> => {
        return v instanceof BaseDomain;
    };  

}

function recursiveToObject<Interface>(object: Interface, allowDate: boolean = true): FlattenProperties<Interface> {
	let obj = {} as FlattenProperties<Interface>;

	Object.getOwnPropertyNames(object).forEach(propertyName => {
    //@ts-ignore
		const property = object[propertyName];
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
        //@ts-ignore
        Validator.isArray(property) ? property.map(item => Validator.isObject(item) ? recursiveToObject(item, allowDate): item) : 
				Validator.isObject(property) ? recursiveToObject(property, allowDate) :
				property
		}
	});

  return obj;
}

function recursiveToObject2<Interface>(object: Interface, allowDate: boolean = true): FlattenProperties<Interface> {
	let obj = {} as FlattenProperties<Interface>;

	Object.getOwnPropertyNames(object).forEach(propertyName => {
    //@ts-ignore
		const property = object[propertyName];
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
			obj[propertyName] = Validator.isValue(property, allowDate) ? property : 
        //@ts-ignore
        Validator.isArray(property) ? property.map(item => Validator.isObject(item) ? recursiveToObject2(item, allowDate): item) : 
				Validator.isObject(property) ? recursiveToObject2(property, allowDate) :
				property
		}
	});

  return obj;
}

function isPropertiesEqual<Interface>(newObject: Interface, existingObject: Interface): boolean {
  const result = Object.getOwnPropertyNames(newObject).map(propertyName => {
    //@ts-ignore
    const newProperty = newObject[propertyName];
    //@ts-ignore
    const existingProperty = existingObject[propertyName];

    if (newProperty && !existingProperty) {
      return false;
    }

    if (newProperty instanceof BaseDomain) {
      //@ts-ignore
			return newProperty.equals(existingProperty);
		}
		else if (newProperty instanceof BaseEntity) {
			return newProperty.toString() === existingProperty.toString();
		}
		else if (newProperty instanceof BaseList || Validator.isArray(newProperty)) {
      const newArray = newProperty instanceof BaseList ? newProperty.items : newProperty;
      //@ts-ignore
      const existingArray = newProperty instanceof BaseList ? existingProperty.items : existingProperty;

			for (let i =   0; i < newArray.length; i++) {
        const firstItem = newArray[i];
        const secondItem = existingArray[i]
        let propertiesEqual = false;
        if(firstItem instanceof BaseDomain) {
          propertiesEqual = firstItem.equals(secondItem);
        }
        else if(firstItem instanceof BaseEntity) {
          propertiesEqual = firstItem.equals(secondItem);
        }
        else {
          propertiesEqual = isPropertiesEqual(firstItem, secondItem);
        }
        
        if (!propertiesEqual) {
          return false;
        }
      }
      return true;
		}
		else {
      const res = Validator.isValue(newProperty) ? 
                    newProperty === existingProperty : 
                    //@ts-ignore
                    Validator.isObject(newProperty) ? 
                      isPropertiesEqual(newProperty, existingProperty) :
                      false
			return res;
		}
  });
  return !result.includes(false);
}