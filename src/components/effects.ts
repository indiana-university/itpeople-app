import { NotAuthorizedError } from "./errors";
import { signInRequest } from "./SignIn/store";

/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

const clearApplicationData = () => localStorage.clear();

const getAuthToken = () => localStorage.getItem("authToken");

const setAuthToken = (token: string) =>
  localStorage.setItem("authToken", token);


const redirectToLogin = () =>
  window.location.assign(
    `${process.env.REACT_APP_OAUTH2_AUTH_URL}?response_type=code&client_id=${
      process.env.REACT_APP_OAUTH2_CLIENT_ID
    }&redirect_uri=${process.env.REACT_APP_WEB_URL}/signin`
  );

const apiEndpoints = {
  departments: {
    root: (id?: number) => (id ? `/departments/${id}` : "/departments"),
    members: (deptId: number) => `/departments/${deptId}/members`,
    memberUnits: (deptId: number) => `/departments/${deptId}/memberUnits`,
    supportingUnits: (deptId: number) => `/departments/${deptId}/supportingUnits`,
    search: (term: string) => `/departments?q=${term}`
  },
  units: {
    root: (id?: number) => (id ? `/units/${id}` : "/units"),
    members: (unitId: number) => `/units/${unitId}/members`,
    children: (unitId: number) => `/units/${unitId}/children`,
    supportedDepartments: (unitId: number) => `/units/${unitId}/supportedDepartments`,
    tools: (unitId:number) => `/units/${unitId}/tools`,
    search: (term: string) => `/units?q=${term}`
  },
  people: {
    root: (id?: number) => (id ? `/people/${id}` : "/people"),
    memberships: (id: number) => `/people/${id}/memberships`,
    search: (term: string) => `/people?q=${term}`
  },
  memberships: (id?: number) => (id ? `/memberships/${id}` : "/memberships"),
  memberTools: (id?: number) => (id ? `/memberTools/${id}` : "/memberTools"),
  supportRelationships: (id?: number) => (id ? `/supportRelationships/${id}` : "/supportRelationships")
};
/**
 * Handle a request that results in an exception.
 *
 * @param {*} err The error object
 * @param {(r:string) => PayloadMetaAction<string,string,any>} error A request failure action generator
 */
function signinIfUnauthorized(err: Error) {
  if (err instanceof NotAuthorizedError) {
    return signInRequest();
  }
  throw err;
}

export {
  apiEndpoints,
  clearApplicationData,
  getAuthToken,
  setAuthToken,
  redirectToLogin,
  signinIfUnauthorized
};
