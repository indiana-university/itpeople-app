import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IApplicationState } from '../../store/index';
import PageTitle from '../layout/PageTitle';
import Department from './Presentation';
import { fetchRequest, IContainerProps, IDepartmentRequest, IDispatchProps, IState} from './store';

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

// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
export const mapStateToProps = (state: IApplicationState) => ({
    ...state.department
  })
    
  // mapDispatchToProps is especially useful for constraining our actions to the connected component.
  // You can access these via `this.props`.
  export const mapDispatchToProps = (dispatch: Dispatch) : IDispatchProps => ({
    fetchRequest: (request: IDepartmentRequest) => dispatch(fetchRequest(request))
  })
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Container)
