// Copyright (C) 2018 The Trustees of Indiana University
// SPDX-License-Identifier: BSD-3-Clause

import { Reducer  } from 'redux'
import { all, fork, select, takeEvery } from 'redux-saga/effects'
import { action } from 'typesafe-actions'
import { httpGet } from '../effects'
import { FetchErrorReducer, FetchRequestReducer, FetchSuccessReducer } from '../types'
import { IApiState, IApplicationState, IEntity } from '../types'

//#region TYPES
export const enum DepartmentActionTypes {
    DEPARTMENT_FETCH_REQUEST = '@@department/FETCH_REQUEST',
    DEPARTMENT_FETCH_SUCCESS = '@@department/FETCH_SUCCESS',
    DEPARTMENT_FETCH_ERROR = '@@department/FETCH_ERROR',
}

export interface IDepartmentRequest {
    id: string
}

export interface IDepartmentProfile extends IEntity {
  members: IEntity[],
  units: IEntity[],
  supportingUnits: IEntity[],
}

export interface IState extends IApiState<IDepartmentRequest, IDepartmentProfile> { 
}
//#endregion


//#region ACTIONS
export const fetchRequest = (request: IDepartmentRequest) => action(DepartmentActionTypes.DEPARTMENT_FETCH_REQUEST, request)
export const fetchSuccess = (data: IDepartmentProfile) => action(DepartmentActionTypes.DEPARTMENT_FETCH_SUCCESS, data)
export const fetchError = (error: string) => action(DepartmentActionTypes.DEPARTMENT_FETCH_ERROR, error)
//#endregion


//#region REDUCER
export const initialState: IState = {
    data: undefined,
    error: undefined,
    loading: false,
    request: undefined,
}

export const reducer: Reducer<IState> = (state = initialState, act) => {
  switch (act.type) {
    case DepartmentActionTypes.DEPARTMENT_FETCH_REQUEST: return FetchRequestReducer(state, act)
    case DepartmentActionTypes.DEPARTMENT_FETCH_SUCCESS: return FetchSuccessReducer(state, act)
    case DepartmentActionTypes.DEPARTMENT_FETCH_ERROR: return FetchErrorReducer(state, act)
    default: return state
  }
}
//#endregion


//#region SAGA
function* handleFetch() {
    const state = (yield select<IApplicationState>((s) => s.department.request)) as IDepartmentRequest
    const path = `/departments/${state.id}`
    yield httpGet<IDepartmentProfile>(path, fetchSuccess, fetchError)
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchDepartmentFetch() {
  yield takeEvery(DepartmentActionTypes.DEPARTMENT_FETCH_REQUEST, handleFetch)
}

// We can also use `fork()` here to split our saga into multiple watchers.
export function* saga() {
  yield all([fork(watchDepartmentFetch)])
}
//#endregion
