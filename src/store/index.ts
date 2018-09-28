import { Action, AnyAction, combineReducers, Dispatch } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { all, fork } from 'redux-saga/effects'

import * as Auth from './auth'
import * as Profile from './profile'
import * as SearchSimple from './searchSimple'

// The top-level state object
export interface IApplicationState {
  auth: Auth.IState,
  profile: Profile.IState,
  searchSimple: SearchSimple.IState
  form: any
}

export const initialState : IApplicationState = {
  auth: Auth.initialState,
  form: {},
  profile: Profile.initialState,
  searchSimple: SearchSimple.initialState
}

// Additional props for connected React components. This prop is passed by default with `connect()`
export interface IConnectedReduxProps<A extends Action = AnyAction> {
  dispatch: Dispatch<A>
}

// Whenever an action is dispatched, Redux will update each top-level application state property
// using the reducer with the matching name. It's important that the names match exactly, and that
// the reducer acts on the corresponding ApplicationState property type.
export const rootReducer = combineReducers<IApplicationState>({
  auth: Auth.reducer,
  form: formReducer,
  profile: Profile.reducer,
  searchSimple: SearchSimple.reducer
})

// Here we use `redux-saga` to trigger actions asynchronously. `redux-saga` uses something called a
// "generator function", which you can read about here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
export function* rootSaga() {
  yield all([fork(Auth.saga), fork(Profile.saga)])
}
