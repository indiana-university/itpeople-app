import * as queryString from 'query-string' 
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import PageTitle from '../layout/PageTitle';
import { IApplicationState } from '../types';
import Search from './Presentation';
import { fetchRequest, ISimpleSearchRequest, IState } from './store';
import { Content } from '../layout/Content';

interface ILocationProps {
    search: string;
}

interface ISearchProps {
    location: ILocationProps
}

interface IPropsFromDispatch {
    searchRequest: typeof fetchRequest
}

interface ISimpleSearchContainerProps 
    extends IState, ISearchProps, IPropsFromDispatch {}
    
const executeSearch = (props: ISimpleSearchContainerProps) => {
    const queryParam = queryString.parse(props.location.search)
    props.searchRequest({ term: queryParam.term })   
}

class Container extends React.Component<ISimpleSearchContainerProps>{
    
    public componentDidMount() {
        executeSearch(this.props)
    }

    public componentWillReceiveProps(nextProps: ISimpleSearchContainerProps) {
        if (!this.props.location || this.props.location !== nextProps.location) {            
            executeSearch(nextProps)
        }
    }
    
    public render() {
        return (
            <Content>
                <PageTitle>Search Results</PageTitle>
                { this.props.loading && 
                    <p>Searching...</p>}
                { this.props.data &&  
                    <Search {...this.props.data} /> }
                { this.props.error && 
                    <p>{this.props.error}</p> }
            </Content>
        )
    }
}

const mapStateToProps = (state: IApplicationState) => 
    state.searchSimple
  
const mapDispatchToProps = (dispatch: Dispatch) : IPropsFromDispatch => ({
  searchRequest: (request: ISimpleSearchRequest) => dispatch(fetchRequest(request))
})
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Container)
