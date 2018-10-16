import { IApiState } from './common'
import { IEntity } from './profile';

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

const submit = () => action(SearchActionTypes.SEARCH_SIMPLE_SUBMIT)
const fetchRequest = (request: ISimpleSearchRequest) => action(SearchActionTypes.SEARCH_SIMPLE_FETCH_REQUEST, request)
const fetchSuccess = (data: ISimpleSearchResult) => action(SearchActionTypes.SEARCH_SIMPLE_FETCH_SUCCESS, data)
const fetchError = (error: string) => action(SearchActionTypes.SEARCH_SIMPLE_FETCH_ERROR, error)
//#endregion

//#region REDUCER
import { Reducer } from 'redux'
import { FetchErrorReducer, FetchRequestReducer, FetchSuccessReducer } from './common'

// Type-safe initialState!
const initialState: IState = {
    data: undefined,
    error: undefined,
    loading: false,
    request: undefined,
}

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
const reducer: Reducer<IState> = (state = initialState, act) => {
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
import { all, call, fork, put, select, takeEvery,  } from 'redux-saga/effects'
import { NotAuthorizedError } from '../components/errors';
import { signInRequest } from './auth';
import { callApiWithAuth } from './effects'
import { IApplicationState } from './index';

const API_ENDPOINT = process.env.REACT_APP_API_URL || ''

function* handleFetch() {
  try {
    const state = (yield select<IApplicationState>((s) => s.searchSimple.request)) as ISimpleSearchRequest
    const response = yield call(callApiWithAuth, 'get', API_ENDPOINT, `/search?term=${state.term}`)
    if (response.errors) {
      yield put(fetchError(response.errors))
    } else {
      yield put(fetchSuccess(response))
    }
  } catch (err) {
    if (err instanceof NotAuthorizedError){
      yield put(signInRequest())
    }
    else if (err instanceof Error) {
      yield put(fetchError(err.stack!))
    } else {
      yield put(fetchError('An unknown error occured.'))
    }
  }
}

function* handleSubmit() {
  const form = (yield select<any>((s) => s.form.search.values)) as ISimpleSearchRequest
  if (form.term) {
    yield put(push(`/search?term=${form.term}`))
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchSimpleSearchFetch() {
  yield takeEvery(SearchActionTypes.SEARCH_SIMPLE_FETCH_REQUEST, handleFetch)
}

function* watchSimpleSearchSubmit() {
  yield takeEvery(SearchActionTypes.SEARCH_SIMPLE_SUBMIT, handleSubmit)
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* saga() {
  yield all([fork(watchSimpleSearchFetch), fork(watchSimpleSearchSubmit)])
}
//#endregion


// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export { 
  submit,
  fetchRequest,
  fetchError,
  fetchSuccess,
  reducer,
  initialState,
  saga
}
