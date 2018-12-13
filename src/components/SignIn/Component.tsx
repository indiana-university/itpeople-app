
import * as queryString from 'query-string' 
import * as React from 'react';
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { IApplicationState } from '../types';
import * as Auth from './store'

interface ILocationProps {
    search: string;
}
interface IComponentProps {
    location: ILocationProps
}
interface IDispatchProps {
    postSignInRequest: typeof Auth.postSignInRequest
}

class Component extends React.Component<Auth.IState & IComponentProps & IDispatchProps> {

    public componentDidMount() {
        const code = queryString.parse(this.props.location.search).code
        const resolved = code && (Array.isArray(code)) ? code[0] : code;
        if (resolved) {
            this.props.postSignInRequest({ code: resolved })
        }
    }

    public render () {
        return (
            <>
                { this.props.loading &&
                  <p>Signing in...</p> }
                { !this.props.loading && this.props.error &&
                  <div>
                    <p>Errors: {this.props.error}</p> 
                  </div> }
            </>
        )
    };
}

const mapStateToProps = (state: IApplicationState) => 
    state.auth
  
const mapDispatchToProps = (dispatch: Dispatch) => ({
    postSignInRequest: (request:Auth.IAuthRequest) => dispatch(Auth.postSignInRequest(request))
})
  
export default connect<Auth.IState, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps
  )(Component)
