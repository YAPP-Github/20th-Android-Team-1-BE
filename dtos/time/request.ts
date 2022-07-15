import { ValidateNested, IsArray, IsNotEmpty,IsString,Matches,IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { JSONSchema } from 'class-validator-jsonschema';

class TimeRequest {
  @IsNumber()
  unit: number;
  @IsArray()
  @JSONSchema({
    type: 'array',
    items: {
      $ref: '#/components/schemas/TimeOfDay'
    }
  })
  @Type(() => TimeOfDay)
  @ValidateNested()
  timeTable: Array<TimeOfDay>;
}

class TimeOfDay {
  @IsString()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/)
  date: Date;
  @IsArray()
  @IsNumber({},{each: true})
  times: boolean[];
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

export { TimeRequest, TimeOfDay, TimeForChangingDate, indexTime };
