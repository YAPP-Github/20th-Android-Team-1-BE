import PromisingModel from '../../models/promising';
import CategoryKeyword from '../../models/category-keyword';
import { UserResponse } from '../user/response';
import timeUtil from '../../utils/time';

export class PromisingResponse {
  id: number;
  promisingName: string;
  ownerId: number;
  minTime: Date;
  maxTime: Date;
  category: CategoryKeyword | any;

  constructor(promising: PromisingModel, category: CategoryKeyword | null) {
    this.id = promising.id;
    this.promisingName = promising.promisingName;
    this.ownerId = promising.ownerId;
    this.minTime = promising.minTime;
    this.maxTime = promising.maxTime;
    this.category = category;
  }
}

export class TimeTableResponse {
  minTime: string;
  maxTime: string;
  unit: number;
  timeTable: TimeTableUnit[];

  constructor(minTime: Date, maxTime: Date, unit: number, timeTable: TimeTableUnit[]) {
    this.minTime = timeUtil.formatDate2String(minTime);
    this.maxTime = timeUtil.formatDate2String(maxTime);
    this.unit = unit;
    this.timeTable = timeTable;
  }
}

export class TimeTableUnit {
  date: string;
  count: number;
  users: UserResponse[];
  color: string;

  constructor(date: string, count: number, users: UserResponse[], color: string) {
    this.date = date;
    this.count = count;
    this.users = users;
    this.color = color;
  }
}
