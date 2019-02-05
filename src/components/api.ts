/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { NotAuthorizedError, ForbiddenError } from "./errors";
import { signInRequest } from "./SignIn/store";

const API_ENDPOINT = process.env.REACT_APP_API_URL || "";

export const callApiWithAuth: IApiCall = <T>(method: string, url: string, path: string, data?: any) => {
  const authToken = getAuthToken();
  const authHeader = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  return call<T>(method, url, path, data, authHeader);
};

export const call: IApiCall = async <T>(method: string, apiUrl: string, path: string, data?: any, headers?: any) =>
  fetch(apiUrl + path, {
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers
    },
    method
  })
    .then(resp => {
      if (!resp.ok) {
        switch (resp.status) {
          case 401:
            throw new NotAuthorizedError("User authentication is invalid or missing");
          case 403:
            throw new ForbiddenError("User does not have access to requested resource");
          default:
            throw new Error(`Unable to complete request. The server returned ${resp.statusText} (${resp.status})`);
        }
      }
      return resp.json().then(json => ({ permissions: getPermissions(resp.headers), data: json, url: apiUrl + path } as IApiResponse<T>));
    })
    .catch((err: Error) => {
      throw { ...err, errors: err.stack };
    });

export const createApi = <T>(caller: IApiCall = callApiWithAuth, apiUrl = API_ENDPOINT): IApi<T> => ({
  getOne: (path: string) => caller<T>("get", apiUrl, path),
  getList: (path: string) => caller<T[]>("get", apiUrl, path),
  put: (path: string, data: T) => caller<T>("get", apiUrl, path, data),
  post: (path: string, data: T) => caller<T>("post", apiUrl, path, data),
  delete: (path: string) => caller<T>("delete", apiUrl, path)
});

/**
 * Handle a request that results in an exception.
 *
 * @param {*} err The error object
 * @param {(r:string) => PayloadMetaAction<string,string,any>} error A request failure action generator
 */
export function signinIfUnauthorized(err: Error) {
  if (err instanceof NotAuthorizedError) {
    return signInRequest();
  }

  throw err;
}

export interface IApi<T> {
  /**
   * Asynchronously issue an HTTP GET request.
   *
   * @param {string} path The absolute path from the API root
   * @returns {Promise<IApiResponse<T>>} GET resposne
   */
  getOne(path: string): Promise<IApiResponse<T>>;
  /**
   * Asynchronously issue an HTTP GET request.
   *
   * @param {string} path The absolute path from the API root
   * @returns {Promise<IApiResponse<T>>} GET resposne
   */
  getList(path: string): Promise<IApiResponse<T[]>>;
  /**
   * Asynchronously issue an HTTP PUT request.
   *
   * @param {string} path The absolute path from the API root
   * @param {any} data The request payload
   * @returns {Promise<IApiResponse<T>>} PUT resposne
   */
  put(path: string, data: T): Promise<IApiResponse<T>>;
  /**
   * Asynchronously issue an HTTP POST request.
   *
   * @param {string} path The absolute path from the API root
   * @param {any} data The request payload
   * @returns {Promise<IApiResponse<T>>} POST response
   */
  post(path: string, data: T): Promise<IApiResponse<T>>;
  /**
   * Asynchronously issue an HTTP DELETE request.
   *
   * @param path
   * @returns {Promise<IApiResponse<any>>} DELETE resposne
   */
  delete(path: string): Promise<IApiResponse<T>>;
}

export interface IApiResponse<TData> {
  readonly data: TData;
  readonly url: string;
  readonly permissions?: string[];
  readonly loading?: boolean;
}

interface IApiCall {
  <T>(method: string, url: string, path: string, data?: T, headers?: any): Promise<IApiResponse<T>>;
}

const getAuthToken = () => localStorage.getItem("authToken");

const getPermissions = (headers: Headers): string[] => {
  if (!headers.has("X-User-Permissions")) {
    return [];
  }
  return (headers.get("X-User-Permissions") + "").split(",").map(v => v.trim());
};
