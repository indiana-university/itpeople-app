/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

//#region TYPES
import { IApiState, IEntityRequest, IPerson, IUnitMembership, defaultState } from "../types";

export const enum ProfileActionTypes {
  PROFILE_FETCH_REQUEST = "@@profile/PROFILE_FETCH_REQUEST",
  PROFILE_FETCH_SUCCESS = "@@profile/PROFILE_FETCH_SUCCESS",
  PROFILE_FETCH_ERROR = "@@profile/PROFILE_FETCH_ERROR",
  // PROFILE_UPDATE_REQUEST = "@@profile/PROFILE_UPDATE_REQUEST",
  // PROFILE_UPDATE_SUCCESS = "@@profile/PROFILE_UPDATE_SUCCESS",
  // PROFILE_UPDATE_ERROR = "@@profile/PROFILE_UPDATE_ERROR",
  PROFILE_TOGGLE_UNIT = "PROFILE_TOGGLE_UNIT",
  PROFILE_MEMBERSHIPS_FETCH_REQUEST = "@@profile/PROFILE_MEMBERSHIPS_FETCH_REQUEST",
  PROFILE_MEMBERSHIPS_FETCH_SUCCESS = "@@profile/PROFILE_MEMBERSHIPS_FETCH_SUCCESS",
  PROFILE_MEMBERSHIPS_FETCH_ERROR = "@@profile/PROFILE_MEMBERSHIPS_FETCH_ERROR"
}




export interface IState {
  person: IApiState<IEntityRequest, IPerson>;
  memberships: IApiState<IEntityRequest, IUnitMembership[]>;
  visuallyExpandedUnits: number[];
}

//#endregion

//#region ACTIONS
import { action } from "typesafe-actions";
export const fetchRequest = (request: IEntityRequest) => action(ProfileActionTypes.PROFILE_FETCH_REQUEST, request);
const fetchSuccess = (response: IApiResponse<IPerson>) => action(ProfileActionTypes.PROFILE_FETCH_SUCCESS, response);
const fetchError = (error: Error) => action(ProfileActionTypes.PROFILE_FETCH_ERROR, error);
// export const updateRequest = (request: IPersonRequest) => action(ProfileActionTypes.PROFILE_UPDATE_REQUEST, request);
// export const updateSuccess = (data: IPersonProfile) => action(ProfileActionTypes.PROFILE_UPDATE_SUCCESS, data);
// export const updateError = (error: Error) => action(ProfileActionTypes.PROFILE_UPDATE_ERROR, error);
export const toggleUnit = (id: number) => action(ProfileActionTypes.PROFILE_TOGGLE_UNIT, id);

  // MEMBERSHIPS
export const fetchMembershipsRequest = (request: IEntityRequest) => action(ProfileActionTypes.PROFILE_MEMBERSHIPS_FETCH_REQUEST, request);
const fetchMembershipsSuccess = (response: IApiResponse<IUnitMembership[]>) => action(ProfileActionTypes.PROFILE_MEMBERSHIPS_FETCH_SUCCESS, response);
const fetchMembershipsError = (error: Error) => action(ProfileActionTypes.PROFILE_MEMBERSHIPS_FETCH_ERROR, error);
//#endregion

//#region REDUCER
import { Reducer, AnyAction } from "redux";
import {
  TaskErrorReducer,
  TaskStartReducer,
  TaskSuccessReducer
} from "../types";

// Type-safe initialState!
export const initialState: IState =  {
  person: defaultState(),
  memberships: defaultState(),
  visuallyExpandedUnits: []
};

const doToggleUnit = (state: IState, toggledId: number) : IState => {
  let a = [...state.visuallyExpandedUnits];
  let next = a.indexOf(toggledId) == -1
    ? [...a, toggledId]
    : a.filter(id => id != toggledId) ;
  return {...state, visuallyExpandedUnits: next}
}


// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
export const reducer: Reducer<IState> = (state = initialState, act): IState => {
  switch (act.type) {
    case ProfileActionTypes.PROFILE_FETCH_REQUEST: return {...state, person: TaskStartReducer(state.person, act)};
    case ProfileActionTypes.PROFILE_FETCH_SUCCESS: return { ...state, person: TaskSuccessReducer(state.person, act) };
    case ProfileActionTypes.PROFILE_FETCH_ERROR: return { ...state, person: TaskErrorReducer(state.person, act) };
    case ProfileActionTypes.PROFILE_MEMBERSHIPS_FETCH_REQUEST: return {...state, memberships: TaskStartReducer(state.memberships, act)};
    case ProfileActionTypes.PROFILE_MEMBERSHIPS_FETCH_SUCCESS: return { ...state, memberships: TaskSuccessReducer(state.memberships, act) };
    case ProfileActionTypes.PROFILE_MEMBERSHIPS_FETCH_ERROR: return { ...state, memberships: TaskErrorReducer(state.memberships, act) };
    case ProfileActionTypes.PROFILE_TOGGLE_UNIT: return doToggleUnit(state, act.payload);
    default: return state;
  }
};
//#endregion

//#region SAGAS
import { all, fork, takeEvery, put } from "redux-saga/effects";
import { restApi, IApiResponse, IApi } from "../api";
import { signinIfUnauthorized } from "../effects";

const api= restApi();

function* handleFetchPerson(api:IApi, person:IEntityRequest) {
  const nextAction = 
    yield api
      .get<IPerson>(`/people/${person.id}`)
      .then(fetchSuccess)
      .catch(signinIfUnauthorized)
      .catch(fetchError);
  yield put(nextAction)
}

function* handleFetchMemberships(api: IApi, person: IEntityRequest) {
  const nextAction = 
    yield api
      .get<IUnitMembership[]>(`/people/${person.id}/memberships`)
      .then(fetchMembershipsSuccess)
      .catch(signinIfUnauthorized)
      .catch(fetchMembershipsError);
  yield put(nextAction)
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchProfileFetch() {
  yield takeEvery(ProfileActionTypes.PROFILE_FETCH_REQUEST, (a: AnyAction) => handleFetchPerson(api, a.payload));
  yield takeEvery(ProfileActionTypes.PROFILE_MEMBERSHIPS_FETCH_REQUEST, (a: AnyAction)=>handleFetchMemberships(api, a.payload));
}

// We can also use `fork()` here to split our saga into multiple watchers.
export function* saga() {
  yield all([fork(watchProfileFetch)]);
}
//#endregion
