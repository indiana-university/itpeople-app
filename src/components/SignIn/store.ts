/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

//#region TYPES
import { IApiState, IAuthRequest, IAuthUser, IAuthResult } from '../types'

export const enum AuthActionTypes {
    SIGN_IN_REQUEST = '@@auth/SIGN_IN',
    POST_SIGN_IN_REQUEST = '@@auth/POST_SIGN_IN',
    POST_SIGN_IN_SUCCESS = '@@auth/POST_SIGN_IN_SUCCESS',
    POST_SIGN_IN_ERROR = '@@auth/POST_SIGN_IN_ERROR',
    SIGN_OUT = '@@auth/SIGN_OUT',
}

// The name of the authorized user
export interface IState extends IApiState<IAuthRequest, IAuthUser> { }
//#endregion

//#region ACTIONS
import { action } from 'typesafe-actions'

const signInRequest = () => action(AuthActionTypes.SIGN_IN_REQUEST)
const postSignInRequest = (request: IAuthRequest) => action(AuthActionTypes.POST_SIGN_IN_REQUEST, request)
const postSignInSuccess = (data: IAuthUser) => action(AuthActionTypes.POST_SIGN_IN_SUCCESS, data)
const postSignInError = (message: string) => action(AuthActionTypes.POST_SIGN_IN_ERROR, message)
const signOutRequest = () => action(AuthActionTypes.SIGN_OUT)
//#endregion

//#region REDUCERS
import { Reducer, AnyAction } from 'redux'
import { TaskErrorReducer, TaskStartReducer, TaskSuccessReducer } from '../types'

// Type-safe initialState!
const initialState: IState = {
    data: undefined,
    error: undefined,
    loading: false,
    request: undefined
}

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
const reducer: Reducer<IState> = (state = initialState, act) => {
  switch (act.type) {
    case AuthActionTypes.SIGN_IN_REQUEST:
      return { ...state, 
        data: undefined,
        error: undefined,
        loading: false,
        request: undefined,
      }  
    case AuthActionTypes.POST_SIGN_IN_REQUEST: return TaskStartReducer(state, act)
    case AuthActionTypes.POST_SIGN_IN_SUCCESS: return TaskSuccessReducer(state, act)
    case AuthActionTypes.POST_SIGN_IN_ERROR: return TaskErrorReducer(state, act)
    case AuthActionTypes.SIGN_OUT:
      return { ...state, 
          data: undefined,
          error: undefined,
          loading: false,
          request: undefined,
      }
    default: return state
  }
}
//#endregion

//#region SAGAS
import * as JWT from 'jwt-decode'
import { push } from 'react-router-redux';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import { clearAuthToken, redirectToLogin, setAuthToken } from '../effects'
import { restApi, IApiResponse, IApi } from '../api';

const api = restApi()

function* handleSignIn(){
  yield call(clearAuthToken)
  yield call(redirectToLogin)
}


const handlePostSignInResponse = (resp: IApiResponse<IAuthResult>) => {
  const authUser = resp.data;
  if (!authUser || !authUser.access_token) {
    throw new Error("No access token");
  } else {
    return [
      call(setAuthToken, authUser.access_token),
      put(postSignInSuccess(JWT<IAuthUser>(authUser.access_token))),
      put(push(`/units`))
    ];
  }
}

const handlePostSignInError = (err: any) => [
  call(clearAuthToken),
  postSignInError(err)
]

function* handlePostSignIn(api: IApi, req: IAuthRequest) {
  const postSignInActions = yield api
    .get<IAuthResult>(`/auth?oauth_code=${req.code}`)
    .then(handlePostSignInResponse)
    .catch(handlePostSignInError);
  for (let action in postSignInActions){
    yield action
  }
}

function* handleSignOut() {
  yield call(clearAuthToken)
  yield put(push('/'))
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchSignIn() {
  yield takeEvery(AuthActionTypes.SIGN_IN_REQUEST, handleSignIn)
}

function* watchPostSignIn() {
  yield takeEvery(AuthActionTypes.POST_SIGN_IN_REQUEST, (a:AnyAction) => handlePostSignIn(api, a.payload))
}

function* watchSignOut() {
  yield takeEvery(AuthActionTypes.SIGN_OUT, handleSignOut)
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* saga() {
  yield all([fork(watchSignIn), fork(watchPostSignIn), fork(watchSignOut)])
}
//#endregion


export {
    postSignInRequest,
    postSignInSuccess,
    postSignInError,
    signInRequest,
    signOutRequest,
    reducer,
    initialState,
    saga
}
  