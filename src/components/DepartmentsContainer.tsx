import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IApplicationState } from '../store';
import * as orgs from '../store/departments';
import Departments from './Departments';
import PageTitle from './layout/PageTitle';

// We can use `typeof` here to map our dispatch types to the props, like so.
interface IPropsFromDispatch {
    fetchRequest: typeof orgs.fetchRequest
}

// tslint:disable-next-line:max-classes-per-file
class DepartmentsContainer extends React.Component<orgs.IState & IPropsFromDispatch>{
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

// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = (state: IApplicationState) => ({
  ...state.orgs
})
  
// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = (dispatch: Dispatch) : IPropsFromDispatch => ({
  fetchRequest: () => dispatch(orgs.fetchRequest())
})
  
// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(DepartmentsContainer)
