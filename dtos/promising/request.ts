import { IsInt, IsString, IsArray, MaxLength, Matches, IsOptional } from 'class-validator';

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

  @IsArray()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/, { each: true })
  availableDates: string[];

  @IsOptional()
  @MaxLength(10)
  placeName: string;
}

class PromisingSession {
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

  @IsInt()
  ownerId: number;

  @IsArray()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/, { each: true })
  availableDates: string[];

  @IsOptional()
  @MaxLength(10)
  placeName: string;

  constructor(
    promisingName: string,
    minTime: string,
    maxTime: string,
    categoryId: number,
    ownerId: number,
    availDates: string[],
    placeName: string
  ) {
    this.placeName = promisingName;
    this.minTime = minTime;
    this.maxTime = maxTime;
    this.categoryId = categoryId;
    this.ownerId = ownerId;
    this.availableDates = availDates;
    this.placeName = placeName;
  }
}

class ConfirmPromisingRequest {
  @IsString()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/)
  promiseDate: string;
}

export { PromisingSession, PromisingRequest, ConfirmPromisingRequest };
