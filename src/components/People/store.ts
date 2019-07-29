/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { IApiState, IPerson, IPeopleRequest } from '../types'

//#region TYPES
export const enum PeopleActionTypes {
  PEOPLE_FETCH_REQUEST = '@@people/FETCH_REQUEST',
  PEOPLE_FETCH_SUCCESS = '@@people/FETCH_SUCCESS',
  PEOPLE_FETCH_ERROR = '@@people/FETCH_ERROR',
}

export interface IState extends IApiState<{}, IPerson[]> {
}
//#endregion

//#region ACTIONS
import { action } from 'typesafe-actions'

const fetchPeople = (request: IPeopleRequest) => action(PeopleActionTypes.PEOPLE_FETCH_REQUEST, request);
const fetchSuccess = (response: IApiResponse<IPerson[]>) => action(PeopleActionTypes.PEOPLE_FETCH_SUCCESS, response);
const fetchError = (error: Error) => action(PeopleActionTypes.PEOPLE_FETCH_ERROR, error);

//#endregion

//#region REDUCER
import { Reducer, AnyAction } from 'redux'
import { TaskErrorReducer, TaskStartReducer, TaskSuccessReducer } from '../types'

const defaultPerson = {name:"default"} as IPerson
// Type-safe initialState!
const initialState: IApiState<{}, IPerson[]> = {
  permissions: [],
  data: [defaultPerson],
  error: undefined,
  loading: false,
  request: undefined
};;

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
const reducer: Reducer<IState> = (state = initialState, act) => {
  switch (act.type) {
    case PeopleActionTypes.PEOPLE_FETCH_REQUEST: return TaskStartReducer(state, act)
    case PeopleActionTypes.PEOPLE_FETCH_SUCCESS: return TaskSuccessReducer(state, act)
    case PeopleActionTypes.PEOPLE_FETCH_ERROR: return TaskErrorReducer(state, act)
    default: return state
  }
}
//#endregion


//#region SAGA
import { all, fork, takeEvery, put } from 'redux-saga/effects'
import { restApi, IApi, IApiResponse } from '../api';
import { signinIfUnauthorized, apiEndpoints } from '../effects';

const param = (name: string, values: string[]) : string =>
  values.length == 0 ? "" : `${name}=${values.join(",")}`
  
const api = restApi();
function* handleFetchPeople(api: IApi, req: IPeopleRequest) {
  console.log("*** People Request:", req)
  const roles = param("role", req.roles)
  const classes = param("class", req.classes)
  const campuses = param("campus", req.campuses)
  const query = [roles, classes, campuses].filter (x => x != "").join("&")
  const request = api.get<IPerson[]>(apiEndpoints.people.search(query))
  const action = yield request
    .then(fetchSuccess)
    .catch(signinIfUnauthorized)
    .catch(fetchError);
  yield put(action);
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchFetch() {
  yield takeEvery(PeopleActionTypes.PEOPLE_FETCH_REQUEST, (a: AnyAction) => handleFetchPeople(api, a.payload))
}
// We can also use `fork()` here to split our saga into multiple watchers.
function* saga() {
  yield all([fork(watchFetch)])
}
//#endregion

// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.

export {
  fetchPeople,
  reducer,
  initialState,
  saga
}