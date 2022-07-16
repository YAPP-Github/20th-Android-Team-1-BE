import PromisingModel from '../../models/promising';
import CategoryKeyword from '../../models/category-keyword';
import { UserResponse } from '../user/response';
import timeUtil from '../../utils/time';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { JSONSchema } from 'class-validator-jsonschema';
import { CategoryResponse } from '../category/response';

export class PromisingResponse {
  @IsInt()
  id: number;
  @IsString()
  promisingName: string;

  @Type(() => UserResponse)
  @ValidateNested()
  owner: UserResponse;

  @IsString()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/)
  minTime: string;
  @IsString()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/)
  maxTime: string;

  @Type(() => CategoryResponse)
  @ValidateNested()
  category: CategoryResponse;

  @IsArray()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/, { each: true })
  availableDates: string[];

  @IsOptional()
  @IsString()
  placeName: string;

  constructor(promising: PromisingModel, category: CategoryKeyword, dates: Date[]) {
    this.id = promising.id;
    this.promisingName = promising.promisingName;
    this.owner = new UserResponse(promising.owner);
    this.minTime = timeUtil.formatDate2String(promising.minTime);
    this.maxTime = timeUtil.formatDate2String(promising.maxTime);
    this.category = new CategoryResponse(category);
    this.placeName = promising.placeName;
    this.availableDates = dates.map((date) => timeUtil.formatDate2String(new Date(date)));
  }
}

export class PromisingTimeTableResponse extends PromisingResponse {
  @JSONSchema({
    type: 'array',
    items: {
      $ref: '#/components/schemas/UserResponse'
    }
  })
  @IsArray()
  @Type(() => UserResponse)
  @ValidateNested({ each: true })
  users: UserResponse[];

  @IsInt()
  @IsArray()
  colors: number[];

  @IsInt()
  totalCount: number;
  @IsNumber()
  unit: number;

  @JSONSchema({
    type: 'array',
    items: {
      $ref: '#/components/schemas/TimeTableDate'
    }
  })
  @IsArray()
  @Type(() => TimeTableDate)
  @ValidateNested({ each: true })
  timeTable: TimeTableDate[];

  constructor(
    promising: PromisingModel,
    dates: Date[],
    users: UserResponse[],
    colors: number[],
    totalCount: number,
    unit: number,
    timeTable: TimeTableDate[]
  ) {
    super(promising, promising.ownCategory, dates);
    this.users = users;
    this.colors = colors;
    this.totalCount = totalCount;
    this.unit = unit;
    this.timeTable = timeTable;
  }
}

export class TimeTableDate {
  @IsString()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/)
  date: string;

  @JSONSchema({
    type: 'array',
    items: {
      $ref: '#/components/schemas/TimeTableUnit'
    }
  })
  @IsArray()
  @Type(() => TimeTableUnit)
  @ValidateNested({ each: true })
  blocks: TimeTableUnit[];

  constructor(date: string, blocks: TimeTableUnit[]) {
    this.date = date;
    this.blocks = blocks;
  }
}

export class TimeTableUnit {
  @IsInt()
  index: number;
  @IsInt()
  count: number;
  @IsInt()
  color: number;

  @JSONSchema({
    type: 'array',
    items: {
      $ref: '#/components/schemas/UserResponse'
    }
  })
  @IsArray()
  @Type(() => UserResponse)
  @ValidateNested({ each: true })
  users: UserResponse[];

  constructor(index: number, count: number, users: UserResponse[], color: number) {
    this.index = index;
    this.count = count;
    this.users = users;
    this.color = color;
  }
}

export class PromisingUserResponse {
  @IsInt()
  id: number;
  @IsString()
  promisingName: string;
  @IsInt()
  ownerId: number;
  @IsString()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/)
  minTime: string;
  @IsString()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/)
  maxTime: string;
  @IsString()
  placeName: string;
  @IsInt()
  memberCount: number;
  @IsBoolean()
  isOwn: boolean;

  constructor(promising: any) {
    this.id = promising.id;
    this.promisingName = promising.promisingName;
    this.ownerId = promising.ownerId;
    this.minTime = timeUtil.formatDate2String(promising.minTime);
    this.maxTime = timeUtil.formatDate2String(promising.maxTime);
    this.memberCount = promising.memberCount;
    this.isOwn = promising.isOwn;
  }
}
