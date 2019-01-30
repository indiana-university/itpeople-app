/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { IApiState, IApplicationState, IEntity, ViewStateType } from '../types'
import { lookup } from '../lookup';

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
  UNIT_SAVE_PARENT_REQUEST = "@@unit/SAVE_PARENT_REQUEST",
  UNIT_SAVE_PARENT_SUCCESS = "@@unit/SAVE_PARENT_SUCCESS",
  UNIT_SAVE_PARENT_ERROR = "@@unit/SAVE_PARENT_ERROR",
  UNIT_SAVE_DEPARTMENT_REQUEST = "@@unit/SAVE_DEPARTMENT_REQUEST",
  UNIT_SAVE_DEPARTMENT_SUCCESS = "@@unit/SAVE_DEPARTMENT_SUCCESS",
  UNIT_SAVE_DEPARTMENT_ERROR = "@@unit/SAVE_DEPARTMENT_ERROR",
  UNIT_CANCEL = "@@unit/UNIT_CANCEL"
}

export interface IUnitRequest {
  id: number
}

export interface IDeleteRequest extends IUnitRequest{
  unitId: number
}

export interface IUrl {
  url: string
}

export interface IUnitMemberRequest {
  id: number;
  unitId: number;
  personId?: number;
  title: string;
  role: ItProRole | UitsRole | string;
  permissions: UnitPermissions;
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
  members: IUnitMember[],
  supportedDepartments: IEntity[],
  parent?: IEntity,
  children?: IEntity[]
}

export interface ISupportedDepartment {
  id: number;
  unitId: number;
  departmentId: number;
  department: IEntity;
}

export interface IState {
  profile: IApiState<IUnitRequest, IUnit>;
  members: IApiState<IUnitRequest, IUnitMember[]>;
  unitChildren: IApiState<IUnitRequest, IEntity[]>; // children conflicts with react props 😟
  parent: IApiState<IUnitRequest, IEntity>;
  departments: IApiState<IUnitRequest, ISupportedDepartment[]>;
  view: ViewStateType
}
//#endregion

//#region ACTIONS
import { action } from 'typesafe-actions'

const edit = () => action(UnitActionTypes.UNIT_EDIT, {})
const saveRequest = () => action(UnitActionTypes.UNIT_SAVE_REQUEST, {})
const cancel = () => action(UnitActionTypes.UNIT_CANCEL, {})
const fetchUnit = (request: IUnitRequest) => action(UnitActionTypes.UNIT_FETCH_REQUEST, request)
const fetchUnitMembers = (request: IUnitRequest) => action(UnitActionTypes.UNIT_FETCH_MEMBERS_REQUEST, request)
const fetchUnitDepartments = (request: IUnitRequest) => action(UnitActionTypes.UNIT_FETCH_DEPARTMENTS_REQUEST, request)
const fetchUnitChildren = (request: IUnitRequest) => action(UnitActionTypes.UNIT_FETCH_CHILDREN_REQUEST, request)
const fetchUnitParent = (request: IUnitRequest) => action(UnitActionTypes.UNIT_FETCH_PARENT_REQUEST, request)
const saveMemberRequest = (member: IUnitMember) =>  action(UnitActionTypes.UNIT_SAVE_MEMBER_REQUEST, member);
const deleteMemberRequest = (member: IUnitMember) => action(UnitActionTypes.UNIT_DELETE_MEMBER_REQUEST, member);
const lookupUnit = (q: string) => lookup(q ? `/units?q=${q}` : '')
const lookupDepartment = (q: string) => lookup(q ? `/departments?q=${q}` : '')
const lookupUser = (q: string) => lookup(q ? `/people?q=${q}` : '')
//#endregion

//#region REDUCER
import { Reducer } from 'redux'
import { TaskErrorReducer, TaskStartReducer, TaskSuccessReducer } from '../types'

// Type-safe initialState!
const initialState: IState = {
  profile:{loading: false},
  members: {loading: false},
  unitChildren: {loading: false},
  parent: {loading: false},
  departments: {loading: false},
  view: ViewStateType.Viewing
}


// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
// state.unit.profile.data
// state.unit.members.data
// state.unit.departments.data
// state.unit.children.data
// state.unit.parent.data
const reducer: Reducer<IState> = (state = initialState, act) => {
  switch (act.type) {
    case UnitActionTypes.UNIT_EDIT: return { ...state, view: ViewStateType.Editing }
    case UnitActionTypes.UNIT_CANCEL: return { ...state, view: ViewStateType.Viewing }
    //
    case UnitActionTypes.UNIT_FETCH_REQUEST: return { ...state, profile: TaskStartReducer(state.profile, act) }
    case UnitActionTypes.UNIT_FETCH_SUCCESS: return { ...state, profile: TaskSuccessReducer(state.profile, act) }
    case UnitActionTypes.UNIT_FETCH_ERROR: return { ...state, profile: TaskErrorReducer(state.profile, act) }
    case UnitActionTypes.UNIT_SAVE_REQUEST: return {...state, profile: TaskStartReducer(state.profile, act)}
    case UnitActionTypes.UNIT_SAVE_SUCCESS: return {...state, profile:TaskSuccessReducer(state.profile, act)}
    case UnitActionTypes.UNIT_SAVE_ERROR: return {...state, profile: TaskErrorReducer(state.profile, act)}
    //
    case UnitActionTypes.UNIT_FETCH_MEMBERS_REQUEST: return { ...state, members: TaskStartReducer(state.members, act) };
    case UnitActionTypes.UNIT_FETCH_MEMBERS_SUCCESS: return { ...state, members: TaskSuccessReducer(state.members, act) };
    case UnitActionTypes.UNIT_FETCH_MEMBERS_ERROR: return { ...state, members: TaskErrorReducer(state.members, act) };
    case UnitActionTypes.UNIT_SAVE_MEMBER_REQUEST: return { ...state, members: TaskStartReducer(state.members, act) };
    case UnitActionTypes.UNIT_SAVE_MEMBER_ERROR: return { ...state, members: TaskErrorReducer(state.members, act) };
    case UnitActionTypes.UNIT_DELETE_MEMBER_REQUEST: return { ...state, members: TaskStartReducer(state.members, act) };
    case UnitActionTypes.UNIT_DELETE_MEMBER_ERROR: return { ...state, members: TaskErrorReducer(state.members, act) };
    //
    case UnitActionTypes.UNIT_FETCH_CHILDREN_REQUEST: return { ...state, unitChildren: TaskStartReducer(state.unitChildren, act) };
    case UnitActionTypes.UNIT_FETCH_CHILDREN_SUCCESS: return { ...state, unitChildren: TaskSuccessReducer(state.unitChildren, act) };
    case UnitActionTypes.UNIT_FETCH_CHILDREN_ERROR: return { ...state, unitChildren: TaskErrorReducer(state.unitChildren, act) };
    case UnitActionTypes.UNIT_SAVE_CHILD_REQUEST: return { ...state, unitChildren: TaskStartReducer(state.unitChildren, act) };
    case UnitActionTypes.UNIT_SAVE_CHILD_SUCCESS: return { ...state, unitChildren: TaskSuccessReducer(state.unitChildren, act) };
    case UnitActionTypes.UNIT_SAVE_CHILD_ERROR: return { ...state, unitChildren: TaskErrorReducer(state.unitChildren, act) };
    //
    case UnitActionTypes.UNIT_FETCH_PARENT_REQUEST: return { ...state, parent: TaskStartReducer(state.parent, act) };
    case UnitActionTypes.UNIT_FETCH_PARENT_SUCCESS: return { ...state, parent: TaskSuccessReducer(state.parent, act) };
    case UnitActionTypes.UNIT_FETCH_PARENT_ERROR: return { ...state, parent: TaskErrorReducer(state.parent, act) };
    case UnitActionTypes.UNIT_SAVE_PARENT_REQUEST: return { ...state, parent: TaskStartReducer(state.parent, act) };
    case UnitActionTypes.UNIT_SAVE_PARENT_SUCCESS: return { ...state, parent: TaskSuccessReducer(state.parent, act) };
    case UnitActionTypes.UNIT_SAVE_PARENT_ERROR: return { ...state, parent: TaskErrorReducer(state.parent, act) };
    //
    case UnitActionTypes.UNIT_FETCH_DEPARTMENTS_REQUEST: return { ...state, departments: TaskStartReducer(state.departments, act) };
    case UnitActionTypes.UNIT_FETCH_DEPARTMENTS_SUCCESS: return { ...state, departments: TaskSuccessReducer(state.departments, act) };
    case UnitActionTypes.UNIT_FETCH_DEPARTMENTS_ERROR: return { ...state, departments: TaskErrorReducer(state.departments, act) };
    case UnitActionTypes.UNIT_SAVE_DEPARTMENT_REQUEST: return { ...state, departments: TaskStartReducer(state.departments, act) };
    case UnitActionTypes.UNIT_SAVE_DEPARTMENT_SUCCESS: return { ...state, departments: TaskSuccessReducer(state.departments, act) };
    case UnitActionTypes.UNIT_SAVE_DEPARTMENT_ERROR: return { ...state, departments: TaskErrorReducer(state.departments, act) };

    default: return state
  }
}
//#endregion

//#region SAGA
import { all, fork, select, takeEvery, put } from 'redux-saga/effects'
import { apiFn as apiFn, httpGet, httpPost, httpPut, httpDelete, callApiWithAuth, apiResources } from '../effects'
import { IUnitMembership, IUser } from '../Profile/store';

function* handleFetchUnit() {
  const state = (yield select<IApplicationState>((s) => s.unit.profile.request)) as IUnitRequest
  yield httpGet<IUnitProfile>(apiResources.units.root(state.id), 
      data => action(UnitActionTypes.UNIT_FETCH_SUCCESS, data), 
      error => action(UnitActionTypes.UNIT_FETCH_ERROR, error));
}

function* handleFetchUnitMembers() {
  const state = (yield select<IApplicationState>((s) => s.unit.members.request)) as IUnitRequest
  yield httpGet<IUnitMembership[]>(apiResources.units.members(state.id),
    data => action(UnitActionTypes.UNIT_FETCH_MEMBERS_SUCCESS, data),
    error => action(UnitActionTypes.UNIT_FETCH_MEMBERS_ERROR, error));
}

function* handleFetchUnitChildren() {
  const state = (yield select<IApplicationState>((s) => s.unit.unitChildren.request)) as IUnitRequest
  yield httpGet<IUnit[]>(apiResources.units.children(state.id),
    data => action(UnitActionTypes.UNIT_FETCH_CHILDREN_SUCCESS, data),
    error => action(UnitActionTypes.UNIT_FETCH_CHILDREN_ERROR, error));
}

function* handleFetchUnitDepartments() {
  const state = (yield select<IApplicationState>((s) => s.unit.departments.request)) as IUnitRequest
  yield httpGet<IEntity[]>(apiResources.units.supportedDepartments(state.id),
    data => action(UnitActionTypes.UNIT_FETCH_DEPARTMENTS_SUCCESS, data),
    error => action(UnitActionTypes.UNIT_FETCH_DEPARTMENTS_ERROR, error));
}

function* handleFetchUnitParent() {
  const state = (yield select<IApplicationState>(s => s.unit.profile.data)) as IUnit;
  if (state.parentId) {
    yield httpGet<IUnit[]>(apiResources.units.root(state.parentId),
      data => action(UnitActionTypes.UNIT_FETCH_PARENT_SUCCESS, data),
      error => action(UnitActionTypes.UNIT_FETCH_PARENT_ERROR, error));
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

function* handleSaveUnit(api: apiFn) {
  const requestBody = (yield select<IApplicationState>((s) => s.form.updateUnitForm.values)) as IUnit
  if (requestBody.id) {
    yield httpPut<IUnit, IUnitProfile>(api, apiResources.units.root(requestBody.id), requestBody, 
      response => action(UnitActionTypes.UNIT_SAVE_SUCCESS, response), 
      error => action(UnitActionTypes.UNIT_SAVE_ERROR, error));
  } else {
    yield httpPost<IUnit, IUnitProfile>(api, apiResources.units.root(), requestBody,
      response => action(UnitActionTypes.UNIT_SAVE_SUCCESS, response),
      error => action(UnitActionTypes.UNIT_SAVE_ERROR, error));
  }
}

function* handleSaveMember(api: apiFn){
  const form = (yield select<IApplicationState>(s => s.form.updateMemberForm.values)) as IUnitMemberRequest;
  const body: IUnitMemberRequest = { id: form.id, unitId: form.unitId, personId: form.personId, title: form.title, percentage: form.percentage, role: form.role, permissions: form.permissions };
  if (body.id) {
    yield httpPut<IUnitMemberRequest, IUnitRequest>(api, apiResources.units.members(body.unitId, body.id), body, 
      _ => action(UnitActionTypes.UNIT_FETCH_MEMBERS_REQUEST, {id: body.unitId}), 
      error => action(UnitActionTypes.UNIT_SAVE_MEMBER_ERROR, error));
  } else {
    yield httpPost<IUnitMemberRequest, IUnitRequest>(api, apiResources.units.members(body.unitId), body, 
      _ => action(UnitActionTypes.UNIT_FETCH_MEMBERS_REQUEST, {id: body.unitId}), 
      error => action(UnitActionTypes.UNIT_SAVE_MEMBER_ERROR, error));
  }
}

function* handleDeleteMember(api: apiFn){
  const state = (yield select<IApplicationState>(s => s.unit.members.request)) as IDeleteRequest;
  yield httpDelete(api, apiResources.units.members(state.unitId, state.id),
    () => action(UnitActionTypes.UNIT_FETCH_MEMBERS_REQUEST, { id: state.unitId }),
    error => action(UnitActionTypes.UNIT_DELETE_MEMBER_ERROR, error));
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchUnitFetch() {
  yield takeEvery(UnitActionTypes.UNIT_FETCH_REQUEST, handleFetchUnit);
  yield takeEvery(UnitActionTypes.UNIT_FETCH_MEMBERS_REQUEST, handleFetchUnitMembers);
  yield takeEvery(UnitActionTypes.UNIT_FETCH_CHILDREN_REQUEST, handleFetchUnitChildren);
  yield takeEvery(UnitActionTypes.UNIT_FETCH_DEPARTMENTS_REQUEST, handleFetchUnitDepartments);
  // The unit parent is defined by a parentId on the unit record, so we must await the unit record fetch.
  yield takeEvery(UnitActionTypes.UNIT_FETCH_SUCCESS, handleFetchUnitParent)
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchUnitSave() {
  yield takeEvery(UnitActionTypes.UNIT_SAVE_REQUEST, () => handleSaveUnit(callApiWithAuth));
  yield takeEvery(UnitActionTypes.UNIT_SAVE_MEMBER_REQUEST, () => handleSaveMember(callApiWithAuth));
}

function* watchUnitDelete() {
  yield takeEvery(UnitActionTypes.UNIT_DELETE_MEMBER_REQUEST, () => handleDeleteMember(callApiWithAuth));
}


// We can also use `fork()` here to split our saga into multiple watchers.
function* saga() {
  yield all([fork(watchUnitFetch), fork(watchUnitSave), fork(watchUnitDelete)])
}
//#endregion


// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export {
  edit,
  cancel,
  fetchUnit,
  fetchUnitMembers,
  fetchUnitDepartments,
  fetchUnitChildren,
  fetchUnitParent,
  lookupUnit,
  lookupDepartment,
  lookupUser,
  saveRequest,
  saveMemberRequest,
  deleteMemberRequest,
  reducer,
  initialState,
  saga,
  handleSaveUnit,
  handleSaveMember
};
