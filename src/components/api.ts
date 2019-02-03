/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { put } from "redux-saga/effects";
import { NotAuthorizedError, ForbiddenError } from "./errors";
import { signInRequest } from "./SignIn/store";

const API_ENDPOINT = process.env.REACT_APP_API_URL || "";

export const callApiWithAuth: IApiCall = (method: string, url: string, path: string, data?: any) => {
  const authToken = getAuthToken();
  const authHeader = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  try {
    return call(method, url, path, data, authHeader);
  } catch (ex) {
    checkLogin(ex);
    throw ex;
  }
};

export const call: IApiCall = async function<TData>(method: string, apiUrl: string, path: string, data?: any, headers?: any) {
  const url = apiUrl + path;
  const combinedHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...headers
  };
  const response = await fetch(url, {
    body: JSON.stringify(data),
    headers: combinedHeaders,
    method
  });

  if (!response.ok) {
    switch (response.status){
      case 401: throw new NotAuthorizedError("User authentication is invalid or missing");
      case 403: throw new ForbiddenError("User does not have access to requested resource");
      default: throw new Error(`Unable to complete request. The server returned ${response.statusText} (${response.status})`);
    }
  }

  let jsonData = (await response.json()) as TData;

  return { permissions: getPermissions(response.headers), data: jsonData, url };
};

export const createApi = (caller: IApiCall = callApiWithAuth, apiUrl = API_ENDPOINT): IApi => {
  return {
    get: (path: string) => caller("get", apiUrl, path),
    put: (path: string, data: any) => caller("get", apiUrl, path, data),
    post: (path: string, data: any) => caller("post", apiUrl, path, data),
    delete: (path: string) => caller("delete", apiUrl, path)
  };
};

export interface IApi {
  /**
   * Asynchronously issue an HTTP GET request.
   *
   * @param {string} path The absolute path from the API root
   * @returns {Promise<IApiResponse<any>>} GET resposne
   */
  get(path: string): Promise<IApiResponse<any>>;
  /**
   * Asynchronously issue an HTTP PUT request.
   *
   * @param {string} path The absolute path from the API root
   * @param {any} data The request payload
   * @returns {Promise<IApiResponse<any>>} PUT resposne
   */
  put(path: string, data: any): Promise<IApiResponse<any>>;
  /**
   * Asynchronously issue an HTTP POST request.
   *
   * @param {string} path The absolute path from the API root
   * @param {any} data The request payload
   * @returns post
   */
  post(path: string, data: any): Promise<IApiResponse<any>>;
  /**
   * Asynchronously issue an HTTP DELETE request.
   *
   * @param path
   * @returns {Promise<IApiResponse<any>>} DELETE resposne
   */
  delete(path: string): Promise<IApiResponse<any>>;
}

export interface IApiResponse<TData> {
  readonly data: TData;
  readonly url: string;
  readonly permissions?: string[];
  readonly loading?: boolean;
}

function* checkLogin(exception: any) {
  if (exception instanceof NotAuthorizedError) {
    return put(signInRequest());
  }
}

interface IApiCall {
  (method: string, url: string, path: string, data?: any, headers?: any): Promise<IApiResponse<any>>;
}

const getAuthToken = () => localStorage.getItem("authToken");

const getPermissions = (headers: Headers): string[] => {
  if (!headers.has("X-User-Permissions")) {
    return [];
  }
  return (headers.get("X-User-Permissions") + "").split(",").map(v => v.trim());
};
