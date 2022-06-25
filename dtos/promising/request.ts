import { IsNotEmpty } from 'class-validator';

export default class PromisingRequest {
    @IsNotEmpty()
    promisingName: string;
    @IsNotEmpty()
    ownerId: number;
    @IsNotEmpty()
    minTime: Date;
    @IsNotEmpty()
    maxTime: Date;
    @IsNotEmpty()
    categoryId: number;
}
