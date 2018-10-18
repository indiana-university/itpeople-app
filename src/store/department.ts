import { IApiState } from './common'
import { IEntity } from './profile';

//#region TYPES
export const enum DepartmentActionTypes {
    DEPARTMENT_FETCH_REQUEST = '@@department/FETCH_REQUEST',
    DEPARTMENT_FETCH_SUCCESS = '@@department/FETCH_SUCCESS',
    DEPARTMENT_FETCH_ERROR = '@@department/FETCH_ERROR',
}

export interface IDepartmentRequest {
    id: string
}

export interface IDepartmentProfile {
  department: IEntity,
  members: IEntity[],
  units: IEntity[],
  supportingUnits: IEntity[],
}

export interface IState extends IApiState<IDepartmentRequest, IDepartmentProfile> { 
}
//#endregion

//#region ACTIONS
import { action } from 'typesafe-actions'

const fetchRequest = (request: IDepartmentRequest) => action(DepartmentActionTypes.DEPARTMENT_FETCH_REQUEST, request)
const fetchSuccess = (data: IDepartmentProfile) => action(DepartmentActionTypes.DEPARTMENT_FETCH_SUCCESS, data)
const fetchError = (error: string) => action(DepartmentActionTypes.DEPARTMENT_FETCH_ERROR, error)
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
    case DepartmentActionTypes.DEPARTMENT_FETCH_REQUEST: return FetchRequestReducer(state, act)
    case DepartmentActionTypes.DEPARTMENT_FETCH_SUCCESS: return FetchSuccessReducer(state, act)
    case DepartmentActionTypes.DEPARTMENT_FETCH_ERROR: return FetchErrorReducer(state, act)
    default: return state
  }
}
//#endregion


//#region SAGA
import { all, fork, select, takeEvery } from 'redux-saga/effects'
import { httpGet } from './effects'
import { IApplicationState } from './index';

function* handleFetch() {
    const state = (yield select<IApplicationState>((s) => s.org.request)) as IDepartmentRequest
    const path = `/departments/${state.id}`
    yield httpGet<IDepartmentProfile>(path, fetchSuccess, fetchError)
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchDepartmentFetch() {
  yield takeEvery(DepartmentActionTypes.DEPARTMENT_FETCH_REQUEST, handleFetch)
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* saga() {
  yield all([fork(watchDepartmentFetch)])
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
