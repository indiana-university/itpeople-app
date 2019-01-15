/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { call, put } from 'redux-saga/effects'
import { PayloadMetaAction } from "typesafe-actions/dist/types";
import { NotAuthorizedError } from "./errors";
import { signInRequest } from './SignIn/store';

const API_ENDPOINT = process.env.REACT_APP_API_URL || '';

export interface ApiResponse<TData> {
    data?: TData,
    response: Response
}

const getAuthToken = () => localStorage.getItem("authToken")

const callApi = async function <TData>(method: string, url: string, path: string, data?: any, headers?: any) {
    const combinedHeaders = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers
    }
    const response = await fetch(url + path, {
        body: JSON.stringify(data),
        headers: combinedHeaders,
        method,
    });

    if (!response.ok) {
        throw response.status === 401
            ? new NotAuthorizedError("user not authorized")
            : new Error(`Unable to complete request. The server returned ${response.statusText} (${response.status})`);
    }

    let jsonData = await response.json();

    return { response, data: jsonData };
}

const callApiWithAuth = (method: string, url: string, path: string, data?: any) => {
    const authToken = getAuthToken()
    const authHeader = authToken ? { Authorization: `Bearer ${authToken}` } : {}
    return callApi(method, url, path, data, authHeader)
}

function* handleError(
    err: any,
    error: (r: string) => PayloadMetaAction<string, string, any>) {
    if (err instanceof NotAuthorizedError) {
        return put(signInRequest())
    }

    if (err instanceof Error) {
        return put(error(err.stack!))
    }

    return put(error('An unknown error occured.'))
}

function* handleResponse<TData>(
    response: any,
    success: (r: ApiResponse<TData>) => PayloadMetaAction<string, ApiResponse<TData>, any>,
    error: (r: string) => PayloadMetaAction<string, string, any>) {
    if (response.errors) {
        yield put(error(response.errors))
    } else {
        yield put(success(response))
    }
}

export function* get<TData>(
    path: string,
    success: (r: ApiResponse<TData>) => PayloadMetaAction<string, ApiResponse<TData>, any>,
    error: (r: string) => PayloadMetaAction<string, string, any>) {
    try {
        const response = yield call(callApiWithAuth, 'get', API_ENDPOINT, path)
        yield handleResponse(response, success, error)
    } catch (err) {
        yield handleError(err, error)
    }
}