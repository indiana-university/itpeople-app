/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { action } from "typesafe-actions";
import { IApiState, TaskErrorReducer, TaskStartReducer, defaultState, IDepartment, IUnit, IPerson, TaskSuccessReducer } from "../types";
import { SearchLists } from "./Results";

//#region TYPES
const enum SearchActionTypes {
  SEARCH_SIMPLE_SUBMIT = "@@search/SEARCH_SIMPLE_SUBMIT",
  SEARCH_UNITS_FETCH_REQUEST = "@@search/SEARCH_UNITS_FETCH_REQUEST",
  SEARCH_UNITS_FETCH_SUCCESS = "@@search/SEARCH_UNITS_FETCH_SUCCESS",
  SEARCH_UNITS_FETCH_ERROR = "@@search/SEARCH_UNITS_FETCH_ERROR",
  SEARCH_DEPARTMENTS_FETCH_REQUEST = "@@search/SEARCH_DEPARTMENTS_FETCH_REQUEST",
  SEARCH_DEPARTMENTS_FETCH_SUCCESS = "@@search/SEARCH_DEPARTMENTS_FETCH_SUCCESS",
  SEARCH_DEPARTMENTS_FETCH_ERROR = "@@search/SEARCH_DEPARTMENTS_FETCH_ERROR",
  SEARCH_PEOPLE_FETCH_REQUEST = "@@search/SEARCH_PEOPLE_FETCH_REQUEST",
  SEARCH_PEOPLE_FETCH_SUCCESS = "@@search/SEARCH_PEOPLE_FETCH_SUCCESS",
  SEARCH_PEOPLE_FETCH_ERROR = "@@search/SEARCH_PEOPLE_FETCH_ERROR",
  SEARCH_SET_CURRENT_LIST = "SEARCH_SET_CURRENT_LIST"
}

export interface ISimpleSearchRequest {
  term?: string;
}

export interface IState extends ISimpleSearchRequest {
  departments: IApiState<ISimpleSearchRequest, IDepartment[]>;
  units: IApiState<ISimpleSearchRequest, IUnit[]>;
  people: IApiState<ISimpleSearchRequest, IPerson[]>;
  selectedList?: SearchLists;
}
//#endregion

//#region ACTIONS
export const setCurrentList = (list: SearchLists) => action(SearchActionTypes.SEARCH_SET_CURRENT_LIST, { list });
export const submit = (term: string) => action(SearchActionTypes.SEARCH_SIMPLE_SUBMIT, term);
export const searchUnitsRequest = (term: string) => action(SearchActionTypes.SEARCH_UNITS_FETCH_REQUEST, term);
export const searchUnitsSuccess = (resp: IApiResponse<IUnit[]>) => action(SearchActionTypes.SEARCH_UNITS_FETCH_SUCCESS, resp);
export const searchUnitsError = (error: string) => action(SearchActionTypes.SEARCH_UNITS_FETCH_ERROR, error);
export const searchDepartmentsRequest = (term: string) => action(SearchActionTypes.SEARCH_DEPARTMENTS_FETCH_REQUEST, term);
export const searchDepartmentsSuccess = (resp: IApiResponse<IDepartment[]>) => action(SearchActionTypes.SEARCH_DEPARTMENTS_FETCH_SUCCESS, resp);
export const searchDepartmentsError = (error: string) => action(SearchActionTypes.SEARCH_DEPARTMENTS_FETCH_ERROR, error);
export const searchPeopleRequest = (term: string) => action(SearchActionTypes.SEARCH_PEOPLE_FETCH_REQUEST, term);
export const searchPeopleSuccess = (resp: IApiResponse<IPerson[]>) => action(SearchActionTypes.SEARCH_PEOPLE_FETCH_SUCCESS, resp);
export const searchPeopleError = (error: string) => action(SearchActionTypes.SEARCH_PEOPLE_FETCH_ERROR, error);
//#endregion

import { Reducer, AnyAction } from "redux";

export const initialState: IState = {
  departments: defaultState(),
  units: defaultState(),
  people: defaultState(),
  selectedList: undefined
};

const setSelectedList = (s: IState) => {
  s.selectedList =
    s.selectedList ||
    (s.units.data && s.units.data.length
      ? SearchLists.Units
      : s.departments.data && s.departments.data.length
      ? SearchLists.Departments
      : s.people.data && s.people.data.length
      ? SearchLists.People
      : undefined);
  return s;
};

export const reducer: Reducer<IState> = (state = initialState, act) => {
  switch (act.type) {
    // submit search
    case SearchActionTypes.SEARCH_SIMPLE_SUBMIT:
      return { ...state, term: act.payload };

    // department search
    case SearchActionTypes.SEARCH_DEPARTMENTS_FETCH_REQUEST:
      return { ...state, departments: TaskStartReducer(state.departments, act) };
    case SearchActionTypes.SEARCH_DEPARTMENTS_FETCH_SUCCESS:
      return setSelectedList({ ...state, departments: TaskSuccessReducer(state.departments, act) });
    case SearchActionTypes.SEARCH_DEPARTMENTS_FETCH_ERROR:
      return { ...state, departments: TaskErrorReducer(state.departments, act) };

    // unit search
    case SearchActionTypes.SEARCH_UNITS_FETCH_REQUEST:
      return { ...state, units: TaskStartReducer(state.units, act) };
    case SearchActionTypes.SEARCH_UNITS_FETCH_SUCCESS:
      return setSelectedList({ ...state, units: TaskSuccessReducer(state.units, act) });
    case SearchActionTypes.SEARCH_UNITS_FETCH_ERROR:
      return { ...state, units: TaskErrorReducer(state.units, act) };

    // people search
    case SearchActionTypes.SEARCH_PEOPLE_FETCH_REQUEST:
      return { ...state, people: TaskStartReducer(state.people, act) };
    case SearchActionTypes.SEARCH_PEOPLE_FETCH_SUCCESS:
      return setSelectedList({ ...state, people: TaskSuccessReducer(state.people, act) });
    case SearchActionTypes.SEARCH_PEOPLE_FETCH_ERROR:
      return { ...state, people: TaskErrorReducer(state.people, act) };

    case SearchActionTypes.SEARCH_SET_CURRENT_LIST:
      return { ...state, selectedList: act.payload.list };
    default:
      return state;
  }
};

import { all, fork, put, takeEvery } from "redux-saga/effects";
import { restApi, IApi, IApiResponse } from "src/components/api";
import { signinIfUnauthorized, apiEndpoints } from "../effects";

const api = restApi();

function* handleSearch(api: IApi, term: string) {
  yield put(searchDepartmentsRequest(term));
  yield put(searchUnitsRequest(term));
  yield put(searchPeopleRequest(term));
}

function* handleDepartmentSearch(api: IApi, term: string) {
  const action = yield api
    .get<IDepartment[]>(apiEndpoints.departments.search(term))
    .then(searchDepartmentsSuccess)
    .catch(signinIfUnauthorized)
    .catch(searchDepartmentsError);

  yield put(action);
}
function* handleUnitSearch(api: IApi, term: string) {
  const action = yield api
    .get<IUnit[]>(apiEndpoints.units.search(term))
    .then(searchUnitsSuccess)
    .catch(signinIfUnauthorized)
    .catch(searchUnitsError);

  yield put(action);
}
function* handlePeopleSearch(api: IApi, term: string) {
  const action = yield api
    .get<IPerson[]>(apiEndpoints.people.search(term))
    .then(searchPeopleSuccess)
    .catch(signinIfUnauthorized)
    .catch(searchPeopleError);

  yield put(action);
}

function* watchSimpleSearchFetch() {
  yield takeEvery(SearchActionTypes.SEARCH_SIMPLE_SUBMIT, (a: AnyAction) => handleSearch(api, a.payload));
  yield takeEvery(SearchActionTypes.SEARCH_DEPARTMENTS_FETCH_REQUEST, (a: AnyAction) => handleDepartmentSearch(api, a.payload));
  yield takeEvery(SearchActionTypes.SEARCH_UNITS_FETCH_REQUEST, (a: AnyAction) => handleUnitSearch(api, a.payload));
  yield takeEvery(SearchActionTypes.SEARCH_PEOPLE_FETCH_REQUEST, (a: AnyAction) => handlePeopleSearch(api, a.payload));
}

export function* saga() {
  yield all([fork(watchSimpleSearchFetch)]);
}
