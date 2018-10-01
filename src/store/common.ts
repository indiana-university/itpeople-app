import { AnyAction } from "redux";

// TYPES

export interface IApiState2<TResponse> {
    readonly data?: TResponse
    readonly error?: string
    readonly loading: boolean
}

// Declare state types with `readonly` modifier to get compile time immutability.
// https://github.com/piotrwitek/react-redux-typescript-guide#state-with-type-level-immutability
export interface IApiState<TRequest, TResponse> extends IApiState2<TResponse> {
    readonly request?: TRequest,
}

// REDUCERS

export const FetchRequestReducer = <TReq,TRes>(state:IApiState<TReq, TRes>, action:AnyAction) : IApiState<TReq, TRes> => {
    return { ...state, 
        data: undefined,
        error: undefined,
        loading: true,
        request: action.payload,
    }
}

export const FetchSuccessReducer = <TReq,TRes>(state:IApiState<TReq, TRes>, action:AnyAction) : IApiState<TReq, TRes> => (
    { ...state, 
        data: action.payload,
        error: undefined,
        loading: false,
        request: undefined,
    }
)

export const FetchErrorReducer = <TReq,TRes>(state:IApiState<TReq, TRes>, action:AnyAction) : IApiState<TReq, TRes> => (
    { ...state, 
        data: undefined,
        error: action.payload,
        loading: false,
        request: undefined,
    }
)

export const PutRequestReducer = <TReq,TRes>(state:IApiState<TReq, TRes>, action:AnyAction) : IApiState<TReq, TRes> => {
    return { ...state, 
        // data: undefined,
        error: undefined,
        loading: true,
        request: action.payload,
    }
}

export const PutSuccessReducer = <TReq,TRes>(state:IApiState<TReq, TRes>, action:AnyAction) : IApiState<TReq, TRes> => (
    { ...state, 
        data: action.payload,
        error: undefined,
        loading: false,
        request: undefined,
    }
)

export const PutErrorReducer = <TReq,TRes>(state:IApiState<TReq, TRes>, action:AnyAction) : IApiState<TReq, TRes> => (
    { ...state, 
        data: undefined,
        error: action.payload,
        loading: false,
        request: undefined,
    }
)
