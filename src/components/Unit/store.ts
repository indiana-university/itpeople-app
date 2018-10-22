import { IApiState, IEntity, IRole } from '../../store/common'

//#region TYPES
export const enum UnitActionTypes {
    UNIT_FETCH_REQUEST = '@@unit/FETCH_REQUEST',
    UNIT_FETCH_SUCCESS = '@@unit/FETCH_SUCCESS',
    UNIT_FETCH_ERROR = '@@unit/FETCH_ERROR',
}

export interface IUnitRequest {
    id: string
}

export interface IUrl {
  url: string
}

export interface IMember extends IEntity, IRole {}
export interface IWebEntity extends IEntity, IUrl {}

export interface IUnitProfile {
    unit: IWebEntity,
    members: IMember[],
    supportedDepartments: IEntity[]
}

export interface IState extends IApiState<IUnitRequest, IUnitProfile> { 
}
//#endregion

//#region ACTIONS
import { action } from 'typesafe-actions'

const fetchRequest = (request: IUnitRequest) => action(UnitActionTypes.UNIT_FETCH_REQUEST, request)
const fetchSuccess = (data: IUnitProfile) => action(UnitActionTypes.UNIT_FETCH_SUCCESS, data)
const fetchError = (error: string) => action(UnitActionTypes.UNIT_FETCH_ERROR, error)
//#endregion

//#region REDUCER
import { Reducer } from 'redux'
import { FetchErrorReducer, FetchRequestReducer, FetchSuccessReducer } from '../../store/common'

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
import { all, fork, select, takeEvery } from 'redux-saga/effects'
import { httpGet } from '../../store/effects'
import { IApplicationState } from '../../store/index';

function* handleFetch() {
    const state = (yield select<IApplicationState>((s) => s.unit.request)) as IUnitRequest
    const path = `/units/${state.id}`
    yield httpGet<IUnitProfile>(path, fetchSuccess, fetchError)
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchUnitFetch() {
  yield takeEvery(UnitActionTypes.UNIT_FETCH_REQUEST, handleFetch)
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* saga() {
  yield all([fork(watchUnitFetch)])
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
