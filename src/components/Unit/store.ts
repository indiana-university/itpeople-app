/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { IApiState, IEntity, ViewStateType } from "../types";
import { lookup } from "../lookup";

//#region TYPES
export const enum UnitActionTypes {
  UNIT_FETCH_REQUEST = "@@unit/FETCH_REQUEST",
  UNIT_FETCH_SUCCESS = "@@unit/FETCH_SUCCESS",
  UNIT_FETCH_ERROR = "@@unit/FETCH_ERROR",
  UNIT_FETCH_MEMBERS_REQUEST = "@@unit/FETCH_MEMBERS_REQUEST",
  UNIT_FETCH_MEMBERS_SUCCESS = "@@unit/FETCH_MEMBERS_SUCCESS",
  UNIT_FETCH_MEMBERS_ERROR = "@@unit/FETCH_MEMBERS_ERROR",
  UNIT_FETCH_CHILDREN_REQUEST = "@@unit/FETCH_CHILDREN_REQUEST",
  UNIT_FETCH_CHILDREN_SUCCESS = "@@unit/FETCH_CHILDREN_SUCCESS",
  UNIT_FETCH_CHILDREN_ERROR = "@@unit/FETCH_CHILDREN_ERROR",
  UNIT_FETCH_PARENT_REQUEST = "@@unit/FETCH_PARENT_REQUEST",
  UNIT_FETCH_PARENT_SUCCESS = "@@unit/FETCH_PARENT_SUCCESS",
  UNIT_FETCH_PARENT_ERROR = "@@unit/FETCH_PARENT_ERROR",
  UNIT_FETCH_DEPARTMENTS_REQUEST = "@@unit/FETCH_DEPARTMENTS_REQUEST",
  UNIT_FETCH_DEPARTMENTS_SUCCESS = "@@unit/FETCH_DEPARTMENTS_SUCCESS",
  UNIT_FETCH_DEPARTMENTS_ERROR = "@@unit/FETCH_DEPARTMENTS_ERROR",
  UNIT_EDIT = "@@unit/UNIT_EDIT",
  UNIT_SAVE_REQUEST = "@@unit/SAVE_REQUEST",
  UNIT_SAVE_SUCCESS = "@@unit/SAVE_SUCCESS",
  UNIT_SAVE_ERROR = "@@unit/SAVE_ERROR",
  UNIT_SAVE_MEMBER_REQUEST = "@@unit/SAVE_MEMBER_REQUEST",
  UNIT_SAVE_MEMBER_SUCCESS = "@@unit/SAVE_MEMBER_SUCCESS",
  UNIT_SAVE_MEMBER_ERROR = "@@unit/SAVE_MEMBER_ERROR",
  UNIT_DELETE_MEMBER_REQUEST = "@@unit/UNIT_DELETE_MEMBER_REQUEST",
  UNIT_DELETE_MEMBER_SUCCESS = "@@unit/UNIT_DELETE_MEMBER_SUCCESS",
  UNIT_DELETE_MEMBER_ERROR = "@@unit/UNIT_DELETE_MEMBER_ERROR",
  UNIT_SAVE_CHILD_REQUEST = "@@unit/SAVE_CHILD_REQUEST",
  UNIT_SAVE_CHILD_SUCCESS = "@@unit/SAVE_CHILD_SUCCESS",
  UNIT_SAVE_CHILD_ERROR = "@@unit/SAVE_CHILD_ERROR",
  UNIT_DELETE_CHILD_REQUEST = "@@unit/DELETE_CHILD_REQUEST",
  UNIT_DELETE_CHILD_SUCCESS = "@@unit/DELETE_CHILD_SUCCESS",
  UNIT_DELETE_CHILD_ERROR = "@@unit/DELETE_CHILD_ERROR",
  UNIT_SAVE_PARENT_REQUEST = "@@unit/SAVE_PARENT_REQUEST",
  UNIT_SAVE_PARENT_SUCCESS = "@@unit/SAVE_PARENT_SUCCESS",
  UNIT_SAVE_PARENT_ERROR = "@@unit/SAVE_PARENT_ERROR",
  UNIT_DELETE_PARENT_REQUEST = "@@unit/DELETE_PARENT_REQUEST",
  UNIT_DELETE_PARENT_SUCCESS = "@@unit/DELETE_PARENT_SUCCESS",
  UNIT_DELETE_PARENT_ERROR = "@@unit/DELETE_PARENT_ERROR",
  UNIT_SAVE_DEPARTMENT_REQUEST = "@@unit/SAVE_DEPARTMENT_REQUEST",
  UNIT_SAVE_DEPARTMENT_SUCCESS = "@@unit/SAVE_DEPARTMENT_SUCCESS",
  UNIT_SAVE_DEPARTMENT_ERROR = "@@unit/SAVE_DEPARTMENT_ERROR",
  UNIT_DELETE_DEPARTMENT_REQUEST = "@@unit/DELETE_DEPARTMENT_REQUEST",
  UNIT_DELETE_DEPARTMENT_SUCCESS = "@@unit/DELETE_DEPARTMENT_SUCCESS",
  UNIT_DELETE_DEPARTMENT_ERROR = "@@unit/DELETE_DEPARTMENT_ERROR",
  UNIT_CANCEL = "@@unit/UNIT_CANCEL"
}

export interface IUnitRequest {
  id: number;
}

export interface ICollectionRequest extends IUnitRequest {
  unitId: number;
}

export interface IUrl {
  url: string;
}

export interface IUnitMemberRequest {
  id?: number;
  unitId: number;
  personId?: number;
  title: string;
  role: ItProRole | UitsRole | string;
  permissions: UnitPermissions | string;
  percentage: number;
}

export interface IUnitMember extends IUnitMemberRequest {
  person?: IUser;
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

export interface IUnit extends IEntity, IUrl {
  parentId?: number;
}

export interface IUnitProfile extends IUnit {
  members: IUnitMember[];
  supportedDepartments: IEntity[];
  parent?: IEntity;
  children?: IEntity[];
}

export interface ISupportedDepartmentRequest {
  id?: number;
  unitId: number;
  departmentId: number;
}

export interface ISupportedDepartment extends ISupportedDepartmentRequest {
  department?: IEntity;
}

export interface IState {
  profile: IApiState<IUnitRequest, IUnit>;
  members: IApiState<IUnitRequest, IUnitMember[]>;
  unitChildren: IApiState<IUnitRequest, IEntity[]>; // children conflicts with react props 😟
  parent: IApiState<IUnitRequest, IEntity>;
  departments: IApiState<IUnitRequest, ISupportedDepartment[]>;
  view: ViewStateType;
}
//#endregion

//#region ACTIONS
import { action } from "typesafe-actions";

const edit = () => action(UnitActionTypes.UNIT_EDIT, {});
const saveUnitRequest = (request: IUnit) => action(UnitActionTypes.UNIT_SAVE_REQUEST, request);
const cancel = () => action(UnitActionTypes.UNIT_CANCEL, {});
const fetchUnit = (request: IUnitRequest) => action(UnitActionTypes.UNIT_FETCH_REQUEST, request);
const fetchUnitMembers = (request: IUnitRequest) => action(UnitActionTypes.UNIT_FETCH_MEMBERS_REQUEST, request);
const fetchUnitDepartments = (request: IUnitRequest) => action(UnitActionTypes.UNIT_FETCH_DEPARTMENTS_REQUEST, request);
const saveUnitDepartment = (request: ISupportedDepartment) => action(UnitActionTypes.UNIT_SAVE_DEPARTMENT_REQUEST, request);
const deleteUnitDepartment = (request: ISupportedDepartment) => action(UnitActionTypes.UNIT_DELETE_DEPARTMENT_REQUEST, request);
const fetchUnitChildren = (request: IUnitRequest) => action(UnitActionTypes.UNIT_FETCH_CHILDREN_REQUEST, request);
const saveUnitChild = (request: IUnitRequest) => action(UnitActionTypes.UNIT_SAVE_CHILD_REQUEST, request);
const deleteUnitChild = (request: IUnitRequest) => action(UnitActionTypes.UNIT_DELETE_CHILD_REQUEST, request);
const fetchUnitParent = (request: IUnitRequest) => action(UnitActionTypes.UNIT_FETCH_PARENT_REQUEST, request);
const saveUnitParent = (request: IUnitRequest) => action(UnitActionTypes.UNIT_SAVE_PARENT_REQUEST, request);
const deleteUnitParent = (request: IUnitRequest) => action(UnitActionTypes.UNIT_DELETE_PARENT_REQUEST, request);
const saveMemberRequest = (member: IUnitMemberRequest) => action(UnitActionTypes.UNIT_SAVE_MEMBER_REQUEST, member);
const deleteMemberRequest = (member: IUnitMember) => action(UnitActionTypes.UNIT_DELETE_MEMBER_REQUEST, member);
const lookupUnit = (q: string) => lookup(q ? `/units?q=${q}` : "");
const lookupDepartment = (q: string) => lookup(q ? `/departments?q=${q}` : "");
const lookupUser = (q: string) => lookup(q ? `/people?q=${q}` : "");
//#endregion

//#region REDUCER
import { Reducer, AnyAction } from "redux";
import { TaskErrorReducer, TaskStartReducer, TaskSuccessReducer } from "../types";

// Type-safe initialState!
const initialState: IState = {
  profile: { loading: false },
  members: { loading: false },
  unitChildren: { loading: false },
  parent: { loading: false },
  departments: { loading: false },
  view: ViewStateType.Viewing
};

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
// state.unit.profile.data
// state.unit.members.data
// state.unit.departments.data
// state.unit.children.data
// state.unit.parent.data
const reducer: Reducer<IState> = (state = initialState, act) => {
  switch (act.type) {
    case UnitActionTypes.UNIT_EDIT:
      return { ...state, view: ViewStateType.Editing };
    case UnitActionTypes.UNIT_CANCEL:
      return { ...state, view: ViewStateType.Viewing };
    //
    case UnitActionTypes.UNIT_FETCH_REQUEST:
      return { ...state, profile: TaskStartReducer(state.profile, act) };
    case UnitActionTypes.UNIT_FETCH_SUCCESS:
      return { ...state, profile: TaskSuccessReducer(state.profile, act) };
    case UnitActionTypes.UNIT_FETCH_ERROR:
      return { ...state, profile: TaskErrorReducer(state.profile, act) };
    case UnitActionTypes.UNIT_SAVE_REQUEST:
      return { ...state, profile: TaskStartReducer(state.profile, act) };
    case UnitActionTypes.UNIT_SAVE_SUCCESS:
      return { ...state, profile: TaskSuccessReducer(state.profile, act) };
    case UnitActionTypes.UNIT_SAVE_ERROR:
      return { ...state, profile: TaskErrorReducer(state.profile, act) };
    //
    case UnitActionTypes.UNIT_FETCH_MEMBERS_REQUEST:
      return { ...state, members: TaskStartReducer(state.members, act) };
    case UnitActionTypes.UNIT_FETCH_MEMBERS_SUCCESS:
      return { ...state, members: TaskSuccessReducer(state.members, act) };
    case UnitActionTypes.UNIT_FETCH_MEMBERS_ERROR:
      return { ...state, members: TaskErrorReducer(state.members, act) };
    case UnitActionTypes.UNIT_SAVE_MEMBER_REQUEST:
      return { ...state, members: TaskStartReducer(state.members, act) };
    case UnitActionTypes.UNIT_SAVE_MEMBER_ERROR:
      return { ...state, members: TaskErrorReducer(state.members, act) };
    case UnitActionTypes.UNIT_DELETE_MEMBER_REQUEST:
      return { ...state, members: TaskStartReducer(state.members, act) };
    case UnitActionTypes.UNIT_DELETE_MEMBER_ERROR:
      return { ...state, members: TaskErrorReducer(state.members, act) };
    //
    case UnitActionTypes.UNIT_FETCH_CHILDREN_REQUEST:
      return { ...state, unitChildren: TaskStartReducer(state.unitChildren, act) };
    case UnitActionTypes.UNIT_FETCH_CHILDREN_SUCCESS:
      return { ...state, unitChildren: TaskSuccessReducer(state.unitChildren, act) };
    case UnitActionTypes.UNIT_FETCH_CHILDREN_ERROR:
      return { ...state, unitChildren: TaskErrorReducer(state.unitChildren, act) };
    case UnitActionTypes.UNIT_SAVE_CHILD_REQUEST:
      return { ...state, unitChildren: TaskStartReducer(state.unitChildren, act) };
    case UnitActionTypes.UNIT_SAVE_CHILD_SUCCESS:
      return { ...state, unitChildren: TaskSuccessReducer(state.unitChildren, act) };
    case UnitActionTypes.UNIT_SAVE_CHILD_ERROR:
      return { ...state, unitChildren: TaskErrorReducer(state.unitChildren, act) };
    //
    case UnitActionTypes.UNIT_FETCH_PARENT_REQUEST:
      return { ...state, parent: TaskStartReducer(state.parent, act) };
    case UnitActionTypes.UNIT_FETCH_PARENT_SUCCESS:
      return { ...state, parent: TaskSuccessReducer(state.parent, act) };
    case UnitActionTypes.UNIT_FETCH_PARENT_ERROR:
      return { ...state, parent: TaskErrorReducer(state.parent, act) };
    case UnitActionTypes.UNIT_SAVE_PARENT_REQUEST:
      return { ...state, parent: TaskStartReducer(state.parent, act) };
    case UnitActionTypes.UNIT_SAVE_PARENT_SUCCESS:
      return { ...state, parent: TaskSuccessReducer(state.parent, act) };
    case UnitActionTypes.UNIT_SAVE_PARENT_ERROR:
      return { ...state, parent: TaskErrorReducer(state.parent, act) };
    //
    case UnitActionTypes.UNIT_FETCH_DEPARTMENTS_REQUEST:
      return { ...state, departments: TaskStartReducer(state.departments, act) };
    case UnitActionTypes.UNIT_FETCH_DEPARTMENTS_SUCCESS:
      return { ...state, departments: TaskSuccessReducer(state.departments, act) };
    case UnitActionTypes.UNIT_FETCH_DEPARTMENTS_ERROR:
      return { ...state, departments: TaskErrorReducer(state.departments, act) };
    case UnitActionTypes.UNIT_SAVE_DEPARTMENT_REQUEST:
      return { ...state, departments: TaskStartReducer(state.departments, act) };
    case UnitActionTypes.UNIT_SAVE_DEPARTMENT_SUCCESS:
      return { ...state, departments: TaskSuccessReducer(state.departments, act) };
    case UnitActionTypes.UNIT_SAVE_DEPARTMENT_ERROR:
      return { ...state, departments: TaskErrorReducer(state.departments, act) };
    case UnitActionTypes.UNIT_DELETE_DEPARTMENT_SUCCESS:
      return { ...state, departments: TaskSuccessReducer(state.departments, act) };
    case UnitActionTypes.UNIT_DELETE_DEPARTMENT_ERROR:
      return { ...state, departments: TaskErrorReducer(state.departments, act) };

    default:
      return state;
  }
};
//#endregion

//#region SAGA
import { all, fork, takeEvery, put } from "redux-saga/effects";
import { apiFn, httpGet, httpPost, httpPut, httpDelete, callApiWithAuth, apiResources } from "../effects";
import { IUnitMembership, IUser } from "../Profile/store";

function* handleFetchUnit(api: apiFn, request: IUnitRequest) {
  yield httpGet<IUnitProfile>(
    api,
    apiResources.units.root(request.id),
    data => action(UnitActionTypes.UNIT_FETCH_SUCCESS, data),
    error => action(UnitActionTypes.UNIT_FETCH_ERROR, error)
  );
}

function* handleFetchUnitMembers(api: apiFn, request: IUnitRequest) {
  yield httpGet<IUnitMembership[]>(
    api,
    apiResources.units.members(request.id),
    data => action(UnitActionTypes.UNIT_FETCH_MEMBERS_SUCCESS, data),
    error => action(UnitActionTypes.UNIT_FETCH_MEMBERS_ERROR, error)
  );
}

function* handleFetchUnitChildren(api: apiFn, request: IUnitRequest) {
  yield httpGet<IUnit[]>(
    api,
    apiResources.units.children(request.id),
    data => action(UnitActionTypes.UNIT_FETCH_CHILDREN_SUCCESS, data),
    error => action(UnitActionTypes.UNIT_FETCH_CHILDREN_ERROR, error)
  );
}

function* handleFetchUnitDepartments(api: apiFn, request: IUnitRequest) {
  yield httpGet<IEntity[]>(
    api,
    apiResources.units.supportedDepartments(request.id),
    data => action(UnitActionTypes.UNIT_FETCH_DEPARTMENTS_SUCCESS, data),
    error => action(UnitActionTypes.UNIT_FETCH_DEPARTMENTS_ERROR, error)
  );
}

function* handleFetchUnitParent(api: apiFn, unit: IUnit) {
  if (unit.parentId) {
    yield httpGet<IUnit[]>(
      api,
      apiResources.units.root(unit.parentId),
      data => action(UnitActionTypes.UNIT_FETCH_PARENT_SUCCESS, data),
      error => action(UnitActionTypes.UNIT_FETCH_PARENT_ERROR, error)
    );
  } else {
    yield put(action(UnitActionTypes.UNIT_FETCH_PARENT_SUCCESS, undefined));
  }
}

/* 
GET/POST/PUT/DELETE /units/{unit_id}
GET/POST/PUT/DELETE /units/{unit_id}/members/{membership_id} = {personId:null, title:"...", role:"..."}
GET/POST/DELETE /units/{unit_id}/children/{child_unit_id}
GET/POST/DELETE /units/{unit_id}/parent/{parent_unit_id}
GET/POST/DELETE /units/{unit_id}/supported_departments/{department_id}
*/

function* handleSaveUnit(api: apiFn, unit: IUnit) {
  if (unit.id) {
    yield httpPut<IUnit, IUnitRequest>(
      api,
      apiResources.units.root(unit.id),
      unit,
      response => action(UnitActionTypes.UNIT_FETCH_REQUEST, {id: unit.id}),
      error => action(UnitActionTypes.UNIT_SAVE_ERROR, error)
    );
  } else {
    yield httpPost<IUnit, IUnitProfile>(
      api,
      apiResources.units.root(),
      unit,
      response => action(UnitActionTypes.UNIT_SAVE_SUCCESS, response),
      error => action(UnitActionTypes.UNIT_SAVE_ERROR, error)
    );
  }
}

function* handleSaveMember(api: apiFn, member: IUnitMemberRequest) {
  if (member.id) {
    yield httpPut<IUnitMemberRequest, IUnitRequest>(
      api,
      apiResources.units.members(member.unitId, member.id),
      member,
      _ => action(UnitActionTypes.UNIT_FETCH_MEMBERS_REQUEST, { id: member.unitId }),
      error => action(UnitActionTypes.UNIT_SAVE_MEMBER_ERROR, error)
    );
  } else {
    yield httpPost<IUnitMemberRequest, IUnitRequest>(
      api,
      apiResources.units.members(member.unitId),
      member,
      _ => action(UnitActionTypes.UNIT_FETCH_MEMBERS_REQUEST, { id: member.unitId }),
      error => action(UnitActionTypes.UNIT_SAVE_MEMBER_ERROR, error)
    );
  }
}

function* handleDeleteMember(api: apiFn, member: IUnitMember) {
  yield httpDelete(
    api,
    apiResources.units.members(member.unitId, member.id),
    () => action(UnitActionTypes.UNIT_FETCH_MEMBERS_REQUEST, { id: member.unitId }),
    error => action(UnitActionTypes.UNIT_DELETE_MEMBER_ERROR, error)
  );
}

function* handleSaveDepartment(api: apiFn, department: ISupportedDepartmentRequest) {
  yield httpPost<ISupportedDepartmentRequest, IUnitRequest>(
    api,
    apiResources.units.supportedDepartments(department.unitId),
    department,
    _ => action(UnitActionTypes.UNIT_FETCH_DEPARTMENTS_REQUEST, { id: department.unitId }),
    error => action(UnitActionTypes.UNIT_SAVE_DEPARTMENT_ERROR, error)
  );
}

function* handleDeleteDepartment(api: apiFn, department: ISupportedDepartmentRequest) {
  yield httpDelete(
    api,
    apiResources.units.supportedDepartments(department.unitId, department.id),
    () => action(UnitActionTypes.UNIT_FETCH_DEPARTMENTS_REQUEST, { id: department.unitId }),
    error => action(UnitActionTypes.UNIT_DELETE_DEPARTMENT_ERROR, error)
  );
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchUnitFetch() {
  yield takeEvery(UnitActionTypes.UNIT_FETCH_REQUEST, (a: AnyAction) => handleFetchUnit(callApiWithAuth, a.payload));
  yield takeEvery(UnitActionTypes.UNIT_FETCH_MEMBERS_REQUEST, (a: AnyAction) => handleFetchUnitMembers(callApiWithAuth, a.payload));
  yield takeEvery(UnitActionTypes.UNIT_FETCH_DEPARTMENTS_REQUEST, (a: AnyAction) => handleFetchUnitDepartments(callApiWithAuth, a.payload));
  yield takeEvery(UnitActionTypes.UNIT_FETCH_CHILDREN_REQUEST, (a: AnyAction) => handleFetchUnitChildren(callApiWithAuth, a.payload));
  // The unit parent is defined by a parentId on the unit record, so we must await the unit record fetch.
  yield takeEvery(UnitActionTypes.UNIT_FETCH_SUCCESS, (a: AnyAction) => handleFetchUnitParent(callApiWithAuth, a.payload));
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchUnitSave() {
  yield takeEvery(UnitActionTypes.UNIT_SAVE_REQUEST, (a: AnyAction) => handleSaveUnit(callApiWithAuth, a.payload));
  yield takeEvery(UnitActionTypes.UNIT_SAVE_MEMBER_REQUEST, (a: AnyAction) => handleSaveMember(callApiWithAuth, a.payload));
  yield takeEvery(UnitActionTypes.UNIT_SAVE_DEPARTMENT_REQUEST, (a: AnyAction) => handleSaveDepartment(callApiWithAuth, a.payload));
}

function* watchUnitDelete() {
  yield takeEvery(UnitActionTypes.UNIT_DELETE_MEMBER_REQUEST, (a: AnyAction) => handleDeleteMember(callApiWithAuth, a.payload));
  yield takeEvery(UnitActionTypes.UNIT_DELETE_DEPARTMENT_REQUEST, (a: AnyAction) => handleDeleteDepartment(callApiWithAuth, a.payload));
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* saga() {
  yield all([fork(watchUnitFetch), fork(watchUnitSave), fork(watchUnitDelete)]);
}
//#endregion

// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export {
  edit,
  cancel,
  fetchUnit,
  fetchUnitMembers,
  saveMemberRequest,
  deleteMemberRequest,
  fetchUnitDepartments,
  saveUnitDepartment,
  deleteUnitDepartment,
  fetchUnitChildren,
  saveUnitChild,
  deleteUnitChild,
  fetchUnitParent,
  saveUnitParent,
  deleteUnitParent,
  lookupUnit,
  lookupDepartment,
  lookupUser,
  saveUnitRequest,
  reducer,
  initialState,
  saga,
  handleSaveUnit,
  handleSaveMember,
  handleDeleteMember,
  handleSaveDepartment,
  handleDeleteDepartment
};
