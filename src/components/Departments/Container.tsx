import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import PageTitle from '../layout/PageTitle';
import { IApplicationState } from '../types';
import Departments from './Presentation';
import { fetchRequest, IState } from './store';

interface IDispatchProps {
    fetchRequest: typeof fetchRequest
}

class Container extends React.Component<IState & IDispatchProps>{
    public componentDidMount() {
        this.props.fetchRequest()
    }

    public render() {
        return (
            <>
                <PageTitle>Departments</PageTitle>
                {/* { this.props.loading && 
                    <p>Loading...</p>} */}
                { this.props.data &&  
                    <Departments {...this.props.data} /> }
                { this.props.error && 
                    <p>{this.props.error}</p> }
            </>
        )
    }
}

const mapStateToProps = (state: IApplicationState) => 
    state.departments
  
const mapDispatchToProps = (dispatch: Dispatch) : IDispatchProps => ({
  fetchRequest: () => dispatch(fetchRequest())
})
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Container)
