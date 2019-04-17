/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {
  IApiState,
  IEntity,
  ViewStateType,
  IEntityRequest,
  IUnit,
  IUnitMember,
  ISupportRelationship,
  IUnitMemberRequest,
  ISupportRelationshipRequest,
  defaultState,
  IUnitMemberTool,
  ITool
} from "../types";
import { lookup } from "../lookup";

//#region TYPES
export const enum UnitActionTypes {
  UNIT_FETCH_REQUEST = "@@unit/FETCH_REQUEST",
  UNIT_FETCH_PROFILE_REQUEST = "@@unit/FETCH_PROFILE_REQUEST",
  UNIT_FETCH_PROFILE_SUCCESS = "@@unit/FETCH_PROFILE_SUCCESS",
  UNIT_FETCH_PROFILE_ERROR = "@@unit/FETCH_PROFILE_ERROR",
  UNIT_FETCH_MEMBERS_REQUEST = "@@unit/FETCH_MEMBERS_REQUEST",
  UNIT_FETCH_MEMBERS_SUCCESS = "@@unit/FETCH_MEMBERS_SUCCESS",
  UNIT_FETCH_MEMBERS_ERROR = "@@unit/FETCH_MEMBERS_ERROR",
  // UNIT_FETCH_MEMBER_TOOLS_REQUEST = "@@unit/FETCH_MEMBER_TOOLS_REQUEST",
  // UNIT_FETCH_MEMBER_TOOLS_SUCCESS = "@@unit/FETCH_MEMBER_TOOLS_SUCCESS",
  // UNIT_FETCH_MEMBER_TOOLS_ERROR = "@@unit/FETCH_MEMBER_TOOLS_ERROR",
  UNIT_FETCH_CHILDREN_REQUEST = "@@unit/FETCH_CHILDREN_REQUEST",
  UNIT_FETCH_CHILDREN_SUCCESS = "@@unit/FETCH_CHILDREN_SUCCESS",
  UNIT_FETCH_CHILDREN_ERROR = "@@unit/FETCH_CHILDREN_ERROR",
  UNIT_FETCH_PARENT_REQUEST = "@@unit/FETCH_PARENT_REQUEST",
  UNIT_FETCH_PARENT_SUCCESS = "@@unit/FETCH_PARENT_SUCCESS",
  UNIT_FETCH_PARENT_ERROR = "@@unit/FETCH_PARENT_ERROR",
  UNIT_FETCH_DEPARTMENTS_REQUEST = "@@unit/FETCH_DEPARTMENTS_REQUEST",
  UNIT_FETCH_DEPARTMENTS_SUCCESS = "@@unit/FETCH_DEPARTMENTS_SUCCESS",
  UNIT_FETCH_DEPARTMENTS_ERROR = "@@unit/FETCH_DEPARTMENTS_ERROR",
  UNIT_FETCH_TOOLS_REQUEST = "@@unit/FETCH_TOOLS_REQUEST",
  UNIT_FETCH_TOOLS_SUCCESS = "@@unit/FETCH_TOOLS_SUCCESS",
  UNIT_FETCH_TOOLS_ERROR = "@@unit/FETCH_TOOLS_ERROR",
  UNIT_EDIT = "@@unit/UNIT_EDIT",
  UNIT_SAVE_PROFILE_REQUEST = "@@unit/SAVE_PROFILE_REQUEST",
  UNIT_SAVE_PROFILE_SUCCESS = "@@unit/SAVE_PROFILE_SUCCESS",
  UNIT_SAVE_PROFILE_ERROR = "@@unit/SAVE_PROFILE_ERROR",
  UNIT_SAVE_MEMBER_REQUEST = "@@unit/SAVE_MEMBER_REQUEST",
  UNIT_SAVE_MEMBER_SUCCESS = "@@unit/SAVE_MEMBER_SUCCESS",
  UNIT_SAVE_MEMBER_ERROR = "@@unit/SAVE_MEMBER_ERROR",
  UNIT_DELETE_MEMBER_REQUEST = "@@unit/UNIT_DELETE_MEMBER_REQUEST",
  UNIT_DELETE_MEMBER_SUCCESS = "@@unit/UNIT_DELETE_MEMBER_SUCCESS",
  UNIT_DELETE_MEMBER_ERROR = "@@unit/UNIT_DELETE_MEMBER_ERROR",
  UNIT_SAVE_MEMBER_TOOLS_REQUEST = "@@unit/SAVE_MEMBER_TOOLS_REQUEST",
  UNIT_SAVE_MEMBER_TOOLS_ERROR = "@@unit/SAVE_MEMBER_TOOLS_ERROR",
  UNIT_SAVE_CHILD_REQUEST = "@@unit/SAVE_CHILD_REQUEST",
  UNIT_SAVE_CHILD_SUCCESS = "@@unit/SAVE_CHILD_SUCCESS",
  UNIT_SAVE_CHILD_ERROR = "@@unit/SAVE_CHILD_ERROR",
  UNIT_DELETE_CHILD_REQUEST = "@@unit/DELETE_CHILD_REQUEST",
  UNIT_DELETE_CHILD_SUCCESS = "@@unit/DELETE_CHILD_SUCCESS",
  UNIT_DELETE_CHILD_ERROR = "@@unit/DELETE_CHILD_ERROR",
  UNIT_SAVE_PARENT_REQUEST = "@@unit/SAVE_PARENT_REQUEST",
  UNIT_SAVE_PARENT_SUCCESS = "@@unit/SAVE_PARENT_SUCCESS",
  UNIT_SAVE_PARENT_ERROR = "@@unit/SAVE_PARENT_ERROR",
  UNIT_DELETE_PARENT_REQUEST = "@@unit/DELETE_PARENT_REQUEST",
  UNIT_DELETE_PARENT_SUCCESS = "@@unit/DELETE_PARENT_SUCCESS",
  UNIT_DELETE_PARENT_ERROR = "@@unit/DELETE_PARENT_ERROR",
  UNIT_SAVE_DEPARTMENT_REQUEST = "@@unit/SAVE_DEPARTMENT_REQUEST",
  UNIT_SAVE_DEPARTMENT_SUCCESS = "@@unit/SAVE_DEPARTMENT_SUCCESS",
  UNIT_SAVE_DEPARTMENT_ERROR = "@@unit/SAVE_DEPARTMENT_ERROR",
  UNIT_DELETE_DEPARTMENT_REQUEST = "@@unit/DELETE_DEPARTMENT_REQUEST",
  UNIT_DELETE_DEPARTMENT_SUCCESS = "@@unit/DELETE_DEPARTMENT_SUCCESS",
  UNIT_DELETE_DEPARTMENT_ERROR = "@@unit/DELETE_DEPARTMENT_ERROR",
  UNIT_CANCEL = "@@unit/UNIT_CANCEL",
  UNIT_DELETE_REQUEST = "@@unit/DELETE_REQUEST",
  UNIT_DELETE_ERROR = "@@unit/DELETE_ERROR"
}

export interface IState {
  profile: IApiState<IEntityRequest, IUnit>;
  members: IApiState<IEntityRequest, IUnitMember[]>;
  tools: IApiState<IEntityRequest, ITool[]>;
  unitChildren: IApiState<IEntityRequest, IEntity[]>; // children conflicts with react props 😟
  parent: IApiState<IEntityRequest, IEntity>;
  departments: IApiState<IEntityRequest, ISupportRelationship[]>;
  view: ViewStateType;
}
//#endregion

//#region ACTIONS
import { action } from "typesafe-actions";

const lookupLimit = 15;
const cancel = () => action(UnitActionTypes.UNIT_CANCEL, {});
const deleteMemberRequest = (member: IUnitMember) => action(UnitActionTypes.UNIT_DELETE_MEMBER_REQUEST, member);
const deleteUnit = (unit: IUnit) => action(UnitActionTypes.UNIT_DELETE_REQUEST, unit);
const deleteUnitChild = (request: IEntityRequest) => action(UnitActionTypes.UNIT_DELETE_CHILD_REQUEST, request);
const deleteUnitDepartment = (request: ISupportRelationshipRequest) => action(UnitActionTypes.UNIT_DELETE_DEPARTMENT_REQUEST, request);
const deleteUnitParent = (request: IEntityRequest) => action(UnitActionTypes.UNIT_DELETE_PARENT_REQUEST, request);
const edit = () => action(UnitActionTypes.UNIT_EDIT, {});
const fetchUnit = (request: IEntityRequest) => action(UnitActionTypes.UNIT_FETCH_REQUEST, request);
const lookupDepartment = (q: string) => lookup(q ? `/departments?q=${q}&_limit=${lookupLimit}` : "");
const lookupUnit = (q: string) => lookup(q ? `/units?q=${q}&_limit=${lookupLimit}` : "");
const lookupUser = (q: string) => lookup(q ? `/people?q=${q}&_limit=${lookupLimit}` : "");
const saveMemberRequest = (member: IUnitMemberRequest) => action(UnitActionTypes.UNIT_SAVE_MEMBER_REQUEST, member);
const saveUnitChild = (request: IEntityRequest) => action(UnitActionTypes.UNIT_SAVE_CHILD_REQUEST, request);
const saveUnitDepartment = (request: ISupportRelationshipRequest) => action(UnitActionTypes.UNIT_SAVE_DEPARTMENT_REQUEST, request);
const saveUnitParent = (request: IEntityRequest) => action(UnitActionTypes.UNIT_SAVE_PARENT_REQUEST, request);
const saveUnitProfileRequest = (request: IUnit) => action(UnitActionTypes.UNIT_SAVE_PROFILE_REQUEST, request);
const saveMemberTools = (member: IUnitMember, tools: number[]) => action(UnitActionTypes.UNIT_SAVE_MEMBER_TOOLS_REQUEST, { member, tools });
//#endregion

//#region REDUCER
import { Reducer, AnyAction } from "redux";
import { TaskErrorReducer, TaskStartReducer, TaskSuccessReducer } from "../types";

// Type-safe initialState!
const initialState: IState = {
  profile: defaultState(),
  members: defaultState(),
  tools: defaultState(),
  unitChildren: defaultState(),
  parent: defaultState(),
  departments: defaultState(),
  view: ViewStateType.Viewing
};

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
// state.unit.profile.data
// state.unit.members.data
// state.unit.departments.data
// state.unit.children.data
// state.unit.parent.data
const reducer: Reducer<IState> = (state = initialState, act) => {
  switch (act.type) {
    case UnitActionTypes.UNIT_EDIT:
      return { ...state, view: ViewStateType.Editing };
    case UnitActionTypes.UNIT_CANCEL:
      return { ...state, view: ViewStateType.Viewing };
    //
    case UnitActionTypes.UNIT_FETCH_PROFILE_REQUEST:
      return { ...state, profile: TaskStartReducer(state.profile, act), parent: defaultState() };
    case UnitActionTypes.UNIT_FETCH_PROFILE_SUCCESS:
      return { ...state, profile: TaskSuccessReducer(state.profile, act) };
    case UnitActionTypes.UNIT_FETCH_PROFILE_ERROR:
      return { ...state, profile: TaskErrorReducer(state.profile, act) };
    case UnitActionTypes.UNIT_SAVE_PROFILE_REQUEST:
      return { ...state, profile: TaskStartReducer(state.profile, act) };
    case UnitActionTypes.UNIT_SAVE_PROFILE_SUCCESS:
      return { ...state, profile: TaskSuccessReducer(state.profile, act) };
    case UnitActionTypes.UNIT_SAVE_PROFILE_ERROR:
      return { ...state, profile: TaskErrorReducer(state.profile, act) };
    case UnitActionTypes.UNIT_DELETE_REQUEST:
      return { ...state, profile: TaskStartReducer(state.profile, act) };
    case UnitActionTypes.UNIT_DELETE_ERROR:
      return { ...state, profile: TaskErrorReducer(state.profile, act) };
    //
    case UnitActionTypes.UNIT_FETCH_MEMBERS_REQUEST:
      return { ...state, members: TaskStartReducer(state.members, act) };
    case UnitActionTypes.UNIT_FETCH_MEMBERS_SUCCESS:
      return { ...state, members: TaskSuccessReducer(state.members, act) };
    case UnitActionTypes.UNIT_FETCH_MEMBERS_ERROR:
      return { ...state, members: TaskErrorReducer(state.members, act) };
    case UnitActionTypes.UNIT_SAVE_MEMBER_REQUEST:
      return { ...state, members: TaskStartReducer(state.members, act) };
    case UnitActionTypes.UNIT_SAVE_MEMBER_ERROR:
      return { ...state, members: TaskErrorReducer(state.members, act) };
    case UnitActionTypes.UNIT_DELETE_MEMBER_REQUEST:
      return { ...state, members: TaskStartReducer(state.members, act) };
    case UnitActionTypes.UNIT_DELETE_MEMBER_ERROR:
      return { ...state, members: TaskErrorReducer(state.members, act) };
    //
    case UnitActionTypes.UNIT_FETCH_TOOLS_REQUEST:
      return { ...state, tools: TaskStartReducer(state.tools, act) };
    case UnitActionTypes.UNIT_FETCH_TOOLS_SUCCESS:
      return { ...state, tools: TaskSuccessReducer(state.tools, act) };
    case UnitActionTypes.UNIT_FETCH_TOOLS_ERROR:
      return { ...state, tools: TaskErrorReducer(state.tools, act) };
    // case UnitActionTypes.UNIT_FETCH_MEMBER_TOOLS_REQUEST: return { ...state, members: TaskStartReducer(state.members, act) };
    // case UnitActionTypes.UNIT_FETCH_MEMBER_TOOLS_SUCCESS: return { ...state, members: TaskSuccessReducer(state.members, act) };
    // case UnitActionTypes.UNIT_FETCH_MEMBER_TOOLS_ERROR: return { ...state, members: TaskErrorReducer(state.members, act) };
    // case UnitActionTypes.UNIT_SAVE_MEMBER_TOOLS_REQUEST: return { ...state };
    // case UnitActionTypes.UNIT_SAVE_MEMBER_TOOLS_ERROR: return { ...state, members: TaskErrorReducer(state.members, act) };
    // case UnitActionTypes.UNIT_DELETE_MEMBER_TOOLS_REQUEST: return { ...state, members: TaskStartReducer(state.members, act) };
    // case UnitActionTypes.UNIT_DELETE_MEMBER_TOOLS_ERROR: return { ...state, members: TaskErrorReducer(state.members, act) };
    //
    case UnitActionTypes.UNIT_FETCH_CHILDREN_REQUEST:
      return { ...state, unitChildren: TaskStartReducer(state.unitChildren, act) };
    case UnitActionTypes.UNIT_FETCH_CHILDREN_SUCCESS:
      return { ...state, unitChildren: TaskSuccessReducer(state.unitChildren, act) };
    case UnitActionTypes.UNIT_FETCH_CHILDREN_ERROR:
      return { ...state, unitChildren: TaskErrorReducer(state.unitChildren, act) };
    case UnitActionTypes.UNIT_SAVE_CHILD_REQUEST:
      return { ...state, unitChildren: TaskStartReducer(state.unitChildren, act) };
    case UnitActionTypes.UNIT_SAVE_CHILD_SUCCESS:
      return { ...state, unitChildren: TaskSuccessReducer(state.unitChildren, act) };
    case UnitActionTypes.UNIT_SAVE_CHILD_ERROR:
      return { ...state, unitChildren: TaskErrorReducer(state.unitChildren, act) };
    //
    case UnitActionTypes.UNIT_FETCH_PARENT_REQUEST:
      return { ...state, parent: TaskStartReducer(state.parent, act) };
    case UnitActionTypes.UNIT_FETCH_PARENT_SUCCESS:
      return { ...state, parent: TaskSuccessReducer(state.parent, act) };
    case UnitActionTypes.UNIT_FETCH_PARENT_ERROR:
      return { ...state, parent: TaskErrorReducer(state.parent, act) };
    case UnitActionTypes.UNIT_SAVE_PARENT_REQUEST:
      return { ...state, parent: TaskStartReducer(state.parent, act) };
    case UnitActionTypes.UNIT_SAVE_PARENT_SUCCESS:
      return { ...state, parent: TaskSuccessReducer(state.parent, act) };
    case UnitActionTypes.UNIT_SAVE_PARENT_ERROR:
      return { ...state, parent: TaskErrorReducer(state.parent, act) };
    //
    case UnitActionTypes.UNIT_FETCH_DEPARTMENTS_REQUEST:
      return { ...state, departments: TaskStartReducer(state.departments, act) };
    case UnitActionTypes.UNIT_FETCH_DEPARTMENTS_SUCCESS:
      return { ...state, departments: TaskSuccessReducer(state.departments, act) };
    case UnitActionTypes.UNIT_FETCH_DEPARTMENTS_ERROR:
      return { ...state, departments: TaskErrorReducer(state.departments, act) };
    case UnitActionTypes.UNIT_SAVE_DEPARTMENT_REQUEST:
      return { ...state, departments: TaskStartReducer(state.departments, act) };
    case UnitActionTypes.UNIT_SAVE_DEPARTMENT_SUCCESS:
      return { ...state, departments: TaskSuccessReducer(state.departments, act) };
    case UnitActionTypes.UNIT_SAVE_DEPARTMENT_ERROR:
      return { ...state, departments: TaskErrorReducer(state.departments, act) };
    case UnitActionTypes.UNIT_DELETE_DEPARTMENT_SUCCESS:
      return { ...state, departments: TaskSuccessReducer(state.departments, act) };
    case UnitActionTypes.UNIT_DELETE_DEPARTMENT_ERROR:
      return { ...state, departments: TaskErrorReducer(state.departments, act) };

    default:
      return state;
  }
};
//#endregion

//#region SAGA
import { all, fork, takeEvery, put } from "redux-saga/effects";
import { apiEndpoints, signinIfUnauthorized } from "../effects";
import { IApi, IApiResponse, restApi } from "../api";
import { push } from "connected-react-router";

function* handleFetchUnit(api: IApi, request: IEntityRequest) {
  yield put(fetchUnitProfile(request));
  yield put(fetchUnitMembers(request));
  yield put(fetchUnitChildren(request));
  yield put(fetchUnitSupportedDepartments(request));
  yield put(fetchUnitTools(request));

  // TODO: fetch master tool list
}
function* handleFetchProfileSuccess(api: IApi, request: IEntityRequest) {
  yield put(fetchUnitParentRequest(request));
}

const fetchUnitProfile = (request: IEntityRequest) => action(UnitActionTypes.UNIT_FETCH_PROFILE_REQUEST, request);
const fetchUnitProfileSuccess = (response: IApiResponse<IUnit>) => action(UnitActionTypes.UNIT_FETCH_PROFILE_SUCCESS, response);
const fetchUnitProfileError = (error: Error) => action(UnitActionTypes.UNIT_FETCH_PROFILE_ERROR, error);
function* handleFetchUnitProfile(api: IApi, request: IEntityRequest) {
  const action = yield api
    .get<IUnit>(apiEndpoints.units.root(request.id))
    .then(fetchUnitProfileSuccess)
    .catch(signinIfUnauthorized)
    .catch(fetchUnitProfileError);
  yield put(action);
}

const fetchUnitMembers = (request: IEntityRequest) => action(UnitActionTypes.UNIT_FETCH_MEMBERS_REQUEST, request);
const fetchUnitMembersSuccess = (response: IApiResponse<IUnitMember[]>) => action(UnitActionTypes.UNIT_FETCH_MEMBERS_SUCCESS, response);
const fetchUnitMembersError = (error: Error) => action(UnitActionTypes.UNIT_DELETE_MEMBER_ERROR, error);
function* handleFetchUnitMembers(api: IApi, request: IEntityRequest) {
  const action = yield api
    .get<IUnitMember[]>(apiEndpoints.units.members(request.id))
    .then(fetchUnitMembersSuccess)
    .catch(signinIfUnauthorized)
    .catch(fetchUnitMembersError);
  yield put(action);
}

const fetchUnitChildren = (request: IEntityRequest) => action(UnitActionTypes.UNIT_FETCH_CHILDREN_REQUEST, request);
const fetchUnitChildrenSuccess = (response: IApiResponse<IEntityRequest[]>) =>
  action(UnitActionTypes.UNIT_FETCH_CHILDREN_SUCCESS, response);
const fetchUnitChildrenError = (error: Error) => action(UnitActionTypes.UNIT_FETCH_CHILDREN_ERROR, error);
function* handleFetchUnitChildren(api: IApi, request: IEntityRequest) {
  const action = yield api
    .get<IUnit[]>(apiEndpoints.units.children(request.id))
    .then(fetchUnitChildrenSuccess)
    .catch(signinIfUnauthorized)
    .catch(fetchUnitChildrenError);
  yield put(action);
}

const fetchUnitSupportedDepartments = (request: IEntityRequest) => action(UnitActionTypes.UNIT_FETCH_DEPARTMENTS_REQUEST, request);
const fetchUnitDepartmentsSuccess = (response: IApiResponse<ISupportRelationship[]>) =>
  action(UnitActionTypes.UNIT_FETCH_DEPARTMENTS_SUCCESS, response);
const fetchUnitDepartmentsError = (error: Error) => action(UnitActionTypes.UNIT_FETCH_DEPARTMENTS_ERROR, error);
function* handleFetchUnitDepartments(api: IApi, request: IEntityRequest) {
  const action = yield api
    .get<ISupportRelationship[]>(apiEndpoints.units.supportedDepartments(request.id))
    .then(fetchUnitDepartmentsSuccess)
    .catch(signinIfUnauthorized)
    .catch(fetchUnitDepartmentsError);
  yield put(action);
}

const fetchUnitParentRequest = (response: IEntityRequest) => action(UnitActionTypes.UNIT_FETCH_PARENT_REQUEST, response);
const fetchUnitParentSuccess = (response: IApiResponse<IUnit>) => action(UnitActionTypes.UNIT_FETCH_PARENT_SUCCESS, response);
const fetchUnitParentError = (error: Error) => action(UnitActionTypes.UNIT_FETCH_PARENT_ERROR, error);
function* handleFetchUnitParent(api: IApi, unit?: IUnit) {
  if (unit && unit.parentId) {
    const action = yield api
      .get<IUnit>(apiEndpoints.units.root(unit.parentId))
      .then(fetchUnitParentSuccess)
      .catch(signinIfUnauthorized)
      .catch(fetchUnitParentError);
    yield put(action);
  } else {
    yield put(fetchUnitParentSuccess({ data: undefined, url: "", permissions: [] }));
  }
}

const fetchUnitTools = (response: IEntityRequest) => action(UnitActionTypes.UNIT_FETCH_TOOLS_REQUEST, response);
const fetchUnitToolsSuccess = (response: IApiResponse<ITool[]>) => action(UnitActionTypes.UNIT_FETCH_TOOLS_SUCCESS, response);
const fetchUnitToolsError = (error: Error) => action(UnitActionTypes.UNIT_FETCH_TOOLS_ERROR, error);
function* handleFetchUnitTools(api: IApi, request: IEntityRequest) {
  const action = yield api
    .get<ITool[]>(apiEndpoints.units.tools(request.id))
    .then(fetchUnitToolsSuccess)
    .catch(signinIfUnauthorized)
    .catch(fetchUnitToolsError);
  yield put(action);
}

/* 
GET/POST/PUT/DELETE /units/{unit_id}
GET/POST/PUT/DELETE /units/{unit_id}/members/{membership_id} = {personId:null, title:"...", role:"..."}
GET/POST/DELETE /units/{unit_id}/children/{child_unit_id}
GET/POST/DELETE /units/{unit_id}/parent/{parent_unit_id}
GET/POST/DELETE /units/{unit_id}/supported_departments/{department_id}
*/

const saveUnitError = (error: Error) => action(UnitActionTypes.UNIT_SAVE_PROFILE_ERROR, error);
function* handleSaveUnit(api: IApi, unit: IUnit) {
  const request = unit.id != 0 ? api.put(apiEndpoints.units.root(unit.id), unit) : api.post(apiEndpoints.units.root(), unit);
  const action = yield request
    .then(_ => fetchUnit({ id: unit.id }))
    .catch(signinIfUnauthorized)
    .catch(saveUnitError);
  yield put(action);
}

const deleteUnitError = (error: Error) => action(UnitActionTypes.UNIT_DELETE_ERROR, error);
function* handleDeleteUnit(api: IApi, unit: IUnit) {
  const request = api.delete(apiEndpoints.units.root(unit.id));
  const action = yield request
    .then(_ => push(apiEndpoints.units.root()))
    .catch(signinIfUnauthorized)
    .catch(deleteUnitError);
  yield put(action);
}

const saveMemberError = (error: Error) => action(UnitActionTypes.UNIT_SAVE_MEMBER_ERROR, error);
function* handleSaveMember(api: IApi, member: IUnitMemberRequest) {
  const request = member.id
    ? api.put(apiEndpoints.memberships(member.id), member)
    : api.post(apiEndpoints.memberships(member.id), member);
  const action = yield request
    .then(_ => fetchUnitMembers({ id: member.unitId }))
    .catch(signinIfUnauthorized)
    .catch(saveMemberError);
  yield put(action);
}

const deleteMemberError = (error: Error) => action(UnitActionTypes.UNIT_DELETE_MEMBER_ERROR, error);
function* handleDeleteMember(api: IApi, member: IUnitMember) {
  const action = yield api
    .delete(apiEndpoints.memberships(member.id))
    .then(_ => fetchUnitMembers({ id: member.unitId }))
    .catch(signinIfUnauthorized)
    .catch(deleteMemberError);
  yield put(action);
}

const addChildError = (error: Error) => action(UnitActionTypes.UNIT_SAVE_CHILD_ERROR, error);
function* handleAddChild(api: IApi, child: IUnit) {
  const action = yield api
    .put<IUnit>(apiEndpoints.units.root(child.id), child)
    .then(_ => fetchUnitChildren({ id: child.parentId as number }))
    .catch(signinIfUnauthorized)
    .catch(addChildError);
  yield put(action);
}

const deleteChildError = (error: Error) => action(UnitActionTypes.UNIT_DELETE_CHILD_ERROR, error);
function* handleRemoveChild(api: IApi, child: IUnit) {
  if (!child.parentId) return;

  const parentId = child.parentId;
  child.parentId = undefined;

  const action = yield api
    .put<IUnit>(apiEndpoints.units.root(child.id), child)
    .then(_ => fetchUnitChildren({ id: parentId }))
    .catch(signinIfUnauthorized)
    .catch(deleteChildError);
  yield put(action);
}

const saveSupportRelationshipError = (error: Error) => action(UnitActionTypes.UNIT_SAVE_DEPARTMENT_ERROR, error);
function* handleSaveSupportRelationship(api: IApi, supportRelationship: ISupportRelationshipRequest) {
  const action = yield api
    .post<ISupportRelationshipRequest>(apiEndpoints.supportRelationships(), supportRelationship)
    .then(() => fetchUnitSupportedDepartments({ id: supportRelationship.unitId }))
    .catch(signinIfUnauthorized)
    .catch(saveSupportRelationshipError);
  yield put(action);
}

const deleteSupportRelationshipError = (error: Error) => action(UnitActionTypes.UNIT_DELETE_DEPARTMENT_ERROR, error);
function* handleDeleteSupportRelationship(api: IApi, supportRelationship: ISupportRelationshipRequest) {
  const action = yield api
    .delete(apiEndpoints.supportRelationships(supportRelationship.id))
    .then(_ => fetchUnitSupportedDepartments({ id: supportRelationship.unitId }))
    .catch(signinIfUnauthorized)
    .catch(deleteSupportRelationshipError);
  yield put(action);
}

type SaveMemberToolsRequest = {member:IUnitMember, tools:number[]}
const saveMemberToolsError = (error: Error) => action(UnitActionTypes.UNIT_SAVE_MEMBER_TOOLS_ERROR, error);
function* handleSaveMemberTools(api: IApi, {member, tools}: SaveMemberToolsRequest) {
  // Find all the tools to add
  const oldToolIds = new Set(member.memberTools.map(tool => tool.id));
  const addPromises : Promise<any>[] = 
    tools
      .filter(id => !oldToolIds.has(id))
      .map(id => ({id: 0, membershipId: member.id||0, toolId: id}))
      .map(body => api.post<IUnitMemberTool>(apiEndpoints.memberTools(), body)); // /memberTools/
  // Find all the tools to delete
  const newToolIds = new Set(tools)
  const deletePromises : Promise<any>[]= 
    member.memberTools
      .filter(tool => !newToolIds.has(tool.id))
      .map(tool => api.delete(apiEndpoints.memberTools(tool.id))); // /memberTools/
  // Merge all the posts/deletes as a single promise
  const action = yield Promise.all(addPromises.concat(deletePromises))
      .then(_ => fetchUnitMembers({ id: member.unitId }))
      .catch(signinIfUnauthorized)
      .catch(saveMemberToolsError);
  yield put(action);
}

const api = restApi();

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchUnitFetch() {
  yield takeEvery(UnitActionTypes.UNIT_FETCH_REQUEST, (a: AnyAction) => handleFetchUnit(api, a.payload));
  yield takeEvery(UnitActionTypes.UNIT_FETCH_PROFILE_REQUEST, (a: AnyAction) => handleFetchUnitProfile(api, a.payload));
  yield takeEvery(UnitActionTypes.UNIT_FETCH_MEMBERS_REQUEST, (a: AnyAction) => handleFetchUnitMembers(api, a.payload));
  yield takeEvery(UnitActionTypes.UNIT_FETCH_DEPARTMENTS_REQUEST, (a: AnyAction) => handleFetchUnitDepartments(api, a.payload));
  yield takeEvery(UnitActionTypes.UNIT_FETCH_CHILDREN_REQUEST, (a: AnyAction) => handleFetchUnitChildren(api, a.payload));
  yield takeEvery(UnitActionTypes.UNIT_FETCH_TOOLS_REQUEST, (a: AnyAction) => handleFetchUnitTools(api, a.payload));
  // The unit parent is defined by a parentId on the unit record, so we must await the unit record fetch.
  yield takeEvery(UnitActionTypes.UNIT_FETCH_PARENT_REQUEST, (a: AnyAction) => handleFetchUnitParent(api, a.payload));
  yield takeEvery(UnitActionTypes.UNIT_FETCH_PROFILE_SUCCESS, (a: AnyAction) => handleFetchProfileSuccess(api, a.payload.data));
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchUnitSave() {
  yield takeEvery(UnitActionTypes.UNIT_SAVE_PROFILE_REQUEST, (a: AnyAction) => handleSaveUnit(api, a.payload));
  yield takeEvery(UnitActionTypes.UNIT_SAVE_MEMBER_REQUEST, (a: AnyAction) => handleSaveMember(api, a.payload));
  yield takeEvery(UnitActionTypes.UNIT_SAVE_DEPARTMENT_REQUEST, (a: AnyAction) => handleSaveSupportRelationship(api, a.payload));
  yield takeEvery(UnitActionTypes.UNIT_SAVE_CHILD_REQUEST, (a: AnyAction) => handleAddChild(api, a.payload));
  yield takeEvery(UnitActionTypes.UNIT_SAVE_MEMBER_TOOLS_REQUEST, (a: AnyAction) => handleSaveMemberTools(api, a.payload));
}

function* watchUnitDelete() {
  yield takeEvery(UnitActionTypes.UNIT_DELETE_REQUEST, (a: AnyAction) => handleDeleteUnit(api, a.payload));
  yield takeEvery(UnitActionTypes.UNIT_DELETE_MEMBER_REQUEST, (a: AnyAction) => handleDeleteMember(api, a.payload));
  yield takeEvery(UnitActionTypes.UNIT_DELETE_DEPARTMENT_REQUEST, (a: AnyAction) => handleDeleteSupportRelationship(api, a.payload));
  yield takeEvery(UnitActionTypes.UNIT_DELETE_CHILD_REQUEST, (a: AnyAction) => handleRemoveChild(api, a.payload));
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* saga() {
  yield all([fork(watchUnitFetch), fork(watchUnitSave), fork(watchUnitDelete)]);
}
//#endregion

// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export {
  cancel,
  deleteMemberRequest,
  deleteUnit,
  deleteUnitChild,
  deleteUnitDepartment,
  deleteUnitParent,
  edit,
  fetchUnit,
  handleDeleteMember,
  handleDeleteSupportRelationship as handleDeleteDepartment,
  handleSaveMember,
  handleSaveSupportRelationship as handleSaveDepartment,
  handleSaveUnit,
  initialState,
  lookupDepartment,
  lookupUnit,
  lookupUser,
  reducer,
  saga,
  saveMemberRequest,
  saveMemberTools,
  saveUnitChild,
  saveUnitDepartment,
  saveUnitParent,
  saveUnitProfileRequest
};
