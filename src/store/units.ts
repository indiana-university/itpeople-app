import { IApiState } from './common'
import { IEntity } from './profile';

//#region TYPES
export const enum UnitsActionTypes {
    UNITS_FETCH_REQUEST = '@@units/FETCH_REQUEST',
    UNITS_FETCH_SUCCESS = '@@units/FETCH_SUCCESS',
    UNITS_FETCH_ERROR = '@@units/FETCH_ERROR',
}

export interface IFetchResult {
    units: IEntity[]
}

export interface IState extends IApiState<{}, IFetchResult> { 
}
//#endregion

//#region ACTIONS
import { action } from 'typesafe-actions'

const fetchRequest = () => action(UnitsActionTypes.UNITS_FETCH_REQUEST)
const fetchSuccess = (data: IFetchResult) => action(UnitsActionTypes.UNITS_FETCH_SUCCESS, data)
const fetchError = (error: string) => action(UnitsActionTypes.UNITS_FETCH_ERROR, error)
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
    case UnitsActionTypes.UNITS_FETCH_REQUEST: return FetchRequestReducer(state, act)
    case UnitsActionTypes.UNITS_FETCH_SUCCESS: return FetchSuccessReducer(state, act)
    case UnitsActionTypes.UNITS_FETCH_ERROR: return FetchErrorReducer(state, act)
    default: return state
  }
}
//#endregion


//#region SAGA
import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import { NotAuthorizedError } from '../components/errors';
import { signInRequest } from './auth';
import { callApiWithAuth } from './effects'

const API_ENDPOINT = process.env.REACT_APP_API_URL || ''

function* handleFetch() {
  try {
    const response = yield call(callApiWithAuth, 'get', API_ENDPOINT, `/units`)
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

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchUnitsFetch() {
  yield takeEvery(UnitsActionTypes.UNITS_FETCH_REQUEST, handleFetch)
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* saga() {
  yield all([fork(watchUnitsFetch)])
}
//#endregion


// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export { 
  fetchRequest,
  fetchError,
  fetchSuccess,
  reducer,
  initialState,
  saga
}
