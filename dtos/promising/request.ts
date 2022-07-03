import { IsNotEmpty } from 'class-validator';
import { TimeOfDay } from '../time/request';

class PromisingRequest {
  @IsNotEmpty()
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

  placeName: string;
}

class PromisingInfo {
  @IsNotEmpty()
  promisingName: string;
  @IsNotEmpty()
  minTime: Date;
  @IsNotEmpty()
  maxTime: Date;
  @IsNotEmpty()
  categoryId: number;

  placeName: string;
}

export { PromisingInfo, PromisingRequest };
