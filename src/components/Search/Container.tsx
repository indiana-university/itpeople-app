/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as queryString from "query-string";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IApplicationState } from "../types";
import Search from "./Presentation";
import {
  setCurrentList,
  fetchRequest,
  ISimpleSearchRequest,
  IState
} from "./store";
import { Loader } from "../Loader";
import { SearchLists } from "./Results";

interface ILocationProps {
  search: string;
}

interface ISearchProps {
  location: ILocationProps;
}

interface IPropsFromDispatch {
  fetchRequest: typeof fetchRequest;
  setCurrentList: typeof setCurrentList;
}

interface ISimpleSearchContainerProps
  extends IState,
    ISearchProps,
    IPropsFromDispatch {}

const executeSearch = (props: ISimpleSearchContainerProps) => {
  const queryParam = queryString.parse(props.location.search);
  props.fetchRequest({ term: queryParam.term });
};

class Container extends React.Component<ISimpleSearchContainerProps> {
  public componentDidMount() {
    executeSearch(this.props);
  }

  public componentWillReceiveProps(nextProps: ISimpleSearchContainerProps) {
    if (!this.props.location || this.props.location !== nextProps.location) {
      executeSearch(nextProps);
    }
  }

  public render() {
    return (
      <Loader {...this.props} loadingMessage="Searching...">
        {this.props.data &&
          <Search
            {...this.props.data}
            setCurrentList={this.props.setCurrentList}
          />}
      </Loader>
    );
  }
}

const mapStateToProps = (state: IApplicationState) => state.searchSimple;

const mapDispatchToProps = (dispatch: Dispatch): IPropsFromDispatch => ({
  fetchRequest: (request: ISimpleSearchRequest) => dispatch(fetchRequest(request)),
  setCurrentList: (list: SearchLists) => dispatch(setCurrentList(list))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
