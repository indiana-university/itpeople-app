/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as Department from "../components/Department/store";
import * as Departments from "../components/Departments/store";
import * as People from '../components/Profile/store'
import * as SearchSimple from '../components/Search/store'
import * as Auth from '../components/SignIn/store'
import * as Unit from "../components/Unit/store";
import * as Units from "../components/Units/store";

// The top-level state object
export interface IApplicationState {
    auth: Auth.IState,
    profile: People.IState,
    searchSimple: SearchSimple.IState,
    unit: Unit.IState,
    units: Units.IState,
    department: Department.IState,
    departments: Departments.IState,
    form: any,
    modal: string
}

export enum ViewStateType {
    Loading,
    Viewing,
    Editing,
    Saving,
    Error
}
export interface IDefaultState<TData> {
    readonly data?: TData
    readonly error?: string
    readonly loading: boolean
    readonly view?: ViewStateType
}
// Declare state types with `readonly` modifier to get compile time immutability.
// https://github.com/piotrwitek/react-redux-typescript-guide#state-with-type-level-immutability
export interface IApiState<TRequest, TResponse> extends IDefaultState<TResponse> {
    readonly request?: TRequest,
}

export interface IEntity {
    id: number,
    name: string,
    description?: string
}

export interface IRole {
    role: string
}

import { AnyAction } from "redux";
export const FetchRequestReducer = <TReq, TRes>(state: IApiState<TReq, TRes>, action: AnyAction): IApiState<TReq, TRes> => {
    return {
        ...state,
        data: undefined,
        error: undefined,
        loading: true,
        request: action.payload,
        view: ViewStateType.Loading
    }
}

export const FetchSuccessReducer = <TReq, TRes>(state: IApiState<TReq, TRes>, action: AnyAction): IApiState<TReq, TRes> => (
    {
        ...state,
        data: action.payload,
        error: undefined,
        loading: false,
        request: undefined,
        view: ViewStateType.Viewing
    }
)

export const FetchErrorReducer = <TReq, TRes>(state: IApiState<TReq, TRes>, action: AnyAction): IApiState<TReq, TRes> => (
    {
        ...state,
        data: undefined,
        error: action.payload,
        loading: false,
        request: undefined,
        view: ViewStateType.Error
    }
)

export const PutRequestReducer = <TReq, TRes>(state: IApiState<TReq, TRes>, action: AnyAction): IApiState<TReq, TRes> => {
    return {
        ...state,
        // data: undefined,
        error: undefined,
        loading: true,
        request: action.payload,
        view: ViewStateType.Saving
    }
}

export const PutSuccessReducer = <TReq, TRes>(state: IApiState<TReq, TRes>, action: AnyAction): IApiState<TReq, TRes> => (
    {
        ...state,
        data: action.payload,
        error: undefined,
        loading: false,
        request: undefined,
        view: ViewStateType.Viewing
    }
)

export const PutErrorReducer = <TReq, TRes>(state: IApiState<TReq, TRes>, action: AnyAction): IApiState<TReq, TRes> => (
    {
        ...state,
        data: undefined,
        error: action.payload,
        loading: false,
        request: undefined,
        view: ViewStateType.Error
    }
)
