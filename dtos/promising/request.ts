import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { TimeOfDay } from '../time/request';

class PromisingRequest {
  @IsString()
  @MaxLength(10)
  promisingName: string;
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
  @IsNotEmpty()
  availDate: Array<Date>;

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
