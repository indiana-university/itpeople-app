import { action } from 'typesafe-actions'
import { IEntity } from '../../types';

//#region TYPES
export const enum SearchActionTypes {
    SEARCH_SIMPLE_SUBMIT = '@@search/SEARCH_SIMPLE_SUBMIT',
    SEARCH_SIMPLE_FETCH_REQUEST = '@@search/SEARCH_SIMPLE_FETCH_REQUEST',
    SEARCH_SIMPLE_FETCH_SUCCESS = '@@search/SEARCH_SIMPLE_FETCH_SUCCESS',
    SEARCH_SIMPLE_FETCH_ERROR = '@@search/SEARCH_SIMPLE_FETCH_ERROR',
}

export interface ISimpleSearchRequest {
    term: string,
}

export interface ISimpleSearchResult extends ISimpleSearchRequest {
    departments: IEntity[],
    units: IEntity[],
    users: IEntity[]
}
//#endregion

//#region ACTIONS
export const submit = () => action(SearchActionTypes.SEARCH_SIMPLE_SUBMIT)
export const fetchRequest = (request: ISimpleSearchRequest) => action(SearchActionTypes.SEARCH_SIMPLE_FETCH_REQUEST, request)
export const fetchSuccess = (data: ISimpleSearchResult) => action(SearchActionTypes.SEARCH_SIMPLE_FETCH_SUCCESS, data)
export const fetchError = (error: string) => action(SearchActionTypes.SEARCH_SIMPLE_FETCH_ERROR, error)
//#endregion
