/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { IApiState, IDepartment } from '../types'

//#region TYPES
export const enum DepartmentsActionTypes {
    DEPARTMENTS_FETCH_REQUEST = '@@departments/FETCH_REQUEST',
    DEPARTMENTS_FETCH_SUCCESS = '@@departments/FETCH_SUCCESS',
    DEPARTMENTS_FETCH_ERROR = '@@departments/FETCH_ERROR',
}

export interface IState extends IApiState<{}, IDepartment[]> { 
}
//#endregion

//#region ACTIONS
import { action } from 'typesafe-actions'

export const fetchRequest = () => action(DepartmentsActionTypes.DEPARTMENTS_FETCH_REQUEST)
const fetchSuccess = (response: IApiResponse<IDepartment[]>) => action(DepartmentsActionTypes.DEPARTMENTS_FETCH_SUCCESS, response)
const fetchError = (error: string) => action(DepartmentsActionTypes.DEPARTMENTS_FETCH_ERROR, error)
//#endregion

//#region REDUCER
import { Reducer } from 'redux'
import { TaskErrorReducer, TaskStartReducer, TaskSuccessReducer } from '../types'

// Type-safe initialState!
export const initialState: IState = {
    data: undefined,
    error: undefined,
    loading: false,
    request: undefined,
}

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
export const reducer: Reducer<IState> = (state = initialState, act) => {
  switch (act.type) {
    case DepartmentsActionTypes.DEPARTMENTS_FETCH_REQUEST: return TaskStartReducer(state, act)
    case DepartmentsActionTypes.DEPARTMENTS_FETCH_SUCCESS: return TaskSuccessReducer(state, act)
    case DepartmentsActionTypes.DEPARTMENTS_FETCH_ERROR: return TaskErrorReducer(state, act)
    default: return state
  }
}
//#endregion


//#region SAGA
import { all, fork, takeEvery, put } from 'redux-saga/effects'
import { apiEndpoints, signinIfUnauthorized } from '../effects'
import { IApi, restApi, IApiResponse } from "../api";

const api = restApi();

function* handleFetch(api: IApi) {
  const action = yield api
    .get<IDepartment[]>(apiEndpoints.departments.root())
    .then(fetchSuccess) 
    .catch(signinIfUnauthorized)
    .catch(fetchError)
  yield put(action)
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchDepartmentsFetch() {
  yield takeEvery(DepartmentsActionTypes.DEPARTMENTS_FETCH_REQUEST, () => handleFetch(api))
}

// We can also use `fork()` here to split our saga into multiple watchers.
export function* saga() {
  yield all([fork(watchDepartmentsFetch)])
}
//#endregion
