import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import PageTitle from '../layout/PageTitle';
import { IApplicationState } from '../types';
import Department from './Presentation';
import { fetchRequest, IDepartmentRequest, IState} from './store';

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
            <>
                {/* { this.props.loading && 
                    <p>Loading department...</p>} */}
                { this.props.data &&
                    <>
                        <PageTitle>{`${this.props.data.department.description} (${this.props.data.department.name})`}</PageTitle>
                        <Department {...this.props.data} />
                    </> 
                }
                { this.props.error && 
                    <p>{this.props.error}</p> }
            </>
        )
    }
}

export const mapStateToProps = (state: IApplicationState) => 
    state.department
    
export const mapDispatchToProps = (dispatch: Dispatch) : IDispatchProps => ({
    fetchRequest: (request: IDepartmentRequest) => dispatch(fetchRequest(request))
})
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Container)
