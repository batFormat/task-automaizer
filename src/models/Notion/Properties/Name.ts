import { Expose, Type } from 'class-transformer';

@Expose()
class TitleValueObject {
    @Expose() type: string;
    @Expose() plain_text: string;
}

@Expose()
export default class Name {
    @Expose() id: string;

    @Expose() type: string;

    @Type(() => TitleValueObject)
    @Expose() title: TitleValueObject[];
}


