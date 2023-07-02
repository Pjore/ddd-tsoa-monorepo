import { Document, Model } from 'mongoose';
import { ResultOrError } from '../types/ResultOrError';
import { BaseDomain, DomainAsObject, FlattenProperties, InterfaceOfDomain } from '../domains/baseDomain';
import { BaseList } from '../domains/baseList';
import { DataTransformation } from '../utilities/dataTransformation';
import { AggregationAsObject, BaseAggregation, InterfaceOfAggregation } from '../domains/baseAggregation';

/*type FlattenProperties<T> =
	T extends (string | Date | Number) ? T :
    T extends ObjectId ? string :
    T extends IBaseEntity<infer U> ? U :
    T extends IBaseDomain<infer U> ? FlattenProperties<U> & { _id: string, createdAt?: Date, updatedAt?: Date } :
    T extends IBaseList<infer U> ? FlattenProperties<U>[] :
    T extends Array<infer U> ? FlattenProperties<U>[] :
    T extends object ? { [K in keyof T as T[K] extends Function ? never : K]: FlattenProperties<T[K]> } : T;
*/
export type DomainAsPersistent<Domain> = FlattenProperties<Domain> & { _id: string, createdAt?: string, updatedAt?: string };
export type AggregationAsPersistent<Aggregation> = FlattenProperties<Aggregation>;

export interface IRepositories {
    [repository:string]: BaseRepository<any, any>
}

//@ts-ignore
export abstract class BaseRepository<Domain extends BaseDomain<InterfaceOfDomain<Domain>>, MODEL=any> {
    model: Model<MODEL>;
    constructor(model: Model<MODEL>) {
        this.model = model
    }
    abstract saveExisting(domain: Domain): Promise<ResultOrError<Domain, unknown>>;
    abstract saveNew(domain: Domain): Promise<ResultOrError<Domain, unknown>>;
    abstract find(query: Partial<DomainAsObject<Domain>>): Promise<ResultOrError<Domain[], unknown>>;
    abstract findOne(query: Partial<DomainAsObject<Domain>>): Promise<ResultOrError<Domain, unknown>>;
    abstract delete(id: string ): Promise<ResultOrError<boolean, unknown>>;
    abstract delete(domain: Domain): Promise<ResultOrError<boolean, unknown>>;
    abstract delete(domainOrId: Domain | string ): Promise<ResultOrError<boolean, unknown>>;

    async findPotentialDuplicate(domain: Domain): Promise<ResultOrError<Domain>> {
        const { result: existingDocument, error } = await this.findOne({ id: domain._id.toString() } as Partial<DomainAsObject<Domain>>);
        if (error) {
            return ResultOrError.fail(error);
        }
		
		return ResultOrError.ok(existingDocument ? existingDocument : null );
	}
    async save(domain: Domain): Promise<ResultOrError<Domain, unknown>> {
        const { result: existing, error } = await this.findPotentialDuplicate(domain);
        //TODO: Perhaps we could recurse check for sub-documents here and save them? Instead of doing it in each domain? 

        if(existing) {
            const equal = domain.equals(existing);
            if (equal) {
                return ResultOrError.ok(existing);
            }

            //existing.properties = { ...existing.properties, ...domain.properties };
            domain._id = existing._id;

            return await this.saveExisting(domain);
        }
        else {
            return await this.saveNew(domain);
        }
    }
    static async saveNew<DOMAIN extends BaseDomain<any>>(domain: DOMAIN, repository: BaseRepository<DOMAIN>): Promise<ResultOrError<DOMAIN, unknown>> {
        try {
            const { result: potentialDuplicate, error: findDuplicateError } = await repository.findPotentialDuplicate(domain);
            if(potentialDuplicate || findDuplicateError) {
                return ResultOrError.fail(findDuplicateError ?? `Tag not saved due to potential duplicate of ${potentialDuplicate._id.toString()}`)
            }

            const asPersistent = this.domainToPersistent(domain)
            const newAssetInDb = await repository.model.create(asPersistent);

            return await newAssetInDb ? 
                ResultOrError.ok(domain) : 
                ResultOrError.fail('Unable to save new item to db');
		}
		catch(error) {
			return ResultOrError.fail("")//new LogEntry({ message: 'Could not save to db', stack: error }));
		}
    }

    static async saveExisting<DOMAIN extends BaseDomain<any>>(domain: DOMAIN, repository: BaseRepository<DOMAIN>): Promise<ResultOrError<DOMAIN, unknown>> {
        try {
            const { _id, createdAt, ...props } = this.domainToPersistent(domain);

            return await repository.model.updateOne({ _id: _id }, props) ? 
                ResultOrError.ok(await (await repository.findOne({ id: domain._id.toString() } as any)).result) : 
                ResultOrError.fail('Unable to update existing item');
		}
		catch(error) {
			return ResultOrError.fail({ message: 'Could not save to db', data: error });
		}
    }
    static async saveList<DOMAIN extends BaseDomain<any>>(list: BaseList<DOMAIN>, repository: BaseRepository<DOMAIN>): Promise<ResultOrError<BaseList<DOMAIN>, unknown[]>> {
        try {
            if (!list || list.items.length === 0) {
                return ResultOrError.fail('Empty or missing list');
            }
            const saveResult = await repository.bulkSave(list);
            const subErrors = saveResult.filter(saveResult => saveResult.error).map(saveResult => saveResult.error);
            if (subErrors?.length > 0) {
                return ResultOrError.fail(subErrors);
            }
            else {
                //@ts-ignore()
                return list.constructor.create(saveResult.map(resultOrError => resultOrError.result));
            }
		}
		catch(error) {
			return ResultOrError.fail([{ message: 'Could not save to db', data: error }]);
		}
    }
    async bulkSave(domainArrayOrList: Domain[] | BaseList<Domain>) {
        if (!domainArrayOrList) {
            return [];
        }
        const array = domainArrayOrList instanceof BaseList ? domainArrayOrList.getItems() : domainArrayOrList;
        const savedItems = await Promise.all(array.map(domain => this.save(domain)));
        return savedItems;
    }
    static domainObjectToPersistent<Domain extends BaseDomain<any>>(domainObject: DomainAsObject<Domain>): DomainAsPersistent<Domain> {
        const asPersistent = DataTransformation.recursivePropertyRename(domainObject, 'id', '_id') as DomainAsPersistent<Domain>;

        return asPersistent;
    }
    static domainToPersistent<Domain extends BaseDomain<InterfaceOfDomain<Domain>>>(domain: Domain): DomainAsPersistent<Domain> {
        const asObject = domain.toObject();
        const asPersistent = DataTransformation.recursivePropertyRename(asObject, 'id', '_id') as DomainAsPersistent<Domain>;

        return asPersistent;
    }
    domainToPersistent<RETURNTYPE extends DomainAsPersistent<Domain> = DomainAsPersistent<Domain>>(domain: Domain): RETURNTYPE {
        const asObject = domain.toObject();
        const asPersistent = DataTransformation.recursivePropertyRename(asObject, 'id', '_id') as RETURNTYPE;

        return asPersistent;
    }

    dbObjectToDomainObject<RETURNTYPE extends DomainAsObject<Domain> = DomainAsObject<Domain>>(document: Document<any, any, any>): RETURNTYPE {
        const docAsObj = document.toObject();

        return DataTransformation.recursivePropertyRename(docAsObj, '_id', 'id', ['__v']) as RETURNTYPE;
    }
    
    static dbObjectToDomainObject<Domain extends BaseDomain<InterfaceOfDomain<Domain>>>(document: Document<any, any, Domain> & DomainAsPersistent<Domain>): DomainAsObject<Domain> {
        const docAsObj = document.toObject();

        return DataTransformation.recursivePropertyRename(docAsObj, '_id', 'id', ['__v']) as DomainAsObject<Domain>;
    }

    static dbObjectToAggregationObject<Aggreation extends BaseAggregation<InterfaceOfAggregation<Aggreation>>>(document: Document<any, any, Aggreation> & AggregationAsPersistent<Aggreation>): AggregationAsObject<Aggreation> {
        const docAsObj = document.toObject();

        return DataTransformation.recursivePropertyRename(docAsObj, '_id', 'id', ['__v']) as AggregationAsObject<Aggreation>;
    }
}