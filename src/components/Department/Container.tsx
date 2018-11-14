import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IApplicationState } from '../types';
import Department from './Presentation';
import { fetchRequest, IDepartmentRequest, IState } from './store';
import { Loader } from '../Loader';

interface IContainerProps {
    match: any
}

interface IDispatchProps {
    fetchRequest: typeof fetchRequest
}

class Container extends React.Component<IState & IContainerProps & IDispatchProps>{
    public componentDidMount() {
        this.props.fetchRequest(this.props.match.params)
    }
    public render() {
        return (
            <Loader {...this.props}>
                {this.props.data &&
                    <Department {...this.props.data} />
                }
            </Loader>
        )
    }
}

export const mapStateToProps = (state: IApplicationState) =>
    state.department

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
    fetchRequest: (request: IDepartmentRequest) => dispatch(fetchRequest(request))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Container)
