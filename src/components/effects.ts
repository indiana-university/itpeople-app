/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { call, put } from 'redux-saga/effects'
import { PayloadMetaAction } from "typesafe-actions/dist/types";
import { NotAuthorizedError } from "./errors";
import { signInRequest } from './SignIn/store';

const clearAuthToken = () =>
    localStorage.removeItem('authToken')

const getAuthToken = () => 
    localStorage.getItem("authToken")

const setAuthToken = (token: string) => 
    localStorage.setItem('authToken', token)

const redirectToLogin = () =>
    window.location.assign(`${process.env.REACT_APP_OAUTH2_AUTH_URL}?response_type=code&client_id=${process.env.REACT_APP_OAUTH2_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_WEB_URL}/signin`)

const apiEndpoints = {
    departments: (id?: number) => id ? "/departments" : `/departments/${id}`,
    units: {
        root: (id?: number) => (id ? `/units/${id}` : "/units"),
        members: (unitId: number, memberId?: number) => (memberId ? `/units/${unitId}/members/${memberId}` : `/units/${unitId}/members`),
        children: (unitId: number, childId?: number) => (childId ? `/units/${unitId}/children/${childId}` : `/units/${unitId}/children`),
        supportedDepartments: (unitId: number, departmentId?: number) => (departmentId ? `/units/${unitId}/supportedDepartments/${departmentId}` : `/units/${unitId}/supportedDepartments`),
    },
    people: (id?: number) => id ? "/people" : `/people/${id}`
};
// GET /units/:id/memberships
// POST /memberships or POST /units/:id
// DELETE /memberships/:id
type apiFn = (method: string, url: string, path: string, data?: any, headers?: any) => Promise<any>

const callApi : apiFn = (method: string, url: string, path: string, data?: any, headers?: any) => {
    const combinedHeaders = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers
    }
    return fetch(url + path, {
        body: JSON.stringify(data),
        headers: combinedHeaders,
        method,
    })
    .then(res => {
        if (res.status === 401) return { unauthorized: true }
        else if (!res.ok) return { errors: [`Unable to complete request. The server returned ${res.statusText} (${res.status})`] }
        else return res.json()})
    .catch(err => { errors: [err.ToString()]});
}

const callApiWithAuth = (method: string, url: string, path: string, data?: any) => {
    const authToken = getAuthToken()
    const authHeader = authToken ? { Authorization: `Bearer ${authToken}` } : {}
    return callApi(method, url, path, data, authHeader)
}


const API_ENDPOINT = process.env.REACT_APP_API_URL || ''

/**
 * Handle a request that results in an exception.
 *
 * @param {*} err The error object
 * @param {(r:string) => PayloadMetaAction<string,string,any>} error A request failure action generator
 */
function* handleError(
    err: any,
    error: (r:string) => PayloadMetaAction<string,string,any>){
    if (err instanceof NotAuthorizedError){
        yield put(signInRequest())
      }
      else if (err instanceof Error) {
        yield put(error(err.stack!))
      } else {
        yield put(error('An unknown error occured.'))
      }  
}

/**
 * Asynchronously issue an HTTP GET request and resolve the response.
 *
 * @template TResponse The expected response type
 * @param {string} path The absolute path from the API root
 * @param {(r:TResponse) => PayloadMetaAction<string,TResponse,any>} success A request success action generator
 * @param {(r:string) => PayloadMetaAction<string,string,any>} error A request failure action generator
 */
function* httpGet<TResponse>(
    api: apiFn,
    path: string, 
    success: (r:TResponse) => PayloadMetaAction<string,TResponse,any>, 
    error: (r:string) => PayloadMetaAction<string,string,any>) {
        const response = yield call(api, 'get', API_ENDPOINT, path)
        if (response.unauthorized) { yield put(signInRequest()); } 
        else if (response.errors) { yield put(error(response.errors)); } 
        else { yield put(success(response)); }      
}

/**
 * Asynchronously issue an HTTP POST request with a payload and resolve the response.
 *
 * @template TRequest The request payload type.
 * @template TResponse The expected response type
 * @param {string} path The absolute path from the API root
 * @param {TRequest} data The request payload
 * @param {(r:TResponse) => PayloadMetaAction<string,TResponse,any>} success A request success action generator
 * @param {(r:string) => PayloadMetaAction<string,string,any>} error A request failure action generator
 */
function* httpPost<TRequest, TResponse>(
    api: apiFn,
    path: string,
    data: TRequest,
    success: (r: TResponse) => PayloadMetaAction<string, TResponse, any>,
    error: (r: string) => PayloadMetaAction<string, string, any>) {
        const response = yield call(api, 'post', API_ENDPOINT, path, data)
        if (response.unauthorized) { yield put(signInRequest()); }
        else if (response.errors) { yield put(error(response.errors)); }
        else { yield put(success(response)); }      
}

/**
 * Asynchronously issue an HTTP PUT request with a payload and resolve the response.
 *
 * @template TRequest The request payload type.
 * @template TResponse The expected response type
 * @param {string} path The absolute path from the API root
 * @param {TRequest} data The request payload
 * @param {(r:TResponse) => PayloadMetaAction<string,TResponse,any>} success A request success action generator
 * @param {(r:string) => PayloadMetaAction<string,string,any>} error A request failure action generator
 */
function* httpPut<TRequest, TResponse>(
    api: apiFn,
    path: string, 
    data: TRequest,
    success: (r:TResponse) => PayloadMetaAction<string,TResponse,any>, 
    error: (r:string) => PayloadMetaAction<string,string,any>) {
        const response = yield call(api, 'put', API_ENDPOINT, path, data)
        if (response.unauthorized) { yield put(signInRequest()); }
        else if (response.errors) { yield put(error(response.errors)); }
        else { yield put(success(response)); }      
}

/**
 * Asynchronously issue an HTTP DELETE and resolve the response.
 *
 * @param {string} path The absolute path from the API root
 * @param {() => PayloadMetaAction<string,any,any>} success A request success action generator
 * @param {(r:string) => PayloadMetaAction<string,string,any>} error A request failure action generator
 */
function* httpDelete(
    api: apiFn,
    path: string,
    success: () => PayloadMetaAction<string, any, any>,
    error: (r: string) => PayloadMetaAction<string, string, any>) {
    const response = yield call(api, 'delete', API_ENDPOINT, path)
        if (response.unauthorized) { yield put(signInRequest()); }
        else if (response.errors) { yield put(error(response.errors)); }
        else { yield put(success()); }      
}

export { 
    apiFn,
    apiEndpoints,
    callApi,
    callApiWithAuth,
    clearAuthToken,
    httpGet,
    httpPost,
    httpPut,
    httpDelete,
    handleError,
    getAuthToken,
    setAuthToken,
    redirectToLogin
}
