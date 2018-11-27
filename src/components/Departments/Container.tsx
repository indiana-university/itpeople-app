import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IApplicationState } from '../types';
import Departments from './Presentation';
import { fetchRequest, IState } from './store';
import { Loader } from '../Loader';
import { Content } from '../layout/Content';

interface IDispatchProps {
    fetchRequest: typeof fetchRequest
}

class Container extends React.Component<IState & IDispatchProps>{
    public componentDidMount() {
        this.props.fetchRequest()
    }

    public render() {
        return (
            <Content>
                <Loader {...this.props}>

                    {this.props.data &&
                        <Departments departments={this.props.data} />}
                </Loader>
            </Content>
        )
    }
}

const mapStateToProps = (state: IApplicationState) =>
    state.departments

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
    fetchRequest: () => dispatch(fetchRequest())
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Container)
