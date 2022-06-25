import { IsNotEmpty } from 'class-validator';
import Time from './front-time';

export default class TimeRequest {
    @IsNotEmpty()
    unit: number;
    @IsNotEmpty()
    timeTable: Array<Time>;
}
