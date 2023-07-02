export class Validator {
    static isEmptyObject(inputs: any): boolean {
        const keys = Object.keys(inputs);
        return keys && keys.length > 0 ? false : true;
    }
    static isObject<ObjectType>(obj?: any): obj is Object {
        return (!!obj) && (obj.constructor === Object);
    }

    static isClassInstance<ItemType>(obj?: any): obj is ItemType[] {
        return (!!obj) && /^\s*class\s+/.test(obj.constructor?.toString());
    }

    static isArray<ItemType>(obj?: any): obj is ItemType[] {
        return (!!obj) && (obj.constructor === Array);
    }
    static isValue(value: any, allowDate: boolean = true): value is string | number | boolean | Date {
        const validTypes = allowDate ? ['string', 'number', 'boolean', 'date'] : ['string', 'number', 'boolean'];
        return validTypes.includes(typeof value) || ( allowDate && value instanceof Date );
    }
    static isNullOrUndefined(value?: any): value is null | undefined {
        return value === null || value === undefined;
    }
}

class customClass1 {
    prop1: string;
    prop2: number
}

class customClass2 {
    prop1: string;
    prop2: number;
    constructor() {
        this.prop1 = 'asd';
        this.prop2 = 123;
    }
}

const instance11 = new customClass1();
const instance21 = new customClass2();
const instance22 = new customClass2();

const arr1 = [123,345,12];
const arr2 = [123,instance11,instance21];

const shouldBeTrue = [
    Validator.isObject({a: 'bla'}),
    Validator.isArray(arr1),
    Validator.isArray(arr2),
    Validator.isClassInstance(instance11),
    Validator.isClassInstance(instance21),
    Validator.isClassInstance(instance22),
    Validator.isNullOrUndefined(undefined),
    Validator.isNullOrUndefined(null),
    Validator.isNullOrUndefined(),
];

const shouldBeFalse = [
    Validator.isObject(instance11),
    Validator.isObject(instance21),
    Validator.isObject(instance22),
    Validator.isObject(new Date()),
    Validator.isObject(customClass2),
    Validator.isObject(arr1),
    Validator.isObject(arr2),
    Validator.isObject(),
    Validator.isClassInstance({a: 'bla'}),
    Validator.isClassInstance(arr1),
    Validator.isClassInstance(customClass2),
    Validator.isClassInstance(new Date()),
    Validator.isClassInstance(),
    Validator.isArray({a: 'bla'}),
    Validator.isArray(instance11),
    Validator.isArray(instance21),
    Validator.isArray(),
    Validator.isNullOrUndefined('asd'),
    Validator.isNullOrUndefined(''),
];

console.log(shouldBeFalse);