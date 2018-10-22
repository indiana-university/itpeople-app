import { Action, AnyAction, combineReducers, Dispatch } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { all, fork } from 'redux-saga/effects'

import * as Department from "../components/Department/store";
import * as Departments from "../components/Departments/store";
import * as Profile from '../components/Profile/store'
import * as SearchSimple from '../components/Search/store'
import * as Auth from '../components/SignIn/store'
import * as Unit from "../components/Unit/store";
import * as Units from "../components/Units/store";

// The top-level state object
export interface IApplicationState {
  auth: Auth.IState,
  profile: Profile.IState,
  searchSimple: SearchSimple.IState,
  unit: Unit.IState,
  units: Units.IState,
  department: Department.IState,
  departments: Departments.IState,
  form: any
}

export const initialState : IApplicationState = {
  auth: Auth.initialState,
  form: {},
  department: Department.initialState,
  departments: Departments.initialState,
  profile: Profile.initialState,
  searchSimple: SearchSimple.initialState,
  unit: Unit.initialState,
  units: Units.initialState,
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
  department: Department.reducer,
  departments: Departments.reducer,
  profile: Profile.reducer,
  searchSimple: SearchSimple.reducer,
  unit: Unit.reducer,
  units: Units.reducer
})

// Here we use `redux-saga` to trigger actions asynchronously. `redux-saga` uses something called a
// "generator function", which you can read about here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
export function* rootSaga() {
  yield all([
    fork(Auth.saga), 
    fork(Department.saga),
    fork(Departments.saga), 
    fork(Profile.saga), 
    fork(SearchSimple.saga), 
    fork(Unit.saga),
    fork(Units.saga),
  ])
}
