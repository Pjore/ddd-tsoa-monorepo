import { BaseEntity } from "./baseEntity";

export class DateEntity extends BaseEntity<Date> {
    constructor(date?: string | Date) {
        const dt = date
            ? typeof date === 'string' 
                ? new Date(date) 
                : date 
            : new Date()
        super(dt);
    }

}