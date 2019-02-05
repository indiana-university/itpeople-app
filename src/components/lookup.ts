import { action } from "typesafe-actions";
import { Reducer } from "redux";
import { takeEvery, all, fork, put, select } from "redux-saga/effects";
import { restApi, IApiResponse, IApi, signinIfUnauthorized } from "./api";
import { PayloadAction } from "typesafe-actions/dist/types";
import { IApplicationState } from "./types";

const api = restApi();

export const enum LookupActionTypes {
  LOOKUP = "LOOKUP",
  LOOKUP_FETCH_REQUESTED = "LOOKUP_FETCH_REQUESTED",
  LOOKUP_FETCH_SUCCESS = "LOOKUP_FETCH_SUCCESS",
  LOOKUP_FETCH_ERROR = "LOOKUP_FETCH_ERROR",
  LOOKUP_GET_CACHED_SUCCESS = "LOOKUP_GET_CACHED_SUCCESS"
}

const lookup = (url: string) => action(LookupActionTypes.LOOKUP, url.trim());
const lookupSuccess = (response: IApiResponse<any>) => action(LookupActionTypes.LOOKUP_FETCH_SUCCESS, response);
const lookupFromCacheSuccess = (data: any) => action(LookupActionTypes.LOOKUP_GET_CACHED_SUCCESS, data);
const lookupError = (error: Error) => action(LookupActionTypes.LOOKUP_FETCH_ERROR, error);

interface ILookupState {
  cache: {};
  q?: string;
  current?: any;
}

const initialState: ILookupState = {
  cache: {},
  q: "",
  current: null
};

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
      let { data, url } = action.payload;
      url = new URL(url);
      const path = url.pathname + decodeURI(url.search);
      let s = { ...state, current: data, cache: state.cache || {} };
      s.cache[path] = data;
      return s;
    case LookupActionTypes.LOOKUP_FETCH_ERROR:
      // todo: action.payload is a caught exception Error object
      return state;
    case LookupActionTypes.LOOKUP_GET_CACHED_SUCCESS:
      return { ...state, current: action.payload };
    default:
      return state;
  }
};

function* handleLookup(api: IApi, q: string) {
  const state = (yield select<IApplicationState>(s => s.lookup)) as ILookupState;
  const action = isCached(state.cache, q)
      ? lookupFromCacheSuccess(state.cache[q])
      : yield lookupFromApi(q);
  yield put(action);
}

const isCached = (cache : any, q: string) => cache && cache[q];

function* lookupFromApi (q: string) {
  return yield api
    .get<any>(q)
    .then(lookupSuccess)
    .catch(signinIfUnauthorized)
    .catch(lookupError);
}

function* watchLookupFetch() {
  yield takeEvery(LookupActionTypes.LOOKUP, (action: PayloadAction<string, string>) => handleLookup(api, action.payload));
}

function* saga() {
  yield all([fork(watchLookupFetch)]);
}

export { initialState, lookup, ILookupState, saga, reducer };
