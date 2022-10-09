import { Expose, Type } from 'class-transformer';

export enum StatusEnum {
    Done = "Done"
}

class StatusValueObject {
    @Expose() id: number;
    @Expose() name: string;
    @Expose() color: string;
}

@Expose()
export default class Status {
    @Expose() id: string;

    @Expose() type: string;

    @Type(() => StatusValueObject)
    @Expose() status: StatusValueObject;
}


