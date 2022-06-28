import { IsNotEmpty } from 'class-validator';

class PromisingRequest {
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

export { PromisingRequest }