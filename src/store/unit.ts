import { IApiState } from './common'
import { IEntity } from './profile';

//#region TYPES
export const enum UnitActionTypes {
    UNIT_FETCH_REQUEST = '@@unit/FETCH_REQUEST',
    UNIT_FETCH_SUCCESS = '@@unit/FETCH_SUCCESS',
    UNIT_FETCH_ERROR = '@@unit/FETCH_ERROR',
}

export interface IUnitFetchRequest {
    id: string
}

export interface IUnitFetchResult extends IEntity {
    admins: IEntity[], 
    itpros: IEntity[],
    selfs: IEntity[]
}

export interface IState extends IApiState<IUnitFetchRequest, IUnitFetchResult> { 
}
//#endregion

//#region ACTIONS
import { action } from 'typesafe-actions'

const fetchRequest = (request: IUnitFetchRequest) => action(UnitActionTypes.UNIT_FETCH_REQUEST, request)
const fetchSuccess = (data: IUnitFetchResult) => action(UnitActionTypes.UNIT_FETCH_SUCCESS, data)
const fetchError = (error: string) => action(UnitActionTypes.UNIT_FETCH_ERROR, error)
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
    case UnitActionTypes.UNIT_FETCH_REQUEST: return FetchRequestReducer(state, act)
    case UnitActionTypes.UNIT_FETCH_SUCCESS: return FetchSuccessReducer(state, act)
    case UnitActionTypes.UNIT_FETCH_ERROR: return FetchErrorReducer(state, act)
    default: return state
  }
}
//#endregion


//#region SAGA
import { all, fork, put, select, takeEvery } from 'redux-saga/effects'
import { NotAuthorizedError } from '../components/errors';
import { signInRequest } from './auth';
// import { callApiWithAuth } from './effects'
import { IApplicationState } from './index';

// const API_ENDPOINT = process.env.REACT_APP_API_URL || ''

const mockResults: IUnitFetchResult = {
  admins: [{id: 1, name: "Knudsen, Ulrik"}],
  id: 1,
  itpros: [{id:2, name: "Hoerr, John"}, {id: 3, name: "Moberly, Brent"}],
  name: "College IT Office (CITO)",
  selfs: [{id:3, name: "Russell, James"}]
}

function* handleFetch() {
  try {
     const state = (yield select<IApplicationState>((s) => s.unit.request)) as IUnitFetchRequest
    // const path = `search?term=${state.term}`
    const response = {...mockResults, id: Number(state.id), errors:""} //  yield call(callApiWithAuth, 'get', API_ENDPOINT, path)
    console.log ("in try block", response)
    if (response.errors) {
      yield put(fetchError(response.errors))
    } else {
      yield put(fetchSuccess(response))
    }
  } catch (err) {
    console.log ("in catch block", err)
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
function* watchSimpleSearchFetch() {
  yield takeEvery(UnitActionTypes.UNIT_FETCH_REQUEST, handleFetch)
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* saga() {
  yield all([fork(watchSimpleSearchFetch)])
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
