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
import { setCurrentList, submit as search, IState } from "./store";
import { SearchLists } from "./Results";
import { change } from "redux-form";

interface ILocationProps {
  search: string;
}

interface ISearchProps {
  location: ILocationProps;
}

interface IPropsFromDispatch {
  search: typeof search;
  setCurrentList: typeof setCurrentList;
  setSearchTerm: (q: string) => any;
}

interface ISimpleSearchContainerProps extends IState, ISearchProps, IPropsFromDispatch {}

const executeSearch = (props: ISimpleSearchContainerProps) => {
  const qTerm = queryString.parse(props.location.search).term;
  const term = (qTerm instanceof Array ? qTerm.join("") : qTerm) || "";
  props.setSearchTerm(term);
  return props.search(term);
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
    return <Search {...this.props} />;
  }
}

const mapStateToProps = (state: IApplicationState) => state.searchSimple;

const mapDispatchToProps = (dispatch: Dispatch): IPropsFromDispatch => ({
  search: (term: string) => dispatch(search(term)),
  setCurrentList: (list: SearchLists) => dispatch(setCurrentList(list)),
  setSearchTerm: (q: string) => dispatch(change("search", "term", q))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
