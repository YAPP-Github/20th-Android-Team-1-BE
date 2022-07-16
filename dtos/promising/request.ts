import { TimeOfDay } from '../time/request';
import {
  IsInt,
  IsString,
  IsArray,
  ValidateNested,
  MaxLength,
  Matches,
  IsOptional,
  IsDate
} from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { Type } from 'class-transformer';

class PromisingRequest {
  @IsString()
  @MaxLength(10)
  promisingName: string;

  @IsString()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/)
  minTime: string;

  @IsString()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/)
  maxTime: string;

  @IsInt()
  categoryId: number;

  unit: number;

  @JSONSchema({
    type: 'array',
    items: {
      $ref: '#/components/schemas/TimeOfDay'
    }
  })
  @IsArray()
  @Type(() => TimeOfDay)
  @ValidateNested({ each: true })
  timeTable: TimeOfDay[];

  @IsArray()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/, { each: true })
  availDate: string[];

  @IsOptional()
  @MaxLength(10)
  placeName: string;
}

class PromisingInfo {
  @MaxLength(10)
  promisingName: string;

  @IsDate()
  minTime: Date;

  @IsDate()
  maxTime: Date;

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
