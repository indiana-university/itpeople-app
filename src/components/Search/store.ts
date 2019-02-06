/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { action } from "typesafe-actions";
import {
    IEntity,
    IApiState,
    TaskErrorReducer,
    TaskStartReducer,
    TaskSuccessReducer
} from "../types";
import { SearchLists } from "./Results";

//#region TYPES
export const enum SearchActionTypes {
    SEARCH_SIMPLE_SUBMIT = "@@search/SEARCH_SIMPLE_SUBMIT",
    SEARCH_SIMPLE_FETCH_REQUEST = "@@search/SEARCH_SIMPLE_FETCH_REQUEST",
    SEARCH_SIMPLE_FETCH_SUCCESS = "@@search/SEARCH_SIMPLE_FETCH_SUCCESS",
    SEARCH_SIMPLE_FETCH_ERROR = "@@search/SEARCH_SIMPLE_FETCH_ERROR",
    SEARCH_SET_CURRENT_LIST = "SEARCH_SET_CURRENT_LIST"
}

export interface ISimpleSearchRequest {
    term: string;
}

export interface ISimpleSearchResult extends ISimpleSearchRequest {
    departments: IEntity[];
    units: IEntity[];
    users: IEntity[];
    selectedList?: SearchLists;
}
//#endregion

//#region ACTIONS
export const setCurrentList = (list: SearchLists) => action(SearchActionTypes.SEARCH_SET_CURRENT_LIST, { list });
export const submit = () => action(SearchActionTypes.SEARCH_SIMPLE_SUBMIT);
export const fetchRequest = (request: ISimpleSearchRequest) => action(SearchActionTypes.SEARCH_SIMPLE_FETCH_REQUEST, request);
export const fetchSuccess = (resp: IApiResponse<ISimpleSearchResult>) => action(SearchActionTypes.SEARCH_SIMPLE_FETCH_SUCCESS, resp.data);
export const fetchError = (error: string) => action(SearchActionTypes.SEARCH_SIMPLE_FETCH_ERROR, error);
//#endregion


import { Reducer, AnyAction } from "redux";

export interface IState
    extends IApiState<ISimpleSearchRequest, ISimpleSearchResult> { }

export const initialState: IState = {
    data: undefined,
    error: undefined,
    loading: false,
    request: undefined
};

export const reducer: Reducer<IState> = (state = initialState, act) => {
    switch (act.type) {
        case SearchActionTypes.SEARCH_SIMPLE_FETCH_REQUEST:
            return TaskStartReducer(state, act);
        case SearchActionTypes.SEARCH_SIMPLE_FETCH_SUCCESS:
            if (act.payload) {
                if (act.payload.users && act.payload.users.length) {
                    act.payload.selectedList = SearchLists.People;
                } else if (act.payload.units && act.payload.units.length) {
                    act.payload.selectedList = SearchLists.Units;
                } else if (act.payload.departments && act.payload.departments.length) {
                    act.payload.selectedList = SearchLists.Departments;
                }
            }
            return TaskSuccessReducer(state, act);
        case SearchActionTypes.SEARCH_SIMPLE_FETCH_ERROR:
            return TaskErrorReducer(state, act);
        case SearchActionTypes.SEARCH_SET_CURRENT_LIST:
            if (state.data) {
                return {
                    ...state,
                    data: { ...state.data, selectedList: act.payload.list },
                    error: undefined,
                    loading: false,
                    request: undefined
                };
            }
        default:
            return state;
    }
};

import { all, fork, put, takeEvery, } from 'redux-saga/effects';
import { restApi, IApi, IApiResponse } from 'src/components/api';
import { signinIfUnauthorized } from "../effects";

const api = restApi();

function* handleFetch(api: IApi, req: ISimpleSearchRequest) {
    const action = yield api
        .get<ISimpleSearchResult>(`/search?term=${req.term}`)
        .then(fetchSuccess)
        .catch(signinIfUnauthorized)
        .catch(fetchError)
    yield put(action)
}

function* watchSimpleSearchFetch() {
    yield takeEvery(SearchActionTypes.SEARCH_SIMPLE_FETCH_REQUEST, (a:AnyAction) => handleFetch(api, a.payload))
}

export function* saga() {
    yield all([ fork(watchSimpleSearchFetch) ])
}