import PromisingModel from '../../models/promising';
import CategoryKeyword from '../../models/category-keyword';
import { UserResponse } from '../user/response';
import timeUtil from '../../utils/time';
import PromisingDateModel from '../../models/promising-date';
import { IsArray, IsBoolean, IsInt, IsString, Matches,ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { JSONSchema } from 'class-validator-jsonschema';


export class PromisingResponse {
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
  placeName:string;
  @Type(() => CategoryKeyword)
  @ValidateNested()
  category: CategoryKeyword | any;

  constructor(promising: PromisingModel, category: CategoryKeyword | null) {
    this.id = promising.id;
    this.promisingName = promising.promisingName;
    this.ownerId = promising.ownerId;
    this.minTime = timeUtil.formatDate2String(promising.minTime);
    this.maxTime = timeUtil.formatDate2String(promising.maxTime);
    this.category = category;
    this.placeName = promising.placeName;
  }
}

export class CreatedPromisingResponse {
  @Type(() => PromisingResponse)
  @ValidateNested()
  promising: PromisingResponse;
  @IsArray()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/, { each: true })  
  availableDates: string[];

  constructor(promising: PromisingModel, dates: PromisingDateModel[]) {
    this.promising = new PromisingResponse(promising, promising.ownCategory);
    this.availableDates = dates.map((date) => {
      return timeUtil.formatDate2String(new Date(date.date));
    });
  }
}

export class PromisingDateResponse {
  @Type(() => PromisingModel)
  @ValidateNested()
  promising: PromisingModel
  @IsArray()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/, { each: true })  
  availDates : Array<string>

  constructor(promising: PromisingModel, availDates: Array<string>) {
    this.promising= promising;
    this.availDates= availDates
  }
}

export class TimeTableResponse {
  @IsArray()
  @JSONSchema({
    type: 'array',
    items: {
      $ref: '#/components/schemas/UserResponse'
    }
  })
  @Type(() => UserResponse)
  @ValidateNested()
  users: UserResponse[];
  @IsInt()
  @IsArray()
  colors: number[];
  @IsString()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/)
  minTime: string;
  @IsString()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/)
  maxTime: string;
  @IsInt()
  totalCount: number;
  unit: number;
  @IsArray()
  @JSONSchema({
    type: 'array',
    items: {
      $ref: '#/components/schemas/TimeTableDate'
    }
  })
  @Type(() => TimeTableDate)
  @ValidateNested()
  timeTable: TimeTableDate[];

  constructor(
    users: UserResponse[],
    colors: number[],
    minTime: Date,
    maxTime: Date,
    totalCount: number,
    unit: number,
    timeTable: TimeTableDate[]
  ) {
    this.users = users;
    this.colors = colors;
    this.minTime = timeUtil.formatDate2String(minTime);
    this.maxTime = timeUtil.formatDate2String(maxTime);
    this.totalCount = totalCount;
    this.unit = unit;
    this.timeTable = timeTable;
  }
}

export class TimeTableDate {
  date: string;
  blocks: TimeTableUnit[];

  constructor(date: string, blocks: TimeTableUnit[]) {
    this.date = date;
    this.blocks = blocks;
  }
}

export class TimeTableUnit {
  index: number;
  count: number;
  users: UserResponse[];
  color: number;

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
  placeName:string;
  @IsInt()
  memberCount:number;
  @IsBoolean()
  isOwn:Boolean;

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
