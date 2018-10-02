import * as queryString from 'query-string' 
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IApplicationState } from '../store';
import * as searchSimple from '../store/searchSimple';
import PageTitle from './layout/PageTitle';
import SimpleSearch from './SimpleSearch';

interface ILocationProps {
    search: string;
}

interface ISearchProps {
    location: ILocationProps
}

// We can use `typeof` here to map our dispatch types to the props, like so.
interface IPropsFromDispatch {
    searchRequest: typeof searchSimple.fetchRequest
}

// tslint:disable-next-line:max-classes-per-file
class SimpleSearchContainer extends React.Component<searchSimple.IState & ISearchProps & IPropsFromDispatch>{
    public componentDidMount() {
        const queryParam = queryString.parse(this.props.location.search)
        this.props.searchRequest({ term: queryParam.term })
    }

    public render() {
        return (
            <>
                <PageTitle>Search Results</PageTitle>
                { this.props.loading && 
                    <p>Searching...</p>}
                { this.props.data && 
                    <SimpleSearch {...this.props.data} /> }
                { this.props.error && 
                    <p>{this.props.error}</p> }
            </>
        )
    }
}

// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = (state: IApplicationState) => ({
  ...state.searchSimple
})
  
// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = (dispatch: Dispatch) : IPropsFromDispatch => ({
  searchRequest: (request: searchSimple.ISimpleSearchRequest) => dispatch(searchSimple.fetchRequest(request))
})
  
// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(SimpleSearchContainer)
