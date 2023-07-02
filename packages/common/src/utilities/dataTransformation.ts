import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ObjectId } from '../domains/objectId';
import { Validator } from './validator';
import { ResultOrError } from '../types';

type IScope = any;      //TODO: Might not need this type?
type ITarget = any;      //TODO: Might not need this type?
export class DataTransformation {

     // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
     public static transform<T>(obj: any, DTO: ClassConstructor<T>, currentScope?: IScope): T {
        let objCopy = {...{}, ...obj};
        // If object is a Mongoose doc then make it a plain object
        if (typeof obj?._doc !== 'undefined') {
            objCopy = obj.toObject();
        }

        const transformedObject: T = plainToInstance(DTO as any, objCopy as T, { excludeExtraneousValues: true });
        // If executed by a user then account must be set to account of current user #scope
        // eslint-disable-next-line no-prototype-builtins
        if (currentScope && currentScope.accountId && transformedObject.hasOwnProperty('account')) {
            // @ts-ignore
            transformedObject['account'] = currentScope.accountId;
        }// Enities except Asset has the property name accountId
        // eslint-disable-next-line no-prototype-builtins
        if (currentScope && currentScope.accountId && transformedObject.hasOwnProperty('accountId')) {
            // @ts-ignore
            transformedObject['accountId'] = currentScope.accountId;
        }
        // eslint-disable-next-line no-prototype-builtins
        if (currentScope && currentScope.userId && transformedObject.hasOwnProperty('user')) {
            // @ts-ignore
            transformedObject['user'] = currentScope.userId;    //??? Om tjänst vill söka efter ej tilldelad asset, t.ex. licens => user == null?
        }
        // eslint-disable-next-line no-prototype-builtins
        if (currentScope && currentScope.productId && transformedObject.hasOwnProperty('product')) {
            // @ts-ignore
            transformedObject['product'] = currentScope.productId;
        }

        return transformedObject;   //Note: This approach rebuild the object. A class would be transformed into a regular object
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static transformAndStripUndefined<T>(obj: any, DTO: ClassConstructor<T>, currentScope?: IScope): T {
        return DataTransformation.removeUndefined(DataTransformation.transform(obj, DTO, currentScope));   //Note: This approach rebuild the object. A class would be transformed into a regular object
    }

    public static transformArray<T>(obj: any[], DTO: ClassConstructor<T>, currentScope?: IScope): T[] {
        if (Array.isArray(obj)) {
            const cleanObjects:T[] = [];
            obj.forEach(item => cleanObjects.push(DataTransformation.transform(item, DTO, currentScope)));

            return cleanObjects;
        }
    }

    /**
     * Remove all undefined fields recursive.
     * Note: This approach rebuild the object. A class would be transformed into a regular object
     * 
     * @param obj Class instance or object that will be cleaned
     */
    private static removeUndefined<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }

    static get<T>(property: T): T {
        if(typeof property === 'undefined') {
            return undefined;
        }
        else {
            property;
        }
    }

    static scopeToTarget(scope: IScope): ITarget {
        const target:ITarget = {
            ...( scope.accountId && { account: ObjectId.create(scope.accountId).result } ),
            ...( scope.productId && { product: ObjectId.create(scope.productId).result } ),
            ...( scope.appId && { app: ObjectId.create(scope.appId).result } ),
            ...( scope.groupId && { group: ObjectId.create(scope.groupId).result } ),
            ...( scope.userId && { user: ObjectId.create(scope.userId).result } ),
        };

        return target;
    }

    static getProperty<T, K extends keyof T>(obj: T, propertyName: K): T[K] {
        return obj[propertyName];
    }

    static getPropertyFromPath(obj, path: string) {
        let current = obj;
        const pathAsArray = path.split('.');

        for (let i = 0; i < pathAsArray.length; i++) {
            const part = pathAsArray[i];
            if ( part.endsWith(']') ) {
                const regex = /(.*)\[(\d+)\]/;

                const match = regex.exec(part);
                if (match) {
                    const name = match[1];
                    const number = parseInt(match[2]);

                    current = current && current[name][number];
                }
            }
            else {
                current = current && current[part];
            }
        }

        return current
    }

    /**
     * Returns the value of the first property that matches the search term
     * 
     * @param obj 
     * @param propertyName full or partial property name to search for
     * @returns Returns the value of the first property that matches the search term
     */
    static findPropertyValue(obj, propertyName) {
        for (let key in obj) {
          if (key.includes(propertyName)) {
            return obj[key]; // Property found, return its value
          } else if (typeof obj[key] === 'object') {
            const nestedResult = DataTransformation.findPropertyValue(obj[key], propertyName);
            if (nestedResult !== undefined) {
              return nestedResult; // Property found in nested object, return its value
            }
          }
        }
      
        // Property not found
        return undefined;
    }

    /**
     * Searches for properties that matches the search term and returns an array of their values
     * 
     * @param obj 
     * @param searchTerm full or pratial property name to search for
     * @returns Array of values of properties that matches the search term
     */
    static findPropertyValues(obj, searchTerm) {
        let results = [];
      
        for (let key in obj) {
          if (key.includes(searchTerm)) {
            results.push(obj[key]); // Partial match found, add its value to the results array
          } else if (typeof obj[key] === 'object') {
            const nestedResults = DataTransformation.findPropertyValues(obj[key], searchTerm);
            results = results.concat(nestedResults); // Concatenate results from nested objects
          }
        }
      
        return results;
      }

    static recursivePropertyRename(obj: any, targetPropertyName: string, newPropertyName: string, propertiesToBeRemoved?: string[]): any {
        let newObj = {};
    
        if (Validator.isArray(obj)) {
            newObj = obj.map(item => DataTransformation.recursivePropertyRename(item, targetPropertyName, newPropertyName, propertiesToBeRemoved))
        }
        else if (Validator.isObject(obj) || Validator.isClassInstance(obj)) {
            Object.getOwnPropertyNames(obj)
            .filter(propertyName => propertiesToBeRemoved ? !propertiesToBeRemoved.includes(propertyName) : true)
            .forEach(propertyName => {
                // @ts-ignore
                const property = obj[propertyName];
                // @ts-ignore
                newObj[propertyName === targetPropertyName ? newPropertyName : propertyName] = DataTransformation.recursivePropertyRename(property, targetPropertyName, newPropertyName, propertiesToBeRemoved);
            });
        }
        else {
            newObj = obj;
        }
    
        return newObj;
    }

    /**
     * Convert object to query string. Note that all objects are accepted, 
     * however only first level properties and values of type string | number | boolean 
     * will be considered in conversion
     * 
     * @param obj Arbitary object
     * @returns First level properties of object as querystring
     */
    static objectToQueryString(obj: any) {
        return Validator.isObject(obj) 
            ? '?' +
                Object.keys(obj)
                    .map(key => {
                        return ['string', 'boolean', 'number'].includes(typeof obj[key]) 
                            ? `${key}=${encodeURIComponent(obj[key])}` 
                            : '';
                    })
                    .join('&')
            : '';
    }
}

export function GetFirstNLevelsOfObject(obj, n:number, currentLevel: number = 0, parentName: string = '') {
    let nLevelObj = {};
    Object.keys(obj).forEach(propertyName => {
        const path = parentName ? `${parentName}.${propertyName}` : propertyName;
        nLevelObj[propertyName] =  Validator.isValue(obj[propertyName]) ? 
            obj[propertyName] : 
            currentLevel < n ?
                GetFirstNLevelsOfObject(obj[propertyName], n, currentLevel+1, path) :
                path
    });
    
    return nLevelObj;
}

export function GetLeafValues(object): any[] {
    let valueArray = [];
    Object.keys(object).forEach(propertyName => {
        const value = object[propertyName];
        valueArray = [ ...valueArray, ...( Validator.isValue(value) ? [value] : GetLeafValues(value) ) ]
    });

    return valueArray;
}