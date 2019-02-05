/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { Reducer, AnyAction  } from 'redux'
import { all, fork, takeEvery, put } from 'redux-saga/effects'
import { action } from 'typesafe-actions'
import { apiEndpoints } from '../effects'
import { IApiState, TaskErrorReducer, TaskStartReducer, TaskSuccessReducer, IEntityRequest, IDepartment, IUnit } from '../types'
import { restApi, IApi, signinIfUnauthorized, IApiResponse } from '../api';

//#region TYPES
export const enum DepartmentActionTypes {
    DEPARTMENT_FETCH_REQUEST = '@@department/FETCH_REQUEST',
    DEPARTMENT_FETCH_SUCCESS = '@@department/FETCH_SUCCESS',
    DEPARTMENT_FETCH_ERROR = '@@department/FETCH_ERROR',
    DEPARTMENT_FETCH_PROFILE_REQUEST = '@@department/FETCH_PROFILE_REQUEST',
    DEPARTMENT_FETCH_PROFILE_SUCCESS = '@@department/FETCH_PROFILE_SUCCESS',
    DEPARTMENT_FETCH_PROFILE_ERROR = '@@department/FETCH_PROFILE_ERROR',
    DEPARTMENT_FETCH_CONSTITUENT_UNITS_REQUEST = '@@department/FETCH_CONSTITUENT_UNITS_REQUEST',
    DEPARTMENT_FETCH_CONSTITUENT_UNITS_SUCCESS = '@@department/FETCH_CONSTITUENT_UNITS_SUCCESS',
    DEPARTMENT_FETCH_CONSTITUENT_UNITS_ERROR = '@@department/FETCH_CONSTITUENT_UNITS_ERROR',
    DEPARTMENT_FETCH_SUPPORTING_UNITS_REQUEST = '@@department/FETCH_SUPPORTING_UNITS_REQUEST',
    DEPARTMENT_FETCH_SUPPORTING_UNITS_SUCCESS = '@@department/FETCH_SUPPORTING_UNITS_SUCCESS',
    DEPARTMENT_FETCH_SUPPORTING_UNITS_ERROR = '@@department/FETCH_SUPPORTING_UNITS_ERROR',
}

export interface IState {
  profile: IApiState<IEntityRequest, IDepartment>;
  constituentUnits: IApiState<IEntityRequest, IUnit[]>;
  supportingUnits: IApiState<IEntityRequest, IUnit[]>;
}
//#endregion


//#region ACTIONS
export const fetchRequest = (request: IEntityRequest) => action(DepartmentActionTypes.DEPARTMENT_FETCH_REQUEST, request)
const fetchProfileRequest = (request: IEntityRequest) => action(DepartmentActionTypes.DEPARTMENT_FETCH_PROFILE_REQUEST, request)
const fetchProfileSuccess = (resposne: IApiResponse<IDepartment>) => action(DepartmentActionTypes.DEPARTMENT_FETCH_PROFILE_SUCCESS, resposne.data)
const fetchProfileError = (error: string) => action(DepartmentActionTypes.DEPARTMENT_FETCH_PROFILE_ERROR, error)
const fetchConstituentUnitsRequest = (request: IEntityRequest) => action(DepartmentActionTypes.DEPARTMENT_FETCH_CONSTITUENT_UNITS_REQUEST, request)
const fetchConstituentUnitsSuccess = (resposne: IApiResponse<IUnit[]>) => action(DepartmentActionTypes.DEPARTMENT_FETCH_CONSTITUENT_UNITS_SUCCESS, resposne.data)
const fetchConstituentUnitsError = (error: string) => action(DepartmentActionTypes.DEPARTMENT_FETCH_CONSTITUENT_UNITS_ERROR, error)
const fetchSupportingUnitsRequest = (request: IEntityRequest) => action(DepartmentActionTypes.DEPARTMENT_FETCH_SUPPORTING_UNITS_REQUEST, request)
const fetchSupportingUnitsSuccess = (response: IApiResponse< IUnit[]>) => action(DepartmentActionTypes.DEPARTMENT_FETCH_SUPPORTING_UNITS_SUCCESS, response.data)
const fetchSupportingUnitsError = (error: string) => action(DepartmentActionTypes.DEPARTMENT_FETCH_SUPPORTING_UNITS_ERROR, error)
//#endregion


//#region REDUCER
export const initialState: IState = {
  profile: { loading: false },
  constituentUnits: { loading: false },
  supportingUnits: {loading: false},
}

export const reducer: Reducer<IState> = (state = initialState, act) => {
  switch (act.type) {
    case DepartmentActionTypes.DEPARTMENT_FETCH_PROFILE_REQUEST: return {...state, profile: TaskStartReducer(state.profile, act) }
    case DepartmentActionTypes.DEPARTMENT_FETCH_PROFILE_SUCCESS: return { ...state, profile: TaskSuccessReducer(state.profile, act) }
    case DepartmentActionTypes.DEPARTMENT_FETCH_PROFILE_ERROR: return { ...state, profile: TaskErrorReducer(state.profile, act) }
    case DepartmentActionTypes.DEPARTMENT_FETCH_CONSTITUENT_UNITS_REQUEST: return { ...state, constituentUnits: TaskStartReducer(state.constituentUnits, act) }
    case DepartmentActionTypes.DEPARTMENT_FETCH_CONSTITUENT_UNITS_SUCCESS: return { ...state, constituentUnits: TaskSuccessReducer(state.constituentUnits, act) }
    case DepartmentActionTypes.DEPARTMENT_FETCH_CONSTITUENT_UNITS_ERROR: return { ...state, constituentUnits: TaskErrorReducer(state.constituentUnits, act) }
    case DepartmentActionTypes.DEPARTMENT_FETCH_SUPPORTING_UNITS_REQUEST: return { ...state, supportingUnits: TaskStartReducer(state.supportingUnits, act) }
    case DepartmentActionTypes.DEPARTMENT_FETCH_SUPPORTING_UNITS_SUCCESS: return { ...state, supportingUnits: TaskSuccessReducer(state.supportingUnits, act) }
    case DepartmentActionTypes.DEPARTMENT_FETCH_SUPPORTING_UNITS_ERROR: return { ...state, supportingUnits: TaskErrorReducer(state.supportingUnits, act) }
    default: return state
  }
}
//#endregion

const api = restApi();

//#region SAGA
function* handleFetch(req: IEntityRequest) {
  yield put(fetchProfileRequest(req))
  yield put(fetchConstituentUnitsRequest(req))
  yield put(fetchSupportingUnitsRequest(req))
}

function* handleFetchProfile(api:IApi,req:IEntityRequest){
  const action = 
  yield api.get<IDepartment>(apiEndpoints.departments.root(req.id))
    .then(fetchProfileSuccess)
    .catch(signinIfUnauthorized)
    .catch(fetchProfileError)
yield put (action);
}

function* handleConstituentUnitsFetch(api: IApi, req: IEntityRequest) {
  const action = 
    yield api
      .get<IUnit[]>(apiEndpoints.departments.constituentUnits(req.id))
      .then(fetchConstituentUnitsSuccess)
      .catch(signinIfUnauthorized)
      .catch(fetchConstituentUnitsError);
  yield put(action);
}

function* handleSupportingUnitsFetch(api: IApi, req: IEntityRequest) {
  const action = 
    yield api
      .get<IUnit[]>(apiEndpoints.departments.supportingUnits(req.id))
      .then(fetchSupportingUnitsSuccess)
      .catch(signinIfUnauthorized)
      .catch(fetchSupportingUnitsError);
  yield put(action);
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchDepartmentFetch() {
  yield takeEvery(DepartmentActionTypes.DEPARTMENT_FETCH_REQUEST, (a: AnyAction) => handleFetch(a.payload))
  yield takeEvery(DepartmentActionTypes.DEPARTMENT_FETCH_PROFILE_REQUEST, (a: AnyAction) => handleFetchProfile(api, a.payload))
  yield takeEvery(DepartmentActionTypes.DEPARTMENT_FETCH_CONSTITUENT_UNITS_REQUEST, (a: AnyAction) => handleConstituentUnitsFetch(api, a.payload))
  yield takeEvery(DepartmentActionTypes.DEPARTMENT_FETCH_SUPPORTING_UNITS_REQUEST, (a: AnyAction) => handleSupportingUnitsFetch(api, a.payload))
}

// We can also use `fork()` here to split our saga into multiple watchers.
export function* saga() {
  yield all([fork(watchDepartmentFetch)])
}
//#endregion
