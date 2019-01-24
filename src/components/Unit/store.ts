/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { IApiState, IApplicationState, IEntity, ViewStateType } from '../types'
import { lookup } from '../lookup';

//#region TYPES
export const enum UnitActionTypes {
  UNIT_FETCH_REQUEST = '@@unit/FETCH_REQUEST',
  UNIT_FETCH_SUCCESS = '@@unit/FETCH_SUCCESS',
  UNIT_FETCH_ERROR = '@@unit/FETCH_ERROR',
  UNIT_EDIT = '@@unit/UNIT_EDIT',
  UNIT_SAVE_REQUEST = '@@unit/SAVE_REQUEST',
  UNIT_SAVE_SUCCESS = '@@unit/SAVE_SUCCESS',
  UNIT_SAVE_ERROR = '@@unit/SAVE_ERROR',
  UNIT_CANCEL = '@@unit/UNIT_CANCEL',
}

export interface IUnitRequest {
  id: string
}

export interface IUrl {
  url: string
}

export interface IUnitMember extends IEntity {
  title: string,
  role: ItProRole | UitsRole,
  permissions: UnitPermissions,
  percentage: number
  photoUrl?: string
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

export interface IWebEntity extends IEntity, IUrl { }

export interface IUnitProfile extends IWebEntity {
  members: IUnitMember[],
  supportedDepartments: IEntity[],
  parent?: IEntity,
  children?: IEntity[]
}

export interface IState extends IApiState<IUnitRequest, IUnitProfile> {
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
const fetchSuccess = (data: IUnitProfile) => action(UnitActionTypes.UNIT_FETCH_SUCCESS, data)
const fetchError = (error: string) => action(UnitActionTypes.UNIT_FETCH_ERROR, error)
const lookupUnit = (q: string) => lookup(q ? `/units?q=${q}` : '')
const lookupDepartment = (q: string) => lookup(q ? `/departments?q=${q}` : '')
const lookupUser = (q: string) => lookup(q ? `/people?q=${q}` : '')
//#endregion

//#region REDUCER
import { Reducer } from 'redux'
import { FetchErrorReducer, FetchRequestReducer, FetchSuccessReducer, PutErrorReducer, PutRequestReducer, PutSuccessReducer } from '../types'

// Type-safe initialState!
const initialState: IState = {
  data: undefined,
  error: undefined,
  loading: false,
  request: undefined,
}

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
const reducer: Reducer<IState> = (state = initialState, act) => {
  switch (act.type) {
    case UnitActionTypes.UNIT_EDIT: return { ...state, view: ViewStateType.Editing }
    case UnitActionTypes.UNIT_SAVE_REQUEST: return PutRequestReducer(state, act)
    case UnitActionTypes.UNIT_SAVE_SUCCESS: return PutSuccessReducer(state, act)
    case UnitActionTypes.UNIT_SAVE_ERROR: return PutErrorReducer(state, act)
    case UnitActionTypes.UNIT_CANCEL: return { ...state, view: ViewStateType.Viewing }
    case UnitActionTypes.UNIT_FETCH_REQUEST: return FetchRequestReducer(state, act)
    case UnitActionTypes.UNIT_FETCH_SUCCESS: return FetchSuccessReducer(state, act)
    case UnitActionTypes.UNIT_FETCH_ERROR: return FetchErrorReducer(state, act)
    default: return state
  }
}
//#endregion

//#region SAGA
import { all, fork, select, takeEvery } from 'redux-saga/effects'
import { apiFn as apiFn, httpGet, httpPut, callApiWithAuth } from '../effects'

function* handleFetch() {
  const state = (yield select<IApplicationState>((s) => s.unit.request)) as IUnitRequest
  const path = `/units/${state.id}`
  yield httpGet<IUnitProfile>(path, fetchSuccess, fetchError);
}

/*
 ✓  GET units/1 (unit, member, department, parent/child) -> IUnitProfile
 ▢  POST units
 ▢  PUT/DELETE units/1
 ▢  POST/PUT/DELETE units/{uid}/members/{cid}
 ▢  POST/DELETE units/{uid}/departments/{cid}
 ▢  POST/DELETE units/{uid}/parent
 ▢  POST/DELETE units/{uid}/children/{cid}
*/

function* handleSaveUnit(api: apiFn) {
  const formValues = (yield select<IApplicationState>((s) => s.form.editUnit.values)) as IWebEntity
  yield httpPut<IWebEntity, IUnitProfile>(api, `/units/${formValues.id}`, formValues, saveSuccess, saveError);
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchUnitFetch() {
  yield takeEvery(UnitActionTypes.UNIT_FETCH_REQUEST, handleFetch)
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchUnitSave() {
  yield takeEvery(UnitActionTypes.UNIT_SAVE_REQUEST, () => handleSaveUnit(callApiWithAuth));
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* saga() {
  yield all([fork(watchUnitFetch), fork(watchUnitSave)])
}
//#endregion


// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export {
  edit,
  cancel,
  fetchRequest,
  fetchError,
  fetchSuccess,
  lookupUnit,
  lookupDepartment,
  lookupUser,
  saveRequest,
  saveSuccess,
  saveError,
  reducer,
  initialState,
  saga,
  handleSaveUnit
};
