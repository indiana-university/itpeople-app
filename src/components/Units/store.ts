/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { IApiState, defaultState, IUnit } from '../types'

//#region TYPES
export const enum UnitsActionTypes {
  UNITS_FETCH_REQUEST = '@@units/FETCH_REQUEST',
  UNITS_FETCH_SUCCESS = '@@units/FETCH_SUCCESS',
  UNITS_FETCH_ERROR = '@@units/FETCH_ERROR',
  UNITS_CREATE_REQUEST = "@@units/CREATE_REQUEST",
  UNITS_CREATE_ERROR = "@@units/CREATE_ERROR"
}

export interface IState extends IApiState<{}, IUnit[]> {
}
//#endregion

//#region ACTIONS
import { action } from 'typesafe-actions'

const fetchUnits = () => action(UnitsActionTypes.UNITS_FETCH_REQUEST);
const fetchSuccess = (response: IApiResponse<IUnit[]>) => action(UnitsActionTypes.UNITS_FETCH_SUCCESS, response);
const fetchError = (error: Error) => action(UnitsActionTypes.UNITS_FETCH_ERROR, error);
const addUnit = (unit: IUnit) => action(UnitsActionTypes.UNITS_CREATE_REQUEST, unit);

//#endregion

//#region REDUCER
import { Reducer, AnyAction } from 'redux'
import { TaskErrorReducer, TaskStartReducer, TaskSuccessReducer } from '../types'

// Type-safe initialState!
const initialState: IApiState<{}, IUnit[]> = defaultState();

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
const reducer: Reducer<IState> = (state = initialState, act) => {
  switch (act.type) {
    case UnitsActionTypes.UNITS_FETCH_REQUEST: return TaskStartReducer(state, act)
    case UnitsActionTypes.UNITS_FETCH_SUCCESS: return TaskSuccessReducer(state, act)
    case UnitsActionTypes.UNITS_FETCH_ERROR: return TaskErrorReducer(state, act)
    case UnitsActionTypes.UNITS_CREATE_REQUEST: return TaskStartReducer(state, act)
    case UnitsActionTypes.UNITS_CREATE_ERROR: return TaskErrorReducer(state, act)
    default: return state
  }
}
//#endregion


//#region SAGA
import { all, fork, takeEvery, put } from 'redux-saga/effects'
import { restApi, IApi, IApiResponse } from '../api';
import { signinIfUnauthorized, apiEndpoints } from '../effects';

const api = restApi();
function* handleFetchUnit(api: IApi) {
  const request = api.get<IUnit[]>(apiEndpoints.units.root())
  const action = yield request
    .then(fetchSuccess)
    .catch(signinIfUnauthorized)
    .catch(fetchError);
  yield put(action);
}

const createUnitError = (error: Error) => action(UnitsActionTypes.UNITS_CREATE_ERROR, error);
function* handleCreateUnit(api: IApi, unit: IUnit) {
  const request = api.post(apiEndpoints.units.root(), unit);
  const action = yield request
    .then(_ => fetchUnits())
    .catch(signinIfUnauthorized)
    .catch(createUnitError);
  yield put(action);
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchFetch() {
  yield takeEvery(UnitsActionTypes.UNITS_FETCH_REQUEST, () => handleFetchUnit(api))
}

function* watchCreate() {
  yield takeEvery(UnitsActionTypes.UNITS_CREATE_REQUEST, (a:AnyAction) => handleCreateUnit(api, a.payload))
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* saga() {
  yield all([fork(watchFetch), fork(watchCreate)])
}
//#endregion

// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.

export {
  fetchUnits,
  reducer,
  initialState,
  addUnit,
  saga
}
