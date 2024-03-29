import { NotAuthorizedError } from "./errors";
import { signInRequest } from "./SignIn/store";

/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

const clearApplicationData = () => {
  localStorage.clear();
  sessionStorage.clear();
}

const getAuthToken = () => sessionStorage.getItem("authToken");

const setAuthToken = (token: string) =>
  sessionStorage.setItem("authToken", token);

const setPostAuthDestination = () => sessionStorage.setItem("postAuthDestination", window.location.pathname + window.location.search);

const getPostAuthDestination = () => sessionStorage.getItem("postAuthDestination");

const redirectToPostAuthDestination = () => {  
  var storageValue = sessionStorage.getItem("postAuthDestination");
  // If there is no custom storageValue default to the /units page.
  if(storageValue == null || storageValue == "/"){
    window.location.assign("/units");
    return;
  }
  
  window.location.assign(storageValue);
}

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
  supportTypes: {
    root: () =>  "/supportTypes",
  },
  buildings: {
    root: (id?: number) => (id ? `/buildings/${id}` : "/buildings"),
    supportingUnits: (id: number) => `/buildings/${id}/supportingUnits`,
    search: (term: string) => `/buildings?q=${term}`
  },
  units: {
    root: (id?: number) => (id ? `/units/${id}` : "/units"),
    members: (unitId: number) => `/units/${unitId}/members`,
    children: (unitId: number) => `/units/${unitId}/children`,
    supportedDepartments: (unitId: number) => `/units/${unitId}/supportedDepartments`,
    supportedBuildings: (unitId: number) => `/units/${unitId}/supportedBuildings`,
    tools: (unitId:number) => `/units/${unitId}/tools`,
    search: (term: string) => `/units?q=${term}`
  },
  people: {
    root: (id?: number) => (id ? `/people/${id}` : "/people"),
    memberships: (id: number) => `/people/${id}/memberships`,
    search: (term: string) => `/people?${term}`
  },
  memberships: (id?: number) => (id ? `/memberships/${id}` : "/memberships"),
  memberTools: (id?: number) => (id ? `/memberTools/${id}` : "/memberTools"),
  supportRelationships: (id?: number) => (id ? `/supportRelationships/${id}` : "/supportRelationships"),
  buildingRelationships: (id?: number) => (id ? `/buildingRelationships/${id}` : "/buildingRelationships")
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
  setPostAuthDestination,
  getPostAuthDestination,
  redirectToPostAuthDestination,
  redirectToLogin,
  signinIfUnauthorized
};
