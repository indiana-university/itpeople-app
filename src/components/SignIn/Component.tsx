/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */


import * as queryString from 'query-string' 
import * as React from 'react';
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { IApplicationState, IAuthRequest } from '../types';
import { postSignInRequest, IState } from './store';
import { ErrorMessage } from '../ErrorMessage';

interface ILocationProps {
    search: string;
}
interface IComponentProps {
    location: ILocationProps
}
interface IDispatchProps {
    postSignInRequest: typeof postSignInRequest
}

class Component extends React.Component<IState & IComponentProps & IDispatchProps> {

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
                      <ErrorMessage error={this.props.error}>Failed to log in 😟 </ErrorMessage>
                  </div> }
            </>
        )
    };
}

const mapStateToProps = (state: IApplicationState) => 
    state.auth
  
const mapDispatchToProps = (dispatch: Dispatch) => ({
    postSignInRequest: (request:IAuthRequest) => dispatch(postSignInRequest(request))
})
  
export default connect<IState, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps
  )(Component)
