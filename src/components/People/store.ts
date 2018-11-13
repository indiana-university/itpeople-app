//#region TYPES
import { IApiState } from '../types'
import { all, fork, takeEvery } from 'redux-saga/effects'
import { httpGet } from '../effects'
import { IUser } from '../Profile/store';
import { Reducer } from 'redux'
import { FetchErrorReducer, FetchRequestReducer, FetchSuccessReducer } from '../types'

export const enum PeopleActionTypes {
  PEOPLE_FETCH_REQUEST = '@@people/PEOPLE_FETCH_REQUEST',
  PEOPLE_FETCH_SUCCESS = '@@people/PEOPLE_FETCH_SUCCESS',
  PEOPLE_FETCH_ERROR = '@@people/PEOPLE_FETCH_ERROR',
}

export interface IUsers {
  users?: IUser[]
}

export interface IState extends IApiState<IUser[], IUser[]> {}
//#endregion

//#region ACTIONS
import { action } from 'typesafe-actions'
export const fetchRequest = () => action(PeopleActionTypes.PEOPLE_FETCH_REQUEST,{})
export const fetchSuccess = (data: IUser[]) => action(PeopleActionTypes.PEOPLE_FETCH_SUCCESS, data)
export const fetchError = (error: string) => action(PeopleActionTypes.PEOPLE_FETCH_ERROR, error)
//#endregion

//#region REDUCER

// Type-safe initialState!
export const initialState: IState = {
  data: undefined,
  error: undefined,
  loading: false,
  request: undefined,
}

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
export const reducer: Reducer<IState> = (state = initialState, act) => {
  switch (act.type) {
    case PeopleActionTypes.PEOPLE_FETCH_REQUEST: return FetchRequestReducer(state, act)
    case PeopleActionTypes.PEOPLE_FETCH_SUCCESS: return FetchSuccessReducer(state, act)
    case PeopleActionTypes.PEOPLE_FETCH_ERROR: return FetchErrorReducer(state, act)
    default: return state
  }
}
//#endregion


function* handleFetch() {
  const path = `/people`
  yield httpGet<any>(path, fetchSuccess, fetchError)
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchPeopleFetch() {
  yield takeEvery(PeopleActionTypes.PEOPLE_FETCH_REQUEST, handleFetch)
}

// We can also use `fork()` here to split our saga into multiple watchers.
export function* saga() {
  yield all([fork(watchPeopleFetch)])
}
//#endregion
