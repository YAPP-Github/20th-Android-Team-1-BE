import { IsNotEmpty } from 'class-validator';

export default class EventRequest {
    @IsNotEmpty()
    promisingId: number;
    @IsNotEmpty()
    userId: number;
}
