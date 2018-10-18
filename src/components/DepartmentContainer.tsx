import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IApplicationState } from '../store';
import * as org from '../store/department';
import Department from './Department';
import PageTitle from './layout/PageTitle';

interface IProps {
    match: any
}

// We can use `typeof` here to map our dispatch types to the props, like so.
interface IPropsFromDispatch {
    fetchRequest: typeof org.fetchRequest
}

// tslint:disable-next-line:max-classes-per-file
class UnitContainer extends React.Component<org.IState & IProps & IPropsFromDispatch>{
    public componentDidMount() {
        console.log(this.props.match)
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
const mapStateToProps = (state: IApplicationState) => ({
  ...state.org
})
  
// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = (dispatch: Dispatch) : IPropsFromDispatch => ({
  fetchRequest: (request: org.IDepartmentRequest) => dispatch(org.fetchRequest(request))
})
  
// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(UnitContainer)
