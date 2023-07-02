import { ResultOrError } from "../types/ResultOrError";
import { BaseEntity } from "./baseEntity";
import { Types as MongooseTypes } from "mongoose";

export class ObjectId extends BaseEntity<string> {
    constructor(id?: string) {
        super()
        this.properties.value = id ? id : new MongooseTypes.ObjectId(id).toString();
    }
    static create(value?: string): ResultOrError<ObjectId, any> {
        try {
            return ResultOrError.ok(new ObjectId(value))
        } catch (error) {
            return ResultOrError.fail(error)
        }
    }
}