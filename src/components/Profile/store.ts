/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

//#region TYPES
import { IApiState, IApplicationState, IEntity } from "../types";

export const enum ProfileActionTypes {
  PROFILE_FETCH_REQUEST = "@@profile/PROFILE_FETCH_REQUEST",
  PROFILE_FETCH_SUCCESS = "@@profile/PROFILE_FETCH_SUCCESS",
  PROFILE_FETCH_ERROR = "@@profile/PROFILE_FETCH_ERROR",
  PROFILE_UPDATE_REQUEST = "@@profile/PROFILE_UPDATE_REQUEST",
  PROFILE_UPDATE_SUCCESS = "@@profile/PROFILE_UPDATE_SUCCESS",
  PROFILE_UPDATE_ERROR = "@@profile/PROFILE_UPDATE_ERROR",
  PROFILE_TOGGLE_UNIT = "PROFILE_TOGGLE_UNIT"
}

export interface IUserRequest {
  id: number;
}

export interface IUser extends IEntity {
  netId: string;
  position: string;
  location: string;
  campusPhone: string;
  campusEmail: string;
  campus: string;
  tools: string[];
  expertise: string[];
  responsibilities: string[];
  photoUrl?: string;
}

export interface IUnitMembership {
  id: number;
  personId: number;
  unitId: number;
  person?: IUser;
  unit?: IUnit;
  tools?: string[];
  title?: string;
  role?: string;
}

export interface IUserProfile extends IUser {
  unitMemberships: IUnitMembership[];
  visuallyExpandedUnits?: number[];
  department: IEntity;
}

export interface IState extends IApiState<IUserRequest, IUserProfile> {}
//#endregion

//#region ACTIONS
import { action } from "typesafe-actions";
export const fetchRequest = (request: IUserRequest) =>
  action(ProfileActionTypes.PROFILE_FETCH_REQUEST, request);
export const fetchSuccess = (data: IUserProfile) =>
  action(ProfileActionTypes.PROFILE_FETCH_SUCCESS, data);
export const fetchError = (error: string) =>
  action(ProfileActionTypes.PROFILE_FETCH_ERROR, error);
export const updateRequest = (request: IUserRequest) =>
  action(ProfileActionTypes.PROFILE_UPDATE_REQUEST, request);
export const updateSuccess = (data: IUserProfile) =>
  action(ProfileActionTypes.PROFILE_UPDATE_SUCCESS, data);
export const updateError = (error: string) =>
  action(ProfileActionTypes.PROFILE_UPDATE_ERROR, error);
export const toggleUnit = (id: number) =>
  action(ProfileActionTypes.PROFILE_TOGGLE_UNIT, id);
//#endregion

//#region REDUCER
import { Reducer } from "redux";
import { TaskErrorReducer, TaskStartReducer, TaskSuccessReducer } from "../types";

// Type-safe initialState!
export const initialState: IState = {
  data: undefined,
  error: undefined,
  loading: false,
  request: undefined
};

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
export const reducer: Reducer<IState> = (state = initialState, act) => {
  switch (act.type) {
    case ProfileActionTypes.PROFILE_FETCH_REQUEST: return TaskStartReducer(state, act);
    case ProfileActionTypes.PROFILE_FETCH_SUCCESS: return TaskSuccessReducer(state, act);
    case ProfileActionTypes.PROFILE_FETCH_ERROR: return TaskErrorReducer(state, act);
    case ProfileActionTypes.PROFILE_UPDATE_REQUEST: return TaskStartReducer(state, act);
    case ProfileActionTypes.PROFILE_UPDATE_SUCCESS: return TaskSuccessReducer(state, act);
    case ProfileActionTypes.PROFILE_UPDATE_ERROR: return TaskErrorReducer(state, act);
    case ProfileActionTypes.PROFILE_TOGGLE_UNIT:
      if (
        state &&
        state.data &&
        state.data.unitMemberships &&
        state.data.unitMemberships.length > 0
      ) {
        const toggledId = act.payload;
        let expandedUnits = state.data.visuallyExpandedUnits || [];
        if (expandedUnits.indexOf(toggledId) == -1) {
          expandedUnits.push(toggledId);
        } else {
          expandedUnits = expandedUnits.filter(id => id != toggledId);
        }
        return {
          ...state,
          data: { ...state.data, visuallyExpandedUnits: expandedUnits }
        };
      }
    default:
      return state;
  }
};
//#endregion

//#region SAGAS
import { all, fork, select, takeEvery } from "redux-saga/effects";
import { httpGet, httpPut, apiFn, callApiWithAuth } from "../effects";
import { IUnit } from "../Unit";

function* handleFetch() {
  const state = (yield select<IApplicationState>(
    s => s.profile.request
  )) as IUserRequest;
  const path = state.id === 0 ? "/me" : `/people/${state.id}`;
  yield httpGet<IUserProfile>(callApiWithAuth, path, fetchSuccess, fetchError);
}

function* handleUpdate(api: apiFn) {
  const form = (yield select<any>(s => s.form.profile.values)) as IUser;
  const req = (yield select<IApplicationState>(
    s => s.profile.request
  )) as IUserRequest;
  const path = `/people/${req.id}`;
  yield httpPut<IUser, IUserProfile>(api, path, form, fetchSuccess, fetchError);
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchProfileFetch() {
  yield takeEvery(ProfileActionTypes.PROFILE_FETCH_REQUEST, handleFetch);
}

function* watchProfileUpdate() {
  yield takeEvery(ProfileActionTypes.PROFILE_UPDATE_REQUEST, () => handleUpdate(callApiWithAuth));
}

// We can also use `fork()` here to split our saga into multiple watchers.
export function* saga() {
  yield all([fork(watchProfileFetch), fork(watchProfileUpdate)]);
}
//#endregion
