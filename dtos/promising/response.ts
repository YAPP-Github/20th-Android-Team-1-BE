import PromisingModel from '../../models/promising';
import CategoryKeyword from '../../models/category-keyword';
import { UserResponse } from '../user/response';
import timeUtil from '../../utils/time';
import PromisingDateModel from '../../models/promising-date';

export class CreatedPromisingResponse {
  promising: PromisingResponse;
  availableDates: string[];

  constructor(promising: PromisingModel, dates: PromisingDateModel[]) {
    console.log('????????');
    this.promising = new PromisingResponse(promising, promising.ownCategory);
    this.availableDates = dates.map((date) => {
      console.log('!!!!!');
      console.log(new Date(date.date));
      console.log(timeUtil.formatDate2String(new Date(date.date)));
      return timeUtil.formatDate2String(new Date(date.date));
    });
  }
}

export class PromisingResponse {
  id: number;
  promisingName: string;
  ownerId: number;
  minTime: string;
  maxTime: string;
  category: CategoryKeyword | any;

  constructor(promising: PromisingModel, category: CategoryKeyword | null) {
    this.id = promising.id;
    this.promisingName = promising.promisingName;
    this.ownerId = promising.ownerId;
    this.minTime = timeUtil.formatDate2String(promising.minTime);
    this.maxTime = timeUtil.formatDate2String(promising.maxTime);
    this.category = category;
  }
}

export class TimeTableResponse {
  users: UserResponse[];
  colors: number[];
  minTime: string;
  maxTime: string;
  totalCount: number;
  unit: number;
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
