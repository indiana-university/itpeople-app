/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { IApiState, IEntity } from '../types'

//#region TYPES
export const enum UnitsActionTypes {
    UNITS_FETCH_REQUEST = '@@units/FETCH_REQUEST',
    UNITS_FETCH_SUCCESS = '@@units/FETCH_SUCCESS',
    UNITS_FETCH_ERROR = '@@units/FETCH_ERROR',
}

export interface IState extends IApiState<{}, IEntity[]> { 
}
//#endregion

//#region ACTIONS
import { action } from 'typesafe-actions'

const fetchRequest = () => action(UnitsActionTypes.UNITS_FETCH_REQUEST)
const fetchSuccess = (response: IApiResponse< IEntity[]>) => action(UnitsActionTypes.UNITS_FETCH_SUCCESS, response)
const fetchError = (error: string) => action(UnitsActionTypes.UNITS_FETCH_ERROR, error)
//#endregion

//#region REDUCER
import { Reducer } from 'redux'
import { TaskErrorReducer, TaskStartReducer, TaskSuccessReducer } from '../types'

// Type-safe initialState!
const initialState: IState = {
    permissions: [],
    data: undefined,
    error: undefined,
    loading: false,
    request: undefined,
}

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
const reducer: Reducer<IState> = (state = initialState, act) => {
  switch (act.type) {
    case UnitsActionTypes.UNITS_FETCH_REQUEST: return TaskStartReducer(state, act)
    case UnitsActionTypes.UNITS_FETCH_SUCCESS: return TaskSuccessReducer(state, act)
    case UnitsActionTypes.UNITS_FETCH_ERROR: return TaskErrorReducer(state, act)
    default: return state
  }
}
//#endregion


//#region SAGA
import { all, fork, takeEvery, put } from 'redux-saga/effects'
import { restApi, IApi, IApiResponse } from '../api';
import { signinIfUnauthorized } from '../effects';

const api = restApi();
function* handleFetch(api:IApi) {
  const action = yield api.get<IEntity[]>( '/units')
    .then(fetchSuccess)
    .catch(signinIfUnauthorized)
    .catch(fetchError);

    yield put(action);
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchUnitsFetch() {
  yield takeEvery(UnitsActionTypes.UNITS_FETCH_REQUEST, ()=>handleFetch(api))
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* saga() {
  yield all([fork(watchUnitsFetch)])
}
//#endregion

// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export { 
  fetchRequest,
  fetchError,
  fetchSuccess,
  reducer,
  initialState,
  saga
}
