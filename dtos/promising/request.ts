import { TimeOfDay } from '../time/request';
import { IsInt, IsString,IsArray,ValidateNested,MaxLength,Matches,IsNotEmpty, IsOptional } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { Type } from 'class-transformer';

class PromisingRequest {
  @IsString()
  @MaxLength(10)
  promisingName: string;
  @IsString()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/)
  minTime: Date;
  @IsString()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/)
  maxTime: Date;
  @IsInt()
  categoryId: number;
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
  timeTable: TimeOfDay[];
  @IsArray()
  @IsString()
  @ValidateNested({ each: true })
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/, { each: true })
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
