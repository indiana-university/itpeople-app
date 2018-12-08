import { call, put, take } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { ProfileActionTypes, saga as profileSaga } from './components/Profile/store'
import { IApiState, IApplicationState, IEntity } from "./components/types";
import { Reducer } from 'redux';
import 'whatwg-fetch'

it('just works!', () => {
  const reducer: Reducer = (state, action) => {
    return {
      profile: {
        request: { id: 1 }
      }
    }
  }
  return expectSaga(profileSaga)
    .withReducer(reducer)
    .put.actionType(
      ProfileActionTypes.PROFILE_FETCH_SUCCESS
    )
    .dispatch({ type: ProfileActionTypes.PROFILE_FETCH_REQUEST, payload: { id: 1 } })
    .run()
})