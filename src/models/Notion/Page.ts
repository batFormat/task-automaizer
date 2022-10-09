import { Expose, Type } from 'class-transformer';
import Properties from './Properties'

export default class Page {
    @Expose()
    object: string;

    @Expose()
    id: string;

    @Expose()
    created_time: string;

    @Expose()
    last_edited_time: string;

    @Expose()
    archived: boolean;

    @Expose()
    @Type(() => Properties)
    properties: Properties;

    @Expose()
    url: string;
}


