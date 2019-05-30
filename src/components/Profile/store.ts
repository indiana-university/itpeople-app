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

  LOOKUP_TAG_REQUEST = "@@profile/LOOKUP_TAG_REQUEST",
  LOOKUP_TAG_SUCCESS = "@@profile/LOOKUP_TAG_SUCCESS",
  LOOKUP_TAG_ERROR = "@@profile/LOOKUP_TAG_ERROR",
  PROFILE_SAVE_REQUEST = "@@profile/PROFILE_SAVE_REQUEST",
  PROFILE_SAVE_SUCCESS = "@@profile/PROFILE_SAVE_SUCCESS",
  PROFILE_SAVE_ERROR = "@@profile/PROFILE_SAVE_ERROR",
  PROFILE_TOGGLE_UNIT = "PROFILE_TOGGLE_UNIT",
  PROFILE_MEMBERSHIPS_FETCH_REQUEST = "@@profile/PROFILE_MEMBERSHIPS_FETCH_REQUEST",
  PROFILE_MEMBERSHIPS_FETCH_SUCCESS = "@@profile/PROFILE_MEMBERSHIPS_FETCH_SUCCESS",
  PROFILE_MEMBERSHIPS_FETCH_ERROR = "@@profile/PROFILE_MEMBERSHIPS_FETCH_ERROR"
}

export interface IState {
  tags: string[];
  tagSearch: string;
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
export const savePerson = (person: IPerson) => action(ProfileActionTypes.PROFILE_SAVE_REQUEST, person);
export const savePersonSuccess = (response: IApiResponse<IPerson>) => action(ProfileActionTypes.PROFILE_SAVE_SUCCESS, response);
export const savePersonError = (error: Error) => action(ProfileActionTypes.PROFILE_SAVE_ERROR, error);
export const toggleUnit = (id: number) => action(ProfileActionTypes.PROFILE_TOGGLE_UNIT, id);

// MEMBERSHIPS
export const fetchMembershipsRequest = (request: IEntityRequest) => action(ProfileActionTypes.PROFILE_MEMBERSHIPS_FETCH_REQUEST, request);
const fetchMembershipsSuccess = (response: IApiResponse<IUnitMembership[]>) =>
  action(ProfileActionTypes.PROFILE_MEMBERSHIPS_FETCH_SUCCESS, response);
const fetchMembershipsError = (error: Error) => action(ProfileActionTypes.PROFILE_MEMBERSHIPS_FETCH_ERROR, error);

// TODO:
export const lookupTag = (q: string) => action(ProfileActionTypes.LOOKUP_TAG_REQUEST, q);
const lookupTagSuccess = (response: IApiResponse<any>) => action(ProfileActionTypes.LOOKUP_TAG_SUCCESS, response);
const lookupTagError = (error: Error) => action(ProfileActionTypes.LOOKUP_TAG_ERROR, error);

//#endregion

//#region REDUCER
import { Reducer, AnyAction } from "redux";
import { TaskErrorReducer, TaskStartReducer, TaskSuccessReducer } from "../types";

// Type-safe initialState!
export const initialState: IState = {
  person: defaultState(),
  memberships: defaultState(),
  visuallyExpandedUnits: [],
  tags: [],
  tagSearch: ""
};

const doToggleUnit = (state: IState, toggledId: number): IState => {
  let a = [...state.visuallyExpandedUnits];
  let next = a.indexOf(toggledId) == -1 ? [...a, toggledId] : a.filter(id => id != toggledId);
  return { ...state, visuallyExpandedUnits: next };
};

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
export const reducer: Reducer<IState> = (state = initialState, act): IState => {
  let tags = state.tags || [];
  switch (act.type) {
    case ProfileActionTypes.PROFILE_FETCH_REQUEST:
      return { ...state, person: TaskStartReducer(state.person, act) };
    case ProfileActionTypes.PROFILE_FETCH_SUCCESS:
      return { ...state, person: TaskSuccessReducer(state.person, act) };
    case ProfileActionTypes.PROFILE_FETCH_ERROR:
      return { ...state, person: TaskErrorReducer(state.person, act) };
    case ProfileActionTypes.PROFILE_MEMBERSHIPS_FETCH_REQUEST:
      return { ...state, memberships: TaskStartReducer(state.memberships, act) };
    case ProfileActionTypes.PROFILE_MEMBERSHIPS_FETCH_SUCCESS:
      return { ...state, memberships: TaskSuccessReducer(state.memberships, act) };
    case ProfileActionTypes.PROFILE_MEMBERSHIPS_FETCH_ERROR:
      return { ...state, memberships: TaskErrorReducer(state.memberships, act) };
    case ProfileActionTypes.PROFILE_TOGGLE_UNIT:
      return doToggleUnit(state, act.payload);

    //TODO: tag lookup
    case ProfileActionTypes.LOOKUP_TAG_REQUEST:
      return { ...state, tagSearch: act.payload };
    case ProfileActionTypes.LOOKUP_TAG_SUCCESS:
      if (act.payload.data.items) {
        tags = act.payload.data.items.map((item: any) => item.name);
      }
      return { ...state, tags };
    // case ProfileActionTypes.LOOKUP_TAG_ERROR:
    // return { ...state };

    default:
      return state;
  }
};
//#endregion

//#region SAGAS
import { all, fork, takeEvery, put } from "redux-saga/effects";
import { restApi, IApiResponse, IApi, IApiCall } from "../api";
import { signinIfUnauthorized } from "../effects";

const api = restApi();

function* handleFetchPerson(api: IApi, person: IEntityRequest) {
  const nextAction = yield api
    .get<IPerson>(`/people/${person.id}`)
    .then(fetchSuccess)
    .catch(signinIfUnauthorized)
    .catch(fetchError);
  yield put(nextAction);
}

function* handleFetchProfileSuccess(api: IApi, person: IEntityRequest) {
  yield put(fetchMembershipsRequest(person));
}

function* handleFetchMemberships(api: IApi, person: IEntityRequest) {
  const nextAction = yield api
    .get<IUnitMembership[]>(`/people/${person.id}/memberships`)
    .then(fetchMembershipsSuccess)
    .catch(signinIfUnauthorized)
    .catch(fetchMembershipsError);
  yield put(nextAction);
}

const caller: IApiCall = async <T>(method: string, apiUrl: string, path: string) =>
  fetch(apiUrl + path).then(resp => {
    return resp.json().then(json => ({ data: json, url: apiUrl + path } as IApiResponse<T>));
  });

const apiTags = restApi("https://api.stackexchange.com/2.2/tags", caller);
function* handleLookupTags(api: IApi, q: string) {
  const nextAction = yield apiTags
    .get(`?order=desc&site=stackoverflow&min=4000&sort=popular&inname=${encodeURIComponent(q)}`)
    .then(lookupTagSuccess)
    .catch(lookupTagError);
  yield put(nextAction);
}

function* handleSavePerson(api: IApi, person: IPerson) {
  const nextAction = yield api
    .put<IPerson>(`/people/${person.id}`, person)
    .then(savePersonSuccess)
    .then(() => fetchRequest({ id: person.id }))
    .catch(signinIfUnauthorized)
    .catch(savePersonError);
  yield put(nextAction);
}
// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchProfileFetch() {
  yield takeEvery(ProfileActionTypes.PROFILE_FETCH_REQUEST, (a: AnyAction) => handleFetchPerson(api, a.payload));
  yield takeEvery(ProfileActionTypes.PROFILE_MEMBERSHIPS_FETCH_REQUEST, (a: AnyAction) => handleFetchMemberships(api, a.payload));
  yield takeEvery(ProfileActionTypes.LOOKUP_TAG_REQUEST, (a: AnyAction) => handleLookupTags(api, a.payload));
  yield takeEvery(ProfileActionTypes.PROFILE_SAVE_REQUEST, (a: AnyAction) => handleSavePerson(api, a.payload));
  yield takeEvery(ProfileActionTypes.PROFILE_FETCH_SUCCESS, (a: AnyAction) => handleFetchProfileSuccess(api, a.payload.data));
}

// We can also use `fork()` here to split our saga into multiple watchers.
export function* saga() {
  yield all([fork(watchProfileFetch)]);
}
//#endregion
