//#region TYPES
import { IApiState } from './common'

export const enum ProfileActionTypes {
    PROFILE_FETCH_REQUEST = '@@profile/PROFILE_FETCH_REQUEST',
    PROFILE_FETCH_SUCCESS = '@@profile/PROFILE_FETCH_SUCCESS',
    PROFILE_FETCH_ERROR = '@@profile/PROFILE_FETCH_ERROR',
    PROFILE_UPDATE_REQUEST = '@@profile/PROFILE_UPDATE_REQUEST',
    PROFILE_UPDATE_SUCCESS = '@@profile/PROFILE_UPDATE_SUCCESS',
    PROFILE_UPDATE_ERROR = '@@profile/PROFILE_UPDATE_ERROR',
}

export interface IFetchRequest {
    id: number,
}

export interface IUpdateRequest {
    expertise: string,
    responsibilities: string
}

export interface IEntity {
  id: number,
  name: string
}

export interface IUser extends IEntity, IUpdateRequest {
    netId: string,
    position: string,
    location: string,
    locationCode: string,
    campusPhone: string,
    campusEmail: string,
    unit: IEntity,
    campus: string,
    role: string,
    org: IEntity,
    serviceOrgs: IEntity [],
    toolsAccess: IEntity []
}


export interface IState extends IApiState<IFetchRequest, IUser> { 
}
//#endregion

//#region ACTIONS
import { action } from 'typesafe-actions'
const fetchRequest = (request: IFetchRequest) => action(ProfileActionTypes.PROFILE_FETCH_REQUEST, request)
const fetchSuccess = (data: IUser) => action(ProfileActionTypes.PROFILE_FETCH_SUCCESS, data)
const fetchError = (error: string) => action(ProfileActionTypes.PROFILE_FETCH_ERROR, error)
const updateRequest = (request: IFetchRequest) => action(ProfileActionTypes.PROFILE_UPDATE_REQUEST, request)
const updateSuccess = (data: IUser) => action(ProfileActionTypes.PROFILE_UPDATE_SUCCESS, data)
const updateError = (error: string) => action(ProfileActionTypes.PROFILE_UPDATE_ERROR, error)
//#endregion

//#region REDUCER
import { Reducer } from 'redux'
import { FetchErrorReducer, FetchRequestReducer, FetchSuccessReducer, PutErrorReducer, PutRequestReducer, PutSuccessReducer } from './common'

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
    case ProfileActionTypes.PROFILE_FETCH_REQUEST: return FetchRequestReducer(state, act)
    case ProfileActionTypes.PROFILE_FETCH_SUCCESS: return FetchSuccessReducer(state, act)
    case ProfileActionTypes.PROFILE_FETCH_ERROR: return FetchErrorReducer(state, act)
    case ProfileActionTypes.PROFILE_UPDATE_REQUEST: return PutRequestReducer(state, act)
    case ProfileActionTypes.PROFILE_UPDATE_SUCCESS: return PutSuccessReducer(state, act)
    case ProfileActionTypes.PROFILE_UPDATE_ERROR: return PutErrorReducer(state, act)
    default: return state
  }
}
//#endregion

//#region SAGAS
import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects'
import { NotAuthorizedError } from '../components/errors';
import { signInRequest  } from './auth'
import { callApiWithAuth } from './effects'
import { IApplicationState } from './index'

const API_ENDPOINT = process.env.REACT_APP_API_URL || ''

const ulrikDetails: IUser = {
  campus: "IUBLA",
  campusEmail: "ulrik@iu.edu",
  campusPhone: "812-111-11111",
  expertise: "Lots of stuff, I swear",
  id: 1,
  location: "UITS CyberInfrastructure Building",
  locationCode: "BL",
  name: "Knudsen, Ulrik",
  netId: 'ulrik',
  org: {
    id: 1,
    name: "BL-ARSD"
  },
  position: "Chief Technology Officer",
  responsibilities: "IT Director",
  role: "ADM",
  serviceOrgs: [{id: 1, name: "BL-ARSD"}, {id: 2, name: "BL-DEMA"}],
  toolsAccess: [{id: 1, name: "IT PRO Website"}, {id: 2, name: "Account Management"}],
  unit: {id: 1, name: "College IT Office (CITO)"}
}



function* handleFetch() {
  try {
    // const state = (yield select<IApplicationState>((s) => s.profile.request)) as IFetchRequest
    // const path = state.id === 0 ? "/me" : `users/${state.id}`
    const response = {...ulrikDetails, errors: ""} // yield call(callApiWithAuth, 'get', API_ENDPOINT, path)
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

function* handleUpdate() {
  try {
    const form = (yield select<any>((s) => s.form.profile.values)) as IUpdateRequest
    const req = (yield select<IApplicationState>((s) => s.profile.request)) as IFetchRequest
    const response = yield call(callApiWithAuth, 'put', API_ENDPOINT, `/users/${req.id}`, form)
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
function* watchProfileFetch() {
  yield takeEvery(ProfileActionTypes.PROFILE_FETCH_REQUEST, handleFetch)
}

function* watchProfileUpdate() {
  yield takeEvery(ProfileActionTypes.PROFILE_UPDATE_REQUEST, handleUpdate)
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* saga() {
  yield all([fork(watchProfileFetch), fork(watchProfileUpdate)])
}
//#endregion

export { 
    fetchRequest,
    fetchError,
    fetchSuccess,
    updateRequest,
    updateSuccess,
    updateError,
    reducer,
    saga,
    initialState
  }
