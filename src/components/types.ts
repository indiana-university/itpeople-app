/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as Department from "../components/Department/store";
import * as Departments from "../components/Departments/store";
import * as People from "../components/Profile/store";
import * as SearchSimple from "../components/Search/store";
import * as Auth from "../components/SignIn/store";
import * as Unit from "../components/Unit/store";
import * as Units from "../components/Units/store";

// The top-level state object
export interface IApplicationState {
  auth: Auth.IState;
  lookup: ILookupState;
  profile: People.IState;
  searchSimple: SearchSimple.IState;
  unit: Unit.IState;
  units: Units.IState;
  department: Department.IState;
  departments: Departments.IState;
  form: any;
  modal: string;
}

export enum ViewStateType {
  Loading,
  Viewing,
  Editing,
  Saving,
  Error
}
export interface IDefaultState<TData> {
  readonly data?: TData;
  readonly error?: string;
  readonly loading: boolean;
}
// Declare state types with `readonly` modifier to get compile time immutability.
// https://github.com/piotrwitek/react-redux-typescript-guide#state-with-type-level-immutability
export interface IApiState<TRequest, TResponse> extends IDefaultState<TResponse> {
  readonly request?: TRequest;
}

import { AnyAction } from "redux";
import { ILookupState } from "./lookup";

export const TaskStartReducer = <TReq, TRes>(state: IApiState<TReq, TRes>, action: AnyAction): IApiState<TReq, TRes> => ({
  ...state,
  error: undefined,
  loading: true,
  request: action.payload
});

export const TaskSuccessReducer = <TReq, TRes>(state: IApiState<TReq, TRes>, action: AnyAction): IApiState<TReq, TRes> => ({
  ...state,
  data: action.payload,
  error: undefined,
  loading: false,
  request: undefined
});

export const TaskErrorReducer = <TReq, TRes>(state: IApiState<TReq, TRes>, action: AnyAction): IApiState<TReq, TRes> => ({
  ...state,
  data: undefined,
  error: action.payload && action.payload.toString(),
  loading: false,
  request: undefined
});


export interface IEntityRequest {
  id: number;
}

export interface IEntity extends IEntityRequest {
  name: string;
  description?: string;
}

export interface IRole {
  role: string;
}

export interface ICollectionRequest extends IEntityRequest {
  unitId: number;
}

export interface IUrl {
  url: string;
}

export interface IUnit extends IEntity, IUrl {
  parentId?: number;
}

export interface IDepartment extends IEntity {
}

export enum ItProRole {
  Admin = "Admin",
  CoAdmin = "CoAdmin",
  Pro = "Pro",
  Aux = "Aux"
}

export enum UitsRole {
  Leader = "Leader",
  Sublead = "Sublead",
  Member = "Member",
  Related = "Related"
}

export enum UnitPermissions {
  Editor = "Editor",
  Viewer = "Viewer"
}

export interface IUnitMemberRequest {
  id?: number;
  unitId: number;
  personId?: number;
  title: string;
  showTitle?: boolean;
  role: ItProRole | UitsRole | string;
  permissions: UnitPermissions | string;
  percentage: number;
  showPercentage?: boolean;
}

export interface IUnitMember extends IUnitMemberRequest {
  person?: IPerson;
}

export interface IUnitMembership extends IUnitMemberRequest {
  unit?: IUnit;
}

export interface ISupportedDepartmentRequest {
  id?: number;
  unitId: number;
  departmentId: number;
}

export interface ISupportedDepartment extends ISupportedDepartmentRequest {
  department?: IEntity;
}

export interface IPerson extends IEntity {
  netId: string;
  position: string;
  location: string;
  campusPhone: string;
  campusEmail: string;
  campus: string;
  departmentId?: number;
  department?: IDepartment;
  // vvv none of this matters yet vvv
  tools: string[];
  expertise: string[];
  responsibilities: string[];
  photoUrl?: string;
}

export interface IAuthRequest {
  code: string
}

export interface IAuthUser {
  user_name: string,
  user_role: string
}