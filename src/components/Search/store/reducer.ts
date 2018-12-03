import {
  SearchActionTypes,
  ISimpleSearchRequest,
  ISimpleSearchResult
} from "./";
import { Reducer } from "redux";
import {
  IApiState,
  FetchErrorReducer,
  FetchRequestReducer,
  FetchSuccessReducer
} from "../../types";

export interface IState
  extends IApiState<ISimpleSearchRequest, ISimpleSearchResult> {}

export const initialState: IState = {
  data: undefined,
  error: undefined,
  loading: false,
  request: undefined
};

export const reducer: Reducer<IState> = (state = initialState, act) => {
  switch (act.type) {
    case SearchActionTypes.SEARCH_SIMPLE_FETCH_REQUEST:
      return FetchRequestReducer(state, act);
    case SearchActionTypes.SEARCH_SIMPLE_FETCH_SUCCESS:
      return FetchSuccessReducer(state, act);
    case SearchActionTypes.SEARCH_SIMPLE_FETCH_ERROR:
      return FetchErrorReducer(state, act);
    case SearchActionTypes.SEARCH_SET_CURRENT_LIST:
      if (state.data) {
        return {
          ...state,
          data: { ...state.data, selectedList: act.payload.list },
          error: undefined,
          loading: false,
          request: undefined
        };
      }
    default:
      return state;
  }
};
