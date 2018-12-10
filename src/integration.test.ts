import { call, put, take } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { ProfileActionTypes, saga as profileSaga } from './components/Profile/store'
import { IApiState, IApplicationState, IEntity } from "./components/types";
import { Reducer } from 'redux';
import 'whatwg-fetch'

it('fetches', () => {
  const reducer: Reducer = (state, action) => {
    return {
      profile: {
        request: { id: 1 }
      }
    }
  }
  return expectSaga(profileSaga)
    .withReducer(reducer)
    .dispatch({ type: ProfileActionTypes.PROFILE_FETCH_REQUEST, payload: { id: 1 } })
    .put.actionType(
      ProfileActionTypes.PROFILE_FETCH_SUCCESS
    )
    .run()
    .then((result) => {
      const { allEffects } = result;

      expect(allEffects[allEffects.length - 1]["PUT"]["action"]["payload"]).toMatchObject({"name": "Ron Swanson"})
      
    })
})
