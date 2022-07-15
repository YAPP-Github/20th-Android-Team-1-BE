import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import CategoryKeyword from '../../models/category-keyword';
import PromiseModel from '../../models/promise';
import User from '../../models/user';
import timeUtil from '../../utils/time';
import { CategoryResponse } from '../category/response';
import { UserResponse } from '../user/response';

export class PromiseResponse {
  @IsInt()
  id: number;

  @IsString()
  promiseName: string;

  @IsString({})
  promiseDate: string;

  @ValidateNested()
  @Type(() => UserResponse)
  owner: UserResponse;

  @IsBoolean()
  isOwner: boolean;

  @ValidateNested()
  @Type(() => CategoryKeyword)
  category: CategoryResponse;

  @IsArray()
  @JSONSchema({
    type: 'array',
    items: {
      $ref: '#/components/schemas/UserResponse'
    }
  })
  @Type(() => UserResponse)
  members: UserResponse[];

  @IsOptional()
  @IsString()
  placeName: string;

  constructor(
    promise: PromiseModel,
    owner: User,
    category: CategoryKeyword,
    members: User[],
    isOwner: boolean
  ) {
    this.id = promise.id;
    this.promiseName = promise.promiseName;
    this.promiseDate = timeUtil.formatDate2String(promise.promiseDate);
    this.placeName = promise.placeName;
    this.owner = new UserResponse(owner);
    this.category = new CategoryResponse(category);
    this.members = members.map((user) => new UserResponse(user));
    this.isOwner = isOwner;
  }
}
