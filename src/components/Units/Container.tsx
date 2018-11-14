import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import PageTitle from '../layout/PageTitle';
import { IApplicationState } from '../types';
import Units from './Presentation';
import * as units from './store';

// We can use `typeof` here to map our dispatch types to the props, like so.
interface IDispatchProps {
    fetchRequest: typeof units.fetchRequest
}

// tslint:disable-next-line:max-classes-per-file
class Container extends React.Component<units.IState & IDispatchProps>{
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
                    <Units units={this.props.data} /> }
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
const mapDispatchToProps = (dispatch: Dispatch) : IDispatchProps => ({
  fetchRequest: () => dispatch(units.fetchRequest())
})
  
// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Container)
