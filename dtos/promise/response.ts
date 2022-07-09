import CategoryKeyword from '../../models/category-keyword';
import PromiseModel from '../../models/promise';
import User from '../../models/user';
import timeUtil from '../../utils/time';
import { CategoryResponse } from '../category/response';
import { UserResponse } from '../user/response';

export class PromiseResponse {
  id: number;
  promiseName: string;
  promiseDate: string;
  placeName: string;
  owner: UserResponse;
  category: CategoryResponse;
  members: UserResponse[];

  constructor(promise: PromiseModel, owner: User, category: CategoryKeyword, members: User[]) {
    this.id = promise.id;
    this.promiseName = promise.promiseName;
    this.promiseDate = timeUtil.formatDate2String(promise.promiseDate);
    this.placeName = promise.placeName;
    this.owner = new UserResponse(owner);
    this.category = new CategoryResponse(category);
    this.members = members.map((user) => new UserResponse(user));
  }
}
