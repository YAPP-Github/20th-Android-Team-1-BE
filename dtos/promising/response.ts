import PromisingModel from '../../models/promising';
import CategoryKeyword from '../../models/category-keyword';
import { UserResponse } from '../user/response';
import timeUtil from '../../utils/time';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { JSONSchema } from 'class-validator-jsonschema';
import { CategoryResponse } from '../category/response';
import User from '../../models/user';
import { PromisingStatus } from '../../utils/type';

export class PromisingStatusResponse {
  @IsEnum(PromisingStatus)
  status: string;

  constructor(status: string) {
    this.status = status;
  }
}

export class PromisingResponse {
  @IsInt()
  id: number;
  @IsString()
  @MaxLength(10)
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

  @JSONSchema({
    type: 'array',
    items: {
      $ref: '#/components/schemas/UserResponse'
    }
  })
  @IsArray()
  @Type(() => UserResponse)
  @ValidateNested({ each: true })
  members: UserResponse[];

  @IsOptional()
  @IsString()
  @MaxLength(10)
  placeName: string;

  constructor(
    promising: PromisingModel,
    category: CategoryKeyword,
    dates: Date[],
    members: User[]
  ) {
    this.id = promising.id;
    this.promisingName = promising.promisingName;
    this.owner = new UserResponse(promising.owner);
    this.minTime = timeUtil.formatDate2String(promising.minTime);
    this.maxTime = timeUtil.formatDate2String(promising.maxTime);
    this.category = new CategoryResponse(category);
    this.placeName = promising.placeName;
    this.availableDates = dates.map((date) => timeUtil.formatDate2String(new Date(date)));
    this.members = members.map((member) => new UserResponse(member));
  }
}

export class PromisingTimeStampResponse extends PromisingResponse {
  @IsString()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/)
  updatedAt: string;
  @IsBoolean()
  isOwner: boolean;
  @IsBoolean()
  isResponsed: boolean;

  constructor(
    promising: PromisingModel,
    category: CategoryKeyword,
    dates: Date[],
    members: User[],
    user: User
  ) {
    super(promising, category, dates, members);
    const updatedAT2KST = new Date(promising.updatedAt);
    updatedAT2KST.setHours(updatedAT2KST.getHours() + 9);
    this.updatedAt = timeUtil.formatDate2String(updatedAT2KST);
    this.isOwner = promising.owner.id == user.id;
    this.isResponsed = members.filter((member) => member.id == user.id).length != 0;
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
  members: UserResponse[];

  @IsInt({ each: true })
  @IsArray()
  colors: number[];

  @IsInt()
  totalCount: number;
  @IsNumber({ maxDecimalPlaces: 1 })
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
    members: User[],
    colors: number[],
    totalCount: number,
    unit: number,
    timeTable: TimeTableDate[]
  ) {
    super(promising, promising.ownCategory, dates, members);
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

export class SessionResponse {
  @IsUUID()
  uuid: string;

  constructor(uuid: string) {
    this.uuid = uuid;
  }
}

export class PromisingSessionResponse {
  @IsString()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/)
  minTime: string;
  @IsString()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/)
  maxTime: string;
  @IsInt()
  totalCount: number;
  @IsNumber()
  unit: number;
  @IsArray()
  @Matches(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/, { each: true })
  availableDates: string[];

  constructor(
    minTime: string,
    maxTime: string,
    totalCount: number,
    unit: number,
    availableDates: string[]
  ) {
    this.minTime = minTime;
    this.maxTime = maxTime;
    this.totalCount = totalCount;
    this.unit = unit;
    this.availableDates = availableDates;
  }
}

export class CreatedPromisingResponse {
  @IsNumber()
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}
