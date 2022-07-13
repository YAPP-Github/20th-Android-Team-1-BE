import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
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

export { PromisingInfo, PromisingRequest };
