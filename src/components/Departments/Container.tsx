import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IApplicationState } from '../../store';
import PageTitle from '../layout/PageTitle';
import Departments from './Presentation';
import { fetchRequest, IState } from './store';

// We can use `typeof` here to map our dispatch types to the props, like so.
interface IDispatchProps {
    fetchRequest: typeof fetchRequest
}

// tslint:disable-next-line:max-classes-per-file
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

// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = (state: IApplicationState) => ({
  ...state.departments
})
  
// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = (dispatch: Dispatch) : IDispatchProps => ({
  fetchRequest: () => dispatch(fetchRequest())
})
  
// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Container)
