import { Validator } from "../utilities";
import { ResultOrError } from "../types/ResultOrError";
import { BaseDomain, DomainAsObject, FlattenProperties, InterfaceOfDomain } from "./baseDomain";
import { BaseEntity } from "./baseEntity";

type IScope = any; //TODO: Type it or remove it
export interface IBaseList<ItemType> {
    items: ItemType[];
}

//@ts-ignore
export type ItemAsObject<ItemType extends BaseDomain<InterfaceOfDomain<ItemType>> | BaseEntity<InterfaceOfDomain<ItemType>>> = FlattenProperties<ItemType> & { id?: string, createdAt?: string, updatedAt?: string };
//@ts-ignore
export type ItemAsInputObject<ItemType extends BaseDomain<InterfaceOfDomain<ItemType>> | BaseEntity<InterfaceOfDomain<ItemType>>> = FlattenProperties<ItemType> & { id?: string };

export abstract class BaseList<ItemType extends BaseDomain<InterfaceOfDomain<ItemType>> | BaseEntity<InterfaceOfDomain<ItemType>>> implements IBaseList<ItemType> {
    readonly items: ItemType[];
    constructor(items?: ItemType[]) {
        this.items = items ?? [];
    }
    getItems() {
        return this.items;
    }
    toArray() {
        return this.items.map(item => item.toObject());
    }
    add(list: BaseList<ItemType>)
    add(items: ItemType[])
    add(item: ItemType | ItemType[] | BaseList<ItemType>) {
        let items: ItemType[] = []
        if (BaseList.isList(item)) {
            item.items.forEach(itm => {
                if (!this.exists(itm)) {
                    this.items.push(itm);
                }
            });
        }
        else if (Validator.isArray(item)) {
            item.forEach(itm => {
                if (!this.exists(itm)) {
                    this.items.push(itm);
                }
            });
        }
        else {
            if (!this.exists(item)) {
                this.items.push(item);
            }
        } 
    }
    exists(item: ItemType) {
        return this.items.filter((existingItem) => BaseList.compareItems(item, existingItem)).length !== 0
    }

    static compareItems<ItemType extends BaseDomain<any> | BaseEntity<any>>(firstItem: ItemType, secondItem: ItemType): boolean {
        if (firstItem instanceof BaseDomain && secondItem instanceof BaseDomain) {
            return firstItem?.equals(secondItem) ?? false
        }
        else if (firstItem instanceof BaseEntity && secondItem instanceof BaseEntity) {
            return firstItem?.equals(secondItem) ?? false
        }
        else {
            return false;
        }
    }

    static isList = (v: any): v is BaseList<any> => {
        return v instanceof BaseList;
    }

    
    static create(object?: DomainAsObject<any>[], scope?: IScope): ResultOrError<BaseList<any>, any> {
        return ResultOrError.fail('Not implemented');
    }
}