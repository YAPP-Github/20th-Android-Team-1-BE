import PromisingModel from '../../models/promising';
import CategoryKeyword from '../../models/category-keyword';
import { UserResponse } from '../user/response';
import timeUtil from '../../utils/time';
import PromisingDateModel from '../../models/promising-date';

export class CreatedPromisingResponse {
  promising: PromisingResponse;
  availableDates: PromisingDateModel[];

  constructor(promising: PromisingModel, dates: PromisingDateModel[]) {
    this.promising = new PromisingResponse(promising, promising.ownCategory);
    this.availableDates = dates;
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
  colors: string[];
  minTime: string;
  maxTime: string;
  unit: number;
  timeTable: TimeTableDate[];

  constructor(
    users: UserResponse[],
    colors: string[],
    minTime: Date,
    maxTime: Date,
    unit: number,
    timeTable: TimeTableDate[]
  ) {
    this.users = users;
    this.colors = colors;
    this.minTime = timeUtil.formatDate2String(minTime);
    this.maxTime = timeUtil.formatDate2String(maxTime);
    this.unit = unit;
    this.timeTable = timeTable;
  }
}

export class TimeTableDate {
  date: string;
  units: TimeTableUnit[];

  constructor(date: string, units: TimeTableUnit[]) {
    this.date = date;
    this.units = units;
  }
}

export class TimeTableUnit {
  index: number;
  count: number;
  users: UserResponse[];
  color: string;

  constructor(index: number, count: number, users: UserResponse[], color: string) {
    this.index = index;
    this.count = count;
    this.users = users;
    this.color = color;
  }
}
