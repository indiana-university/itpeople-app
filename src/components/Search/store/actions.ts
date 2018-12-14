/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { action } from "typesafe-actions";
import { IEntity } from "../../types";
import { SearchLists } from "../Results";

//#region TYPES
export const enum SearchActionTypes {
  SEARCH_SIMPLE_SUBMIT = "@@search/SEARCH_SIMPLE_SUBMIT",
  SEARCH_SIMPLE_FETCH_REQUEST = "@@search/SEARCH_SIMPLE_FETCH_REQUEST",
  SEARCH_SIMPLE_FETCH_SUCCESS = "@@search/SEARCH_SIMPLE_FETCH_SUCCESS",
  SEARCH_SIMPLE_FETCH_ERROR = "@@search/SEARCH_SIMPLE_FETCH_ERROR",
  SEARCH_SET_CURRENT_LIST = "SEARCH_SET_CURRENT_LIST"
}

export interface ISimpleSearchRequest {
  term: string;
}

export interface ISimpleSearchResult extends ISimpleSearchRequest {
  departments: IEntity[];
  units: IEntity[];
  users: IEntity[];
  selectedList?: SearchLists;
}
//#endregion

//#region ACTIONS
export const setCurrentList = (list: SearchLists) => action(SearchActionTypes.SEARCH_SET_CURRENT_LIST, { list });
export const submit = () => action(SearchActionTypes.SEARCH_SIMPLE_SUBMIT);
export const fetchRequest = (request: ISimpleSearchRequest) => action(SearchActionTypes.SEARCH_SIMPLE_FETCH_REQUEST, request);
export const fetchSuccess = (data: ISimpleSearchResult) => action(SearchActionTypes.SEARCH_SIMPLE_FETCH_SUCCESS, data);
export const fetchError = (error: string) => action(SearchActionTypes.SEARCH_SIMPLE_FETCH_ERROR, error);
//#endregion
