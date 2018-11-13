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

const callApi = (method: string, url: string, path: string, data?: any, headers?: any) => {
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
            if (!res.ok){
                throw res.status === 401 
                    ? new NotAuthorizedError("user not authorized")
                    : new Error(`Unable to complete request. The server returned ${res.statusText} (${res.status})`)
            }
            
            return res.json()})

}

const callApiWithAuth = (method: string, url: string, path: string, data?: any) => {
    const authToken = getAuthToken()
    const authHeader = authToken ? { Authorization: `Bearer ${authToken}` } : {}
    return callApi(method, url, path, data, authHeader)
}


const API_ENDPOINT = process.env.REACT_APP_API_URL || ''

/**
 * Handle a request that result in an exception.
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
 * Handle a request that resulted in a response
 *
 * @template TResponse The expected response type
 * @param {*} response The response data
 * @param {(r:TResponse) => PayloadMetaAction<string,TResponse,any>} success A request success action generator
 * @param {(r:string) => PayloadMetaAction<string,string,any>} error A request failure action generator
 */
function* handleResponse<TResponse>(
    response: any,
    success: (r:TResponse) => PayloadMetaAction<string,TResponse,any>, 
    error: (r:string) => PayloadMetaAction<string,string,any>){
    if (response.errors) {
        yield put(error(response.errors))
        } else {
        yield put(success(response))
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
    path: string, 
    success: (r:TResponse) => PayloadMetaAction<string,TResponse,any>, 
    error: (r:string) => PayloadMetaAction<string,string,any>) {
  try {
    const response = yield call(callApiWithAuth, 'get', API_ENDPOINT, path)
    yield handleResponse(response, success, error)
  } catch (err) {
    yield handleError(err, error)
  }
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
    path: string, 
    data: TRequest,
    success: (r:TResponse) => PayloadMetaAction<string,TResponse,any>, 
    error: (r:string) => PayloadMetaAction<string,string,any>) {
  try {
    const response = yield call(callApiWithAuth, 'put', API_ENDPOINT, path, data)
    yield handleResponse(response, success, error)
  } catch (err) {
    yield handleError(err, error)
  }
}

export { 
    callApi,
    callApiWithAuth,
    clearAuthToken,
    httpGet,
    httpPut,
    handleError,
    getAuthToken,
    setAuthToken,
    redirectToLogin
}
