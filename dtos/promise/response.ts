import PromiseModel from '../../models/promise';
import { CategoryResponse } from '../category/response';
import { UserReponse } from '../user/response';

export class PromiseReponse {
  id: number;
  promiseName: string;
  promiseDate: Date;
  placeName: string;
  owner: UserReponse;
  category: CategoryResponse;

  constructor(promise: PromiseModel) {
    this.id = promise.id;
    this.promiseName = promise.promiseName;
    this.promiseDate = promise.promiseDate;
    this.placeName = promise.placeName;
    this.owner = new UserReponse(promise.owner);
    this.category = new CategoryResponse(promise.category);
  }
}
