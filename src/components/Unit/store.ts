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
  id: string
}

export interface IUrl {
  url: string
}

export interface IUnitMember extends IEntity {
  title: string,
  role: ItProRole | UitsRole | string,
  permissions: UnitPermissions,
  percentage: number,
  photoUrl?: string,
  person?: IUser,
  personId?: number
}

export interface IMembershipForm extends IUnitMember {
  unitId: number
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
const saveSuccess = (unitData: IUnitProfile) => action(UnitActionTypes.UNIT_SAVE_SUCCESS, unitData)
const saveError = (error: string) => action(UnitActionTypes.UNIT_SAVE_ERROR, error)
const cancel = () => action(UnitActionTypes.UNIT_CANCEL, {})
const fetchRequest = (request: IUnitRequest) => action(UnitActionTypes.UNIT_FETCH_REQUEST, request)
const saveMemberRequest = (member: IMembershipForm) => action(UnitActionTypes.UNIT_SAVE_MEMBER_REQUEST, member)
const saveMemberSuccess = (request: IUnitMember) => action(UnitActionTypes.UNIT_SAVE_MEMBER_SUCCESS, request)
const saveMemberError = (error: string) => action(UnitActionTypes.UNIT_SAVE_MEMBER_ERROR, error)
const lookupUnit = (q: string) => lookup(q ? `/units?q=${q}` : '')
const lookupDepartment = (q: string) => lookup(q ? `/departments?q=${q}` : '')
const lookupUser = (q: string) => lookup(q ? `/people?q=${q}` : '')
//#endregion

//#region REDUCER
import { Reducer } from 'redux'
import { FetchErrorReducer, FetchRequestReducer, FetchSuccessReducer, SaveErrorReducer, SaveRequestReducer, SaveSuccessReducer } from '../types'

// Type-safe initialState!
const initialState: IState = {
  profile:{loading: false},
  members: {loading: false},
  unitChildren: {loading: false},
  parent: {loading: false},
  departments: {loading: false},
  // todo: ask John: view state could go here instead of in the IApiState/IDefaultState 🤔
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
    case UnitActionTypes.UNIT_FETCH_REQUEST: return { ...state, profile: FetchRequestReducer(state.profile, act) }
    case UnitActionTypes.UNIT_FETCH_SUCCESS: return { ...state, profile: FetchSuccessReducer(state.profile, act) }
    case UnitActionTypes.UNIT_FETCH_ERROR: return { ...state, profile: FetchErrorReducer(state.profile, act) }
    case UnitActionTypes.UNIT_SAVE_REQUEST: return {...state, profile: SaveRequestReducer(state.profile, act)}
    case UnitActionTypes.UNIT_SAVE_SUCCESS: return {...state, profile:SaveSuccessReducer(state.profile, act)}
    case UnitActionTypes.UNIT_SAVE_ERROR: return {...state, profile: SaveErrorReducer(state.profile, act)}
    //
    case UnitActionTypes.UNIT_FETCH_MEMBERS_REQUEST: return { ...state, members: FetchRequestReducer(state.members, act) };
    case UnitActionTypes.UNIT_FETCH_MEMBERS_SUCCESS: return { ...state, members: FetchSuccessReducer(state.members, act) };
    case UnitActionTypes.UNIT_FETCH_MEMBERS_ERROR: return { ...state, members: FetchErrorReducer(state.members, act) };
    case UnitActionTypes.UNIT_SAVE_MEMBER_REQUEST: return { ...state, members: SaveRequestReducer(state.members, act) };
    case UnitActionTypes.UNIT_SAVE_MEMBER_SUCCESS: return { ...state, members: SaveSuccessReducer(state.members, act) };
    case UnitActionTypes.UNIT_SAVE_MEMBER_ERROR: return { ...state, members: SaveErrorReducer(state.members, act) };
    //
    case UnitActionTypes.UNIT_FETCH_CHILDREN_REQUEST: return { ...state, unitChildren: FetchRequestReducer(state.unitChildren, act) };
    case UnitActionTypes.UNIT_FETCH_CHILDREN_SUCCESS: return { ...state, unitChildren: FetchSuccessReducer(state.unitChildren, act) };
    case UnitActionTypes.UNIT_FETCH_CHILDREN_ERROR: return { ...state, unitChildren: FetchErrorReducer(state.unitChildren, act) };
    case UnitActionTypes.UNIT_SAVE_CHILD_REQUEST: return { ...state, unitChildren: SaveRequestReducer(state.unitChildren, act) };
    case UnitActionTypes.UNIT_SAVE_CHILD_SUCCESS: return { ...state, unitChildren: SaveSuccessReducer(state.unitChildren, act) };
    case UnitActionTypes.UNIT_SAVE_CHILD_ERROR: return { ...state, unitChildren: SaveErrorReducer(state.unitChildren, act) };
    //
    case UnitActionTypes.UNIT_FETCH_PARENT_REQUEST: return { ...state, parent: FetchRequestReducer(state.parent, act) };
    case UnitActionTypes.UNIT_FETCH_PARENT_SUCCESS: return { ...state, parent: FetchSuccessReducer(state.parent, act) };
    case UnitActionTypes.UNIT_FETCH_PARENT_ERROR: return { ...state, parent: FetchErrorReducer(state.parent, act) };
    case UnitActionTypes.UNIT_SAVE_PARENT_REQUEST: return { ...state, parent: SaveRequestReducer(state.parent, act) };
    case UnitActionTypes.UNIT_SAVE_PARENT_SUCCESS: return { ...state, parent: SaveSuccessReducer(state.parent, act) };
    case UnitActionTypes.UNIT_SAVE_PARENT_ERROR: return { ...state, parent: SaveErrorReducer(state.parent, act) };
    //
    case UnitActionTypes.UNIT_FETCH_DEPARTMENTS_REQUEST: return { ...state, departments: FetchRequestReducer(state.departments, act) };
    case UnitActionTypes.UNIT_FETCH_DEPARTMENTS_SUCCESS: return { ...state, departments: FetchSuccessReducer(state.departments, act) };
    case UnitActionTypes.UNIT_FETCH_DEPARTMENTS_ERROR: return { ...state, departments: FetchErrorReducer(state.departments, act) };
    case UnitActionTypes.UNIT_SAVE_DEPARTMENT_REQUEST: return { ...state, departments: SaveRequestReducer(state.departments, act) };
    case UnitActionTypes.UNIT_SAVE_DEPARTMENT_SUCCESS: return { ...state, departments: SaveSuccessReducer(state.departments, act) };
    case UnitActionTypes.UNIT_SAVE_DEPARTMENT_ERROR: return { ...state, departments: SaveErrorReducer(state.departments, act) };

    default: return state
  }
}
//#endregion

//#region SAGA
import { all, fork, select, takeEvery, put } from 'redux-saga/effects'
import { apiFn as apiFn, httpGet, httpPost, httpPut, callApiWithAuth } from '../effects'
import { IUnitMembership, IUser } from '../Profile/store';

function* handleFetch() {
  const state = (yield select<IApplicationState>((s) => s.unit.profile.request)) as IUnitRequest
  yield httpGet<IUnitProfile>(`/units/${state.id}`, 
      data => action(UnitActionTypes.UNIT_FETCH_SUCCESS, data), 
      error => action(UnitActionTypes.UNIT_FETCH_ERROR, error));
  yield httpGet<IUnitMembership[]>(`/memberships?unitId=${state.id}&_expand=person`, 
      data => action(UnitActionTypes.UNIT_FETCH_MEMBERS_SUCCESS, data), 
      error => action(UnitActionTypes.UNIT_FETCH_MEMBERS_ERROR, error));
  yield httpGet<IUnit[]>(`/units?parentId=${state.id}`, 
      data => action(UnitActionTypes.UNIT_FETCH_CHILDREN_SUCCESS, data), 
      error => action(UnitActionTypes.UNIT_FETCH_CHILDREN_ERROR, error));
  yield httpGet<IEntity[]>(`/supportedDepartments?unitId=${state.id}&_expand=department`,
      data => action(UnitActionTypes.UNIT_FETCH_DEPARTMENTS_SUCCESS, data),
      error => action(UnitActionTypes.UNIT_FETCH_DEPARTMENTS_ERROR, error));
}

function* handlePostUnitFetch() {
  const state = (yield select<IApplicationState>(s => s.unit.profile.data)) as IUnit;
  if (state.parentId) {
    yield httpGet<IUnit[]>(`/units/${state.parentId}`,
      data => action(UnitActionTypes.UNIT_FETCH_PARENT_SUCCESS, data),
      error => action(UnitActionTypes.UNIT_FETCH_PARENT_ERROR, error));
  } else {
    yield put(action(UnitActionTypes.UNIT_FETCH_PARENT_SUCCESS, undefined));
  }
}
/*
 ✓  GET units/1 (unit, member, department, parent/child) -> IUnitProfile
 ✓  POST units
 ✓  PUT units/1
 ▢  DELETE units/1
 ▢  POST units/{uid}/members
 ▢  PUT units/{uid}/members/{mid}
 ▢  DELETE units/{uid}/members/{mid}
 ▢  POST/DELETE units/{uid}/departments/{did}
 ▢  POST/DELETE units/{uid}/parent
 ▢  POST/DELETE units/{uid}/children/{cid}
*/

/* 
GET/POST/PUT/DELETE /units/{unit_id}
GET/POST/PUT/DELETE /units/{unit_id}/members/{person_id}
GET/POST/DELETE /units/{unit_id}/children/{child_unit_id}
GET/POST/DELETE /units/{unit_id}/parent/{parent_unit_id}
GET/POST/DELETE /units/{unit_id}/supported_departments/{department_id}
*/


function* handleSaveUnit(api: apiFn) {
  const formValues = (yield select<IApplicationState>((s) => s.form.updateUnitForm.values)) as IUnit
  if (formValues.id) {
    yield httpPut<IUnit, IUnitProfile>(api, `/units/${formValues.id}`, formValues, saveSuccess, saveError);
  } else {
    yield httpPost<IUnit, IUnitProfile>(api, "/units", formValues, saveSuccess, saveError);
  }
}

function* handleSaveMember(api: apiFn){
  const formValues = (yield select<IApplicationState>((s) => s.form.addMemberForm.values)) as IMembershipForm
  // const unit = (yield select<IApplicationState>((s) => s.unit.data)) as IUnitProfile
  // let members = unit.members;
  // if(unit.members.find(m=>m.id==formValues.id)){
  //   members = unit.members.map((member)=> (member.id == formValues.id) ? {...member, ...formValues} : member);
  // } else {
  //   members = [...unit.members, formValues];
  // }
  // const data = {members}
 // yield httpPatch<IUnitMember, IUnitMember>(api, `/units/${formValues.unitId}`, data, saveMemberSuccess, saveMemberError);
  
 yield httpPut<IUnitMember, IUnitMember>(api, `/units/${formValues.unitId}/members/${formValues.id}`, formValues, saveMemberSuccess, saveMemberError);
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchUnitFetch() {
  yield takeEvery(UnitActionTypes.UNIT_FETCH_REQUEST, handleFetch);
  yield takeEvery(UnitActionTypes.UNIT_FETCH_SUCCESS, handlePostUnitFetch)
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchUnitSave() {
  yield takeEvery(UnitActionTypes.UNIT_SAVE_REQUEST, () => handleSaveUnit(callApiWithAuth));
}

function* watchUnitAddMember() {
  yield takeEvery(UnitActionTypes.UNIT_SAVE_MEMBER_REQUEST, () => handleSaveMember(callApiWithAuth));
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* saga() {
  yield all([fork(watchUnitFetch), fork(watchUnitSave), fork(watchUnitAddMember)])
}
//#endregion


// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export {
  edit,
  cancel,
  fetchRequest,
  lookupUnit,
  lookupDepartment,
  lookupUser,
  saveRequest,
  saveSuccess,
  saveError,
  reducer,
  initialState,
  saga,
  handleSaveUnit,
  handleSaveMember,
  saveMemberRequest
};
