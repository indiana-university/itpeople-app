import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IApplicationState } from "../types";
import Departments from "./Presentation";
import { fetchRequest, IState } from "./store";
import { Loader } from "../Loader";

interface IDispatchProps {
  fetchRequest: typeof fetchRequest;
}

class Container extends React.Component<IState & IDispatchProps> {
  public componentDidMount() {
    this.props.fetchRequest();
  }

  public render() {
    return (
      <Loader {...this.props}>
        {this.props.data && <Departments departments={this.props.data} />}
      </Loader>
    );
  }
}

const mapStateToProps = (state: IApplicationState) => state.departments;

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
  fetchRequest: () => dispatch(fetchRequest())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
