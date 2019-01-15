import { action } from "typesafe-actions";
import { Reducer } from "redux";
import { select, takeEvery, all, fork, put } from "redux-saga/effects";
import { IApplicationState } from "./types";
import * as api from "./api"

export const enum LookupActionTypes {
    LOOKUP = "LOOKUP",
    LOOKUP_FETCH_REQUESTED = "LOOKUP_FETCH_REQUESTED",
    LOOKUP_FETCH_SUCCESS = "LOOKUP_FETCH_SUCCESS",
    LOOKUP_FETCH_ERROR = "LOOKUP_FETCH_ERROR",
    LOOKUP_GET_CACHED_SUCCESS = "LOOKUP_GET_CACHED_SUCCESS",
}

const lookup = (url: string) => action(LookupActionTypes.LOOKUP, url.trim())
const lookupSuccess = (response: api.ApiResponse<any>) => action(LookupActionTypes.LOOKUP_FETCH_SUCCESS, response)
const lookupFromCacheSuccess = (data: any) => action(LookupActionTypes.LOOKUP_GET_CACHED_SUCCESS, data)
const lookupError = (error: string) => action(LookupActionTypes.LOOKUP_FETCH_ERROR, error)

interface ILookupState {
    cache: {},
    q?: string,
    current?: any
}


const initialState: ILookupState = {
    cache: {},
    q: "",
    current: null
}

const reducer: Reducer = (state = initialState, action) => {
    switch (action.type) {
        case LookupActionTypes.LOOKUP:
            if (action.payload == "") {
                return { ...state, current: null, q: "" };
            }
            return { ...state, q: action.payload };
        case LookupActionTypes.LOOKUP_FETCH_REQUESTED:
            return state;
        case LookupActionTypes.LOOKUP_FETCH_SUCCESS:
            const data = action.payload.data;
            const resposne = action.payload.response as Response;
            let s = { ...state, current: data, cache: state.cache || {} };
            const url = new URL(resposne.url);
            const path = url.pathname + decodeURI(url.search);
            s.cache[path] = data;
            return s;
        case LookupActionTypes.LOOKUP_FETCH_ERROR:
            // todo:
            return state;
        case LookupActionTypes.LOOKUP_GET_CACHED_SUCCESS:
            return { ...state, current: action.payload };


        default: return state;
    }
}

function* handleLookup() {
    const state = (yield select<IApplicationState>((s) => s.lookup)) as ILookupState;

    if (!state.q) {
        return lookupError("no query");
    }

    if (state.cache && state.cache[state.q]) {
        yield put(lookupFromCacheSuccess(state.cache[state.q]));
    } else {
        yield api.get<any>(state.q, lookupSuccess, lookupError)
    }
}

function* watchLookupFetch() {
    yield takeEvery(LookupActionTypes.LOOKUP, handleLookup);
}
function* saga() {
    yield all([fork(watchLookupFetch)])
}

export {
    initialState,
    lookup,
    ILookupState,
    saga,
    reducer
}