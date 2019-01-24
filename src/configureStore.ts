/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { connectRouter, routerMiddleware } from 'connected-react-router'
import { History } from 'history'
import { applyMiddleware, createStore, Store } from 'redux'
// We'll be using Redux Devtools. We can use the `composeWithDevTools()`
// directive so we can pass our middleware along with it
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'

// Import the state interface and our combined reducers/sagas.
import { loggerMiddleware } from './logger'


import { Action, AnyAction, combineReducers, Dispatch } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { all, fork } from 'redux-saga/effects'
import { IApplicationState } from 'src/components/types';

import * as Auth from './components/SignIn/store'
import * as Department from "./components/Department/store";
import * as Departments from "./components/Departments/store";
import * as Lookup from "./components/lookup";
import * as Modal from "./components/layout/Modal/store";
import * as Profile from './components/Profile/store'
import * as SearchSimple from './components/Search/store'
import * as Unit from "./components/Unit/store";
import * as Units from "./components/Units/store";
import { callApiWithAuth } from './components/effects';

export const initialState: IApplicationState = {
  auth: Auth.initialState,
  department: Department.initialState,
  departments: Departments.initialState,
  form: {},
  lookup: Lookup.initialState,
  modal: "",
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
  department: Department.reducer,
  departments: Departments.reducer,
  form: formReducer,
  lookup: Lookup.reducer,
  modal: Modal.reducer,
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
    fork(Lookup.saga),
    fork(Profile.saga),
    fork(SearchSimple.saga),
    fork(Unit.saga),
    fork(Units.saga),
  ])
}


// Attempt to load persisted state from session storage.
// Otherwise, return the default initial state.
const loadState = (): IApplicationState => {
  try {
    const serializedState = localStorage.getItem('state')
    if (serializedState) {
      console.log("Initializing state from session storage");
      return JSON.parse(serializedState)
    } else {
      console.log("Initializing state from defaults");
      return initialState
    }
  } catch (err) {
    console.log("Failed to load state from session storage", err);
    return initialState
  }
}

// Attempt to persist state to session storage.
const saveState = (state: IApplicationState) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('state', serializedState)
  } catch (err) {
    // Ignore write errors
  }
}

export default function configureStore(history: History): Store<IApplicationState> {
  // create the composing function for our middlewares
  const composeEnhancers = composeWithDevTools({})
  // create the redux-saga middleware
  const sagaMiddleware = createSagaMiddleware()

  // We'll create our store with the combined reducers/sagas, and the initial Redux state that
  // we'll be passing from our entry point.
  const store = createStore(
    connectRouter(history)(rootReducer),
    loadState(),
    composeEnhancers(applyMiddleware(routerMiddleware(history), sagaMiddleware, loggerMiddleware))
  )

  // Save the state on any changes
  store.subscribe(() => {
    saveState(store.getState())
  })

  // Don't forget to run the root saga, and return the store object.
  sagaMiddleware.run(rootSaga)
  return store
}
