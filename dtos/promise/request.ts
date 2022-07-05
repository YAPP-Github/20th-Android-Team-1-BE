import { IsNotEmpty } from 'class-validator';

export default class PromiseRequest {
    @IsNotEmpty()
    id: number;
    @IsNotEmpty()
    promiseName: string;
    @IsNotEmpty()
    promiseDate: Date;
    @IsNotEmpty()
    placeName: string;
    @IsNotEmpty()
    categoryId: number;
    @IsNotEmpty()
    ownerId: number;
}
