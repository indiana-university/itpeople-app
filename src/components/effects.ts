import { NotAuthorizedError } from "./errors";
import { signInRequest } from "./SignIn/store";

/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

const clearAuthToken = () => localStorage.removeItem("authToken");

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
    root: (id?: number) => id ? `/departments/${id}` : "/departments",
    members: (deptId: number, memberId?: number) =>
      memberId
        ? `/departments/${deptId}/members/${memberId}`
        : `/departments/${deptId}/members`,
    constituentUnits: (deptId: number, memberId?: number) =>
      memberId
        ? `/departments/${deptId}/constituentUnits/${memberId}`
        : `/departments/${deptId}/constituentUnits`,
    supportingUnits: (deptId: number, memberId?: number) =>
      memberId
        ? `/departments/${deptId}/supportingUnits/${memberId}`
        : `/departments/${deptId}/supportingUnits`
  },
  units: {
    root: (id?: number) => id ? `/units/${id}` : "/units",
    members: (unitId: number, memberId?: number) =>
      memberId
        ? `/units/${unitId}/members/${memberId}`
        : `/units/${unitId}/members`,
    children: (unitId: number, childId?: number) =>
      childId
        ? `/units/${unitId}/children/${childId}`
        : `/units/${unitId}/children`,
    supportedDepartments: (unitId: number, departmentId?: number) =>
      departmentId
        ? `/units/${unitId}/supportedDepartments/${departmentId}`
        : `/units/${unitId}/supportedDepartments`
  },
  people: {
    root: (id?: number) => id ? `/people/${id}` : "/people",
    memberships: (id?: number, memberId?: number) =>
      memberId
        ? `/people/${id}/memberships/${memberId}`
        : `/people/${id}/memberships`
  }
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
  clearAuthToken,
  getAuthToken,
  setAuthToken,
  redirectToLogin,
  signinIfUnauthorized
};
