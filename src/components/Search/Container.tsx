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
  IState,
  submit
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
  searchRequest: typeof fetchRequest;
  setCurrentList: typeof setCurrentList;
  submitSearch: typeof submit;
}

interface ISimpleSearchContainerProps
  extends IState,
    ISearchProps,
    IPropsFromDispatch {}

const executeSearch = (props: ISimpleSearchContainerProps) => {
  const queryParam = queryString.parse(props.location.search);
  props.searchRequest({ term: queryParam.term });
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
        {this.props.data && (
          <Search
            {...this.props.data}
            submitSearch={this.props.submitSearch}
            setCurrentList={this.props.setCurrentList}
          />
        )}
      </Loader>
    );
  }
}

const mapStateToProps = (state: IApplicationState) => state.searchSimple;

const mapDispatchToProps = (dispatch: Dispatch): IPropsFromDispatch => ({
  searchRequest: (request: ISimpleSearchRequest) => dispatch(fetchRequest(request)),
  setCurrentList: (list: SearchLists) => dispatch(setCurrentList(list)),
  submitSearch: () => dispatch(submit())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
