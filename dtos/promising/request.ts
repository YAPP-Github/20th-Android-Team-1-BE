import { IsNotEmpty } from 'class-validator';
import { TimeOfDay } from '../time/request';

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
    @IsNotEmpty()
    unit: number;
    @IsNotEmpty()
    timeTable: Array<TimeOfDay>;
}

class PromisingInfo {
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

export { PromisingInfo, PromisingRequest }