import { IsNotEmpty } from 'class-validator';

export class PromisingRequest {
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
