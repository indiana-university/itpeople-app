import { IApiState, IApplicationState, IEntity } from '../types'

//#region TYPES
export const enum SearchActionTypes {
    SEARCH_SIMPLE_SUBMIT = '@@search/SEARCH_SIMPLE_SUBMIT',
    SEARCH_SIMPLE_FETCH_REQUEST = '@@search/SEARCH_SIMPLE_FETCH_REQUEST',
    SEARCH_SIMPLE_FETCH_SUCCESS = '@@search/SEARCH_SIMPLE_FETCH_SUCCESS',
    SEARCH_SIMPLE_FETCH_ERROR = '@@search/SEARCH_SIMPLE_FETCH_ERROR',
}

export interface ISimpleSearchRequest {
    term: string,
}

export interface ISimpleSearchResult extends ISimpleSearchRequest {
    departments: IEntity[], 
    units: IEntity[],
    users: IEntity[]
}

export interface IState extends IApiState<ISimpleSearchRequest, ISimpleSearchResult> { 
}
//#endregion

//#region ACTIONS
import { action } from 'typesafe-actions'

export const submit = () => action(SearchActionTypes.SEARCH_SIMPLE_SUBMIT)
export const fetchRequest = (request: ISimpleSearchRequest) => action(SearchActionTypes.SEARCH_SIMPLE_FETCH_REQUEST, request)
export const fetchSuccess = (data: ISimpleSearchResult) => action(SearchActionTypes.SEARCH_SIMPLE_FETCH_SUCCESS, data)
export const fetchError = (error: string) => action(SearchActionTypes.SEARCH_SIMPLE_FETCH_ERROR, error)
//#endregion

//#region REDUCER
import { Reducer } from 'redux'
import { FetchErrorReducer, FetchRequestReducer, FetchSuccessReducer } from '../types'

export const initialState: IState = {
    data: undefined,
    error: undefined,
    loading: false,
    request: undefined,
}

export const reducer: Reducer<IState> = (state = initialState, act) => {
  switch (act.type) {
    case SearchActionTypes.SEARCH_SIMPLE_FETCH_REQUEST: return FetchRequestReducer(state, act)
    case SearchActionTypes.SEARCH_SIMPLE_FETCH_SUCCESS: return FetchSuccessReducer(state, act)
    case SearchActionTypes.SEARCH_SIMPLE_FETCH_ERROR: return FetchErrorReducer(state, act)
    default: return state
  }
}
//#endregion


//#region SAGA
import { push } from 'react-router-redux';
import { all, fork, put, select, takeEvery,  } from 'redux-saga/effects'
import { httpGet } from '../effects'
import { IUnitList } from '../Units/store';

function* handleFetch() {
    const state = (yield select<IApplicationState>((s) => s.searchSimple.request)) as ISimpleSearchRequest
    const path = `/search?term=${state.term}`
    yield httpGet<IUnitList>(path, fetchSuccess, fetchError)
}

function* handleSubmit() {
  const form = (yield select<any>((s) => s.form.search.values)) as ISimpleSearchRequest
  if (form.term) {
    yield put(push(`/search?term=${form.term}`))
  }
}

function* watchSimpleSearchFetch() {
  yield takeEvery(SearchActionTypes.SEARCH_SIMPLE_FETCH_REQUEST, handleFetch)
}

function* watchSimpleSearchSubmit() {
  yield takeEvery(SearchActionTypes.SEARCH_SIMPLE_SUBMIT, handleSubmit)
}

export function* saga() {
  yield all([fork(watchSimpleSearchFetch), fork(watchSimpleSearchSubmit)])
}
//#endregion
