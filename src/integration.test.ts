import { call, put, take } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { ProfileActionTypes, saga as profileSaga } from './components/Profile/store'
import { IApiState, IApplicationState, IEntity } from "./components/types";
import { Reducer } from 'redux';

// function* userSaga(api) {
//   const action = yield take('REQUEST_USER')
//   const user = yield call(api.fetchUser, action.payload)

//   yield put({ type: 'RECEIVE_USER', payload: user })
// }

it('just works!', () => {
  // const api = {
  //   fetchUser: id => ({ id, name: 'Tucker' }),
  // }

  const reducer:Reducer = (state, action) => {
    return {
      profile: {
        request: { id: 1 }
      }
    }
  }

  return expectSaga(profileSaga)
    .withReducer(reducer)
    // Assert that the `put` will eventually happen.
    .put({
      type: 'RECEIVE_USER',
      payload: { id: 42, name: 'Tucker' },
    })

    // Dispatch any actions that the saga will `take`.
    .dispatch({ type: ProfileActionTypes.PROFILE_FETCH_REQUEST, payload: { id: 1 } })

    // Start the test. Returns a Promise.
    .run()
})