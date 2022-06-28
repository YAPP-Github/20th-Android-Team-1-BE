import PromisingModel from '../../models/promising';
import CategoryKeyword from '../../models/category-keyword';
import User from '../../models/user';

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

export class TimeTableUnit {
  date: string;
  count: number;
  users: User[];
  color: string;

  constructor(date: string, count: number, users: User[], color: string) {
    this.date = date;
    this.count = count;
    this.users = users;
    this.color = color;
  }
}
