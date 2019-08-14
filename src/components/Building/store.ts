/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { Reducer, AnyAction  } from 'redux'
import { all, fork, takeEvery, put } from 'redux-saga/effects'
import { action } from 'typesafe-actions'
import { apiEndpoints, signinIfUnauthorized } from '../effects'
import { IApiState, TaskErrorReducer, TaskStartReducer, TaskSuccessReducer, IEntityRequest, defaultState, IBuildingSupportRelationship, IBuilding } from '../types'
import { restApi, IApi, IApiResponse } from '../api';

//#region TYPES
export const enum BuildingActionTypes {
    BUILDING_FETCH_REQUEST = '@@building/FETCH_REQUEST',
    BUILDING_FETCH_SUCCESS = '@@building/FETCH_SUCCESS',
    BUILDING_FETCH_ERROR = '@@building/FETCH_ERROR',
    BUILDING_FETCH_PROFILE_REQUEST = '@@building/FETCH_PROFILE_REQUEST',
    BUILDING_FETCH_PROFILE_SUCCESS = '@@building/FETCH_PROFILE_SUCCESS',
    BUILDING_FETCH_PROFILE_ERROR = '@@building/FETCH_PROFILE_ERROR',
    BUILDING_FETCH_SUPPORTING_UNITS_REQUEST = '@@building/FETCH_SUPPORTING_UNITS_REQUEST',
    BUILDING_FETCH_SUPPORTING_UNITS_SUCCESS = '@@building/FETCH_SUPPORTING_UNITS_SUCCESS',
    BUILDING_FETCH_SUPPORTING_UNITS_ERROR = '@@building/FETCH_SUPPORTING_UNITS_ERROR',
}

export interface IState {
  profile: IApiState<IEntityRequest, IBuilding>;
  supportingUnits: IApiState<IEntityRequest, IBuildingSupportRelationship[]>;
}
//#endregion


//#region ACTIONS
export const fetchRequest = (request: IEntityRequest) => action(BuildingActionTypes.BUILDING_FETCH_REQUEST, request)
const fetchProfileRequest = (request: IEntityRequest) => action(BuildingActionTypes.BUILDING_FETCH_PROFILE_REQUEST, request)
const fetchProfileSuccess = (response: IApiResponse<IBuilding>) => action(BuildingActionTypes.BUILDING_FETCH_PROFILE_SUCCESS, response)
const fetchProfileError = (error: Error) => action(BuildingActionTypes.BUILDING_FETCH_PROFILE_ERROR, error)
const fetchSupportingUnitsRequest = (request: IEntityRequest) => action(BuildingActionTypes.BUILDING_FETCH_SUPPORTING_UNITS_REQUEST, request)
const fetchSupportingUnitsSuccess = (response: IApiResponse<IBuildingSupportRelationship[]>) => action(BuildingActionTypes.BUILDING_FETCH_SUPPORTING_UNITS_SUCCESS, response)
const fetchSupportingUnitsError = (error: Error) => action(BuildingActionTypes.BUILDING_FETCH_SUPPORTING_UNITS_ERROR, error)
//#endregion


//#region REDUCER
export const initialState: IState = {
  profile: defaultState(),
  supportingUnits: defaultState(),
}

export const reducer: Reducer<IState> = (state = initialState, act) => {
  switch (act.type) {
    case BuildingActionTypes.BUILDING_FETCH_PROFILE_REQUEST: return {...state, profile: TaskStartReducer(state.profile, act) }
    case BuildingActionTypes.BUILDING_FETCH_PROFILE_SUCCESS: return { ...state, profile: TaskSuccessReducer(state.profile, act) }
    case BuildingActionTypes.BUILDING_FETCH_PROFILE_ERROR: return { ...state, profile: TaskErrorReducer(state.profile, act) }
    case BuildingActionTypes.BUILDING_FETCH_SUPPORTING_UNITS_REQUEST: return { ...state, supportingUnits: TaskStartReducer(state.supportingUnits, act) }
    case BuildingActionTypes.BUILDING_FETCH_SUPPORTING_UNITS_SUCCESS: return { ...state, supportingUnits: TaskSuccessReducer(state.supportingUnits, act) }
    case BuildingActionTypes.BUILDING_FETCH_SUPPORTING_UNITS_ERROR: return { ...state, supportingUnits: TaskErrorReducer(state.supportingUnits, act) }
    default: return state
  }
}
//#endregion

const api = restApi();

//#region SAGA
function* handleFetch(req: IEntityRequest) {
  console.log("*** handleFetch ***")
  yield put(fetchProfileRequest(req))
  yield put(fetchSupportingUnitsRequest(req))
}

function* handleFetchProfile(api:IApi, req:IEntityRequest){
  const action = 
  yield api.get<IBuilding>(apiEndpoints.buildings.root(req.id))
    .then(fetchProfileSuccess)
    .catch(signinIfUnauthorized)
    .catch(fetchProfileError)
yield put (action);
}

function* handleSupportingUnitsFetch(api: IApi, req: IEntityRequest) {
  const action = 
    yield api
      .get<IBuildingSupportRelationship[]>(apiEndpoints.buildings.supportingUnits(req.id))
      .then(fetchSupportingUnitsSuccess)
      .catch(signinIfUnauthorized)
      .catch(fetchSupportingUnitsError);
  yield put(action);
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchBuildingFetch() {
  yield takeEvery(BuildingActionTypes.BUILDING_FETCH_REQUEST, (a: AnyAction) => handleFetch(a.payload))
  yield takeEvery(BuildingActionTypes.BUILDING_FETCH_PROFILE_REQUEST, (a: AnyAction) => handleFetchProfile(api, a.payload))
  yield takeEvery(BuildingActionTypes.BUILDING_FETCH_SUPPORTING_UNITS_REQUEST, (a: AnyAction) => handleSupportingUnitsFetch(api, a.payload))
}

// We can also use `fork()` here to split our saga into multiple watchers.
export function* saga() {
  yield all([fork(watchBuildingFetch)])
}
//#endregion
