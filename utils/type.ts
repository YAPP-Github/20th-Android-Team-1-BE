import { UserResponse } from '../dtos/user/response';

export interface ColorType {
  FIRST: string;
  SECOND: string;
  THIRD: string;
  FOURTH: string;
  FIFTH: string;
}

export interface TimeTableIndexType {
  0?: UserResponse[];
  1?: UserResponse[];
  2?: UserResponse[];
  3?: UserResponse[];
  4?: UserResponse[];
  5?: UserResponse[];
  6?: UserResponse[];
  7?: UserResponse[];
  8?: UserResponse[];
  9?: UserResponse[];
}

export enum PromisingStatus {
  Owner = 'OWNER',
  Confirmed = 'CONFIRMED', // 404 NOT FOUND
  ResponseAlready = 'RESPONSE_ALREADY',
  ResponseMaximum = 'RESPONSE_MAXIMUM',
  ResponsePossible = 'RESPONSE_POSSIBLE'
}
