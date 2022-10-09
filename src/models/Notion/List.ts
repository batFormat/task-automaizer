import { Expose, Type } from 'class-transformer';
import Page from './Page';

export default class List {
    @Expose()
    type: string;

    @Expose()
    object: string;

    @Expose()
    @Type(() => Page)
    results: Page[];

    @Expose()
    next_cursor: string | null;

    @Expose()
    has_more: boolean;
}
