import { Expose, Type } from 'class-transformer';
import Status from './Properties/Status'
import Name from './Properties/Name'
import KPI from './Properties/KPI'

export default class Properties {
    @Expose()
    @Type(() => Status)
    Status: Status;

    @Expose()
    @Type(() => Name)
    Name: Name;

    @Expose()
    @Type(() => KPI)
    KPI: KPI;
}


