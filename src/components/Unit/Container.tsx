import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import PageTitle from '../layout/PageTitle';
import { IApplicationState } from '../types';
import Unit from './Presentation';
import * as unit from './store';

interface IContainerProps {
    match: any
}

// We can use `typeof` here to map our dispatch types to the props, like so.
interface IDispatchProps {
    fetchRequest: typeof unit.fetchRequest
}

// tslint:disable-next-line:max-classes-per-file
class Container extends React.Component<unit.IState & IContainerProps & IDispatchProps>{
    public componentDidMount() {
        console.log(this.props.match)
        this.props.fetchRequest(this.props.match.params)
    }

    public render() {
        return (
            <>
                {/* { this.props.loading && 
                    <p>Loading unit...</p>} */}
                { this.props.data &&
                    <>
                        <PageTitle>{this.props.data.unit.name}</PageTitle>
                        <Unit {...this.props.data} />
                    </> }
                { this.props.error && 
                    <p>{this.props.error}</p> }
            </>
        )
    }
}

// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = (state: IApplicationState) => ({
  ...state.unit
})
  
// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = (dispatch: Dispatch) : IDispatchProps => ({
  fetchRequest: (request: unit.IUnitRequest) => dispatch(unit.fetchRequest(request))
})
  
// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Container)
