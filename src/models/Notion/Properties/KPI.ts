import { Expose } from 'class-transformer';

@Expose()
export default class Status {
    @Expose() id: string;

    @Expose() type: string;

    @Expose() checkbox: boolean;
}


