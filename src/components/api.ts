/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { NotAuthorizedError, ForbiddenError } from "./errors";
import { Permissions as Permission, Permissions } from "./types";

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
  }).then(resp => {
    if (!resp.ok) {
      return resp.json().then((body: any) => {
        let message = "";
        if(body && body.errors && body.errors.length){
          message = ": " + body.errors.join(": ");
        }

        throw new Error(message)
      }).catch((e:Error)=>{
        let message = (e && e.message) || "";
        switch (resp.status) {
          case 401:
            throw new NotAuthorizedError("User authentication is invalid or missing" + message);
          case 403:
            throw new ForbiddenError("There as an authorization problem" + message);
          default:
            throw new Error(`Unable to complete request. The server returned ${resp.statusText} (${resp.status})${message}`);
        }
      });
    }
    return resp.json().then(json => ({ permissions: getPermissions(resp.headers), data: json, url: apiUrl + path } as IApiResponse<T>));
  });

export const restApi = (apiUrl = API_ENDPOINT, caller: IApiCall = callApiWithAuth): IApi => ({
  get: <T>(path: string) => caller<T>("get", apiUrl, path),
  put: <T>(path: string, data: T) => caller<T>("put", apiUrl, path, data),
  post: <T>(path: string, data: T) => caller<T>("post", apiUrl, path, data),
  delete: <T>(path: string) => caller<T>("delete", apiUrl, path)
});

export interface IApi {
  /**
   * Asynchronously issue an HTTP GET request.
   *
   * @param {string} path The absolute path from the API root
   * @returns {Promise<IApiResponse<T>>} GET resposne
   */
  get<T>(path: string): Promise<IApiResponse<T>>;
  /**
   * Asynchronously issue an HTTP PUT request.
   *
   * @param {string} path The absolute path from the API root
   * @param {any} data The request payload
   * @returns {Promise<IApiResponse<T>>} PUT resposne
   */
  put<T>(path: string, data: T): Promise<IApiResponse<T>>;
  /**
   * Asynchronously issue an HTTP POST request.
   *
   * @param {string} path The absolute path from the API root
   * @param {any} data The request payload
   * @returns {Promise<IApiResponse<T>>} POST response
   */
  post<T>(path: string, data: T): Promise<IApiResponse<T>>;
  /**
   * Asynchronously issue an HTTP DELETE request.
   *
   * @param path
   * @returns {Promise<IApiResponse<any>>} DELETE resposne
   */
  delete(path: string): Promise<IApiResponse<void>>;
}

export interface IApiResponse<TData> {
  readonly data: TData | undefined;
  readonly url: string;
  readonly permissions: Permission[];
}

export interface IApiCall {
  <T>(method: string, url: string, path: string, data?: T, headers?: any): Promise<IApiResponse<T>>;
}

const getAuthToken = () => localStorage.getItem("authToken");

const getPermissions = (headers: Headers): Permission[] =>
  (headers.get("X-User-Permissions") + "")
    .split(",")
    .map(v => v.trim().toUpperCase())
    .map(Permissions.parse)
    .filter(p => p !== undefined);
