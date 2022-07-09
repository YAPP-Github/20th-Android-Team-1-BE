import { IsNotEmpty } from 'class-validator'; 

class TimeRequest {
    @IsNotEmpty()
    unit: number;
    @IsNotEmpty()
    timeTable: Array<TimeOfDay>;
}

class TimeOfDay {
    @IsNotEmpty()
    date: Date;
    @IsNotEmpty()
    times: Array<boolean>;
}

export default class indexTime {
    @IsNotEmpty()
    startDate: number;
    @IsNotEmpty()
    endDate: number;
}


class TimeForChangingDate {
    @IsNotEmpty()
    unit: number;
    @IsNotEmpty()
    day: Date;
    @IsNotEmpty()
    indexList: Array<indexTime>;
    @IsNotEmpty()
    minTime: Date;
    @IsNotEmpty()
    maxTime: Date;
}

export { TimeRequest, TimeOfDay,TimeForChangingDate,indexTime }