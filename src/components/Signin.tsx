
import * as queryString from 'query-string' 
import * as React from 'react';
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { IApplicationState  } from '../store'
import * as Auth from '../store/auth'

interface ILocationProps {
    search: string;
}
interface ISigninProps {
    location: ILocationProps
}
interface IPropsFromDispatch {
    postSignInRequest: typeof Auth.postSignInRequest
}

class Signin extends React.Component<Auth.IState & ISigninProps & IPropsFromDispatch> {

    public componentDidMount() {
        const queryParam = queryString.parse(this.props.location.search)
        this.props.postSignInRequest({ code: queryParam.code })
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
  
export default connect<Auth.IState, IPropsFromDispatch>(
    mapStateToProps,
    mapDispatchToProps
  )(Signin)
