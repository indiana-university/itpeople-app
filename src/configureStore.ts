import { connectRouter, routerMiddleware } from 'connected-react-router'
import { History } from 'history'
import { applyMiddleware, createStore, Store  } from 'redux'
// We'll be using Redux Devtools. We can use the `composeWithDevTools()`
// directive so we can pass our middleware along with it
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'

// Import the state interface and our combined reducers/sagas.
import { loggerMiddleware } from './logger'
import { IApplicationState, initialState, rootReducer, rootSaga } from './store'

// Attempt to load persisted state from session storage.
// Otherwise, return the default initial state.
const loadState = () : IApplicationState  => {
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

export default function configureStore( history: History ): Store<IApplicationState> {
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
