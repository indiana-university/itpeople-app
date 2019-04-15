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

export enum Permissions {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Delete = "DELETE"
}

export namespace Permissions {
  export const canGet = (permissions: Permissions[]) => permissions.indexOf(Permissions.Get) > -1;
  export const canPost = (permissions: Permissions[]) => permissions.indexOf(Permissions.Post) > -1;
  export const canPut = (permissions: Permissions[]) => permissions.indexOf(Permissions.Put) > -1;
  export const canDelete = (permissions: Permissions[]) => permissions.indexOf(Permissions.Delete) > -1;
  export const parse = (s: string) => s as Permissions;
}

// action = {type; payload: IApiResponse}
export interface IDefaultState<TData> {
  readonly permissions: Permissions[];
  readonly data?: TData;
  readonly error?: string;
  readonly loading: boolean;
}

// Declare state types with `readonly` modifier to get compile time immutability.
// https://github.com/piotrwitek/react-redux-typescript-guide#state-with-type-level-immutability
export interface IApiState<TRequest, TResponse> extends IDefaultState<TResponse> {
  readonly request?: TRequest;
}

export const defaultState = () => {
  return {
    permissions: [],
    data: undefined,
    error: undefined,
    loading: false,
    request: undefined
  };
};

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
  // TODO: set payload type to IApiRepsonse or handle other payload types
  permissions: action.payload.permissions,
  data: action.payload.data,
  error: undefined,
  loading: false,
  request: undefined
});

export const TaskErrorReducer = <TReq, TRes>(state: IApiState<TReq, TRes>, action: AnyAction): IApiState<TReq, TRes> => ({
  ...state,
  data: undefined,
  error: action.payload,
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

export interface IDepartment extends IEntity {}

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

export interface IUnitMemberToolRequest {
  membershipId: number
  toolId: number
}

export interface IUnitMemberTool extends IUnitMemberToolRequest {
  id: number
}

export interface IUnitMember extends IUnitMemberRequest {
  person?: IPerson;
  memberTools: IUnitMemberTool[]
}

export interface IUnitMembership extends IUnitMemberRequest {
  unit?: IUnit;
}

export interface ISupportRelationshipRequest {
  id?: number;
  unitId: number;
  departmentId: number;
}

export interface ISupportRelationship extends ISupportRelationshipRequest {
  unit: IUnit;
  department: IDepartment;
}

export interface IPerson {
  id: number;
  name: string;
  netId: string;
  position: string;
  location: string;
  campusPhone: string;
  campusEmail: string;
  campus: string;
  departmentId?: number;
  department?: IDepartment;
  // vvv none of this matters yet vvv
  expertise: string;
  responsibilities: string;
  photoUrl?: string;
}

export interface IAuthRequest {
  code: string;
}
export interface IAuthResult {
  access_token: string;
}
export interface IAuthUser {
  user_name: string;
  user_id: number;
}

export interface ITool extends IEntity {
  enabled?: boolean;
}

export interface IToolGroup extends IEntity {
  tools: Array<ITool>;
}
