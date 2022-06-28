import CategoryKeyword from '../../models/category-keyword';
import PromiseModel from '../../models/promise';
import User from '../../models/user';
import { CategoryResponse } from '../category/response';
import { UserReponse } from '../user/response';

export class PromiseReponse {
  id: number;
  promiseName: string;
  promiseDate: Date;
  placeName: string;
  owner: UserReponse;
  category: CategoryResponse;

  constructor(promise: PromiseModel, owner: User, category: CategoryKeyword) {
    this.id = promise.id;
    this.promiseName = promise.promiseName;
    this.promiseDate = promise.promiseDate;
    this.placeName = promise.placeName;
    this.owner = new UserReponse(owner);
    this.category = new CategoryResponse(category);
  }
}