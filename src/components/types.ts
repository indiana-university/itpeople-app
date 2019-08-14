/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as Building from "../components/Building/store";
import * as Department from "../components/Department/store";
import * as Departments from "../components/Departments/store";
import * as Profile from "../components/Profile/store";
import * as People from "../components/People/store";
import * as SearchSimple from "../components/Search/store";
import * as Auth from "../components/SignIn/store";
import * as Unit from "../components/Unit/store";
import * as Units from "../components/Units/store";

// The top-level state object
export interface IApplicationState {
  auth: Auth.IState;
  lookup: ILookupState;
  profile: Profile.IState;
  people: People.IState;
  searchSimple: SearchSimple.IState;
  unit: Unit.IState;
  units: Units.IState;
  building: Building.IState;
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
export interface IEntityStringRequest {
  id: string;
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

export interface IDepartment extends IEntity { }

export interface IBuilding extends IEntityRequest {
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postCode: string
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
  Owner = "Owner",
  Viewer = "Viewer",
  ManageMembers = "ManageMembers",
  ManageTools = "ManageTools"
}

export interface IUnitMemberRequest {
  id?: number;
  unitId: number;
  personId?: number;
  netId?: string;
  title: string;
  showTitle?: boolean;
  role: ItProRole | UitsRole | string;
  permissions: UnitPermissions | string;
  percentage: number;
  showPercentage?: boolean;
  notes?: string;
}

export interface IUnitMemberToolRequest {
  membershipId: number;
  toolId: number;
}

export interface IUnitMemberTool extends IUnitMemberToolRequest {
  id: number;
}

export interface IUnitMember extends IUnitMemberRequest {
  person?: IPerson;
  memberTools: IUnitMemberTool[];
}

export const membersInRole = (members: IUnitMember[], role:UitsRole) =>
  (members || []).filter(m => m.role === role);


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

export interface IBuildingSupportRelationshipRequest {
  id?: number;
  unitId: number;
  buildingId: number;
}

export interface IBuildingSupportRelationship extends IBuildingSupportRelationshipRequest {
  unit: IUnit;
  building: IBuilding;
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

export interface IPeopleRequest {
  roles: string[],
  classes: string[],
  campuses: string[]
}

export const JobClassList = [
  "BizSysAnalysis", 
  "DataAdminAnalysis", 
  "DatabaseArchDesign", 
  "InstructionalTech", 
  "ItLeadership", 
  "ItMultiDiscipline", 
  "ItProjectMgt", 
  "ItSecurityPrivacy", 
  "ItUserSupport", 
  "Networks", 
  "SoftwareAdminAnalysis", 
  "SoftwareDevEng", 
  "SystemDevEng", 
  "UserExperience", 
  "WebAdminDevEng"
]

export const JobClassDisplayNames = {
  "None": "",
  "ItLeadership": "IT Leadership",
  "BizSysAnalysis": "Business System Analysis",
  "DataAdminAnalysis": "Data Administration/Analysis",
  "DatabaseArchDesign": "Database Architecture/Design",
  "InstructionalTech": "Instructional Technology",
  "ItProjectMgt": "IT Project Management",
  "ItSecurityPrivacy": "IT Security/Privacy",
  "ItUserSupport": "IT User Support",
  "ItMultiDiscipline": "IT Multiple Discipline",
  "Networks": "Networks",
  "SoftwareAdminAnalysis": "Software Administration/Analysis",
  "SoftwareDevEng": "Software Developer/Engineer",
  "SystemDevEng": "Systems Developer/Engineer",
  "UserExperience": "User Experience",
  "WebAdminDevEng": "Web Developer/Engineer",
}

export const CampusList = [
  "Bloomington",
  "Indianapolis",
  "Columbus",
  "East",
  "Fort Wayne",
  "Kokomo",
  "Northwest",
  "South Bend",
  "Southeast"
]

export const CampusDisplayNames = {
  "Bloomington": "Bloomington",
  "Indianapolis": "IUPUI (Indianapolis)",
  "Columbus": "IUPUC (Columbus)",
  "East": "East (Richmond)",
  "Fort Wayne": "Fort Wayne",
  "Kokomo": "Kokomo",
  "Northwest": "Northwest (Gary)",
  "South Bend": "South Bend",
  "Southeast": "Southeast (New Albany)"
}

export const RoleList = [
  "Leader",
  "Sublead",
  "Member",
  "Related"
]

// Comparers

export const EntityComparer = (a: IEntity, b: IEntity) => (a.name === b.name ? 0 : a.name < b.name ? -1 : 1);

export const UnitMemberComparer = (a: IUnitMember, b: IUnitMember) => {
  if (!a.person) {
    return -1;
  }
  if (!b.person) {
    return 1;
  }
  return EntityComparer(a.person, b.person);
};

export const SupportRelationshipComparer = (a: ISupportRelationship, b: ISupportRelationship) => EntityComparer(a.department, b.department);
export const BuildingSupportRelationshipComparer = (a: IBuildingSupportRelationship, b: IBuildingSupportRelationship) => EntityComparer(a.building, b.building);
