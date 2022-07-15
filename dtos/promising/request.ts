import { IsNotEmpty, IsOptional } from 'class-validator';
import { TimeOfDay } from '../time/request';
import { IsInt, IsString,IsDate,IsArray } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { Type } from 'class-transformer';
import { Matches } from 'class-validator';
import { MaxLength } from 'class-validator';

class PromisingRequest {
  @IsString()
  @MaxLength(10)
  promisingName: string;
  @IsNotEmpty()
  minTime: Date;
  @IsNotEmpty()
  maxTime: Date;
  @IsNotEmpty()
  @IsInt()
  categoryId: number;
  @IsNotEmpty()
  unit: number;
  @IsNotEmpty()
  @IsArray()
  @JSONSchema({
    type: 'array',
    items: {
      $ref: '#/components/schemas/TimeOfDay'
    }
  })
  @Type(() => TimeOfDay)
  timeTable: TimeOfDay[];
  @IsNotEmpty()
  @IsArray()
  availDate: Date[];
  @IsString()
  @IsOptional()
  @MaxLength(10)
  placeName: string;
}

class PromisingInfo {
  @IsString()
  @MaxLength(10)
  promisingName: string;
  @IsNotEmpty()
  minTime: Date;
  @IsNotEmpty()
  maxTime: Date; 
  @IsNotEmpty()
  @IsInt()
  categoryId: number;

  @IsOptional()
  @MaxLength(10)
  placeName: string;
}

class ConfirmPromisingRequest {
  @IsString()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/)
  promiseDate: string;
}

export { PromisingInfo, PromisingRequest, ConfirmPromisingRequest };
