import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IApplicationState } from '../store';
import * as units from '../store/units';
import PageTitle from './layout/PageTitle';
import Units from './Units';

// We can use `typeof` here to map our dispatch types to the props, like so.
interface IPropsFromDispatch {
    fetchRequest: typeof units.fetchRequest
}

// tslint:disable-next-line:max-classes-per-file
class UnitsContainer extends React.Component<units.IState & IPropsFromDispatch>{
    public componentDidMount() {
        this.props.fetchRequest()
    }

    public render() {
        return (
            <>
                <PageTitle>Units</PageTitle>
                {/* { this.props.loading && 
                    <p>Loading...</p>} */}
                { this.props.data &&  
                    <Units {...this.props.data} /> }
                { this.props.error && 
                    <p>{this.props.error}</p> }
            </>
        )
    }
}

// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = (state: IApplicationState) => ({
  ...state.units
})
  
// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = (dispatch: Dispatch) : IPropsFromDispatch => ({
  fetchRequest: () => dispatch(units.fetchRequest())
})
  
// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(UnitsContainer)
