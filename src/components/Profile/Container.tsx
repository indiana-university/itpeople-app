import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import PageTitle from '../layout/PageTitle';
import { IApplicationState } from '../types';
import Profile from './Presentation';
import { fetchRequest, IState, IUserRequest, updateRequest } from './store';

interface IProfileProps {
    match: any,
    path: string
}
interface IPropsFromDispatch {
    profileFetchRequest: typeof fetchRequest,
    profileUpdateRequest: typeof updateRequest
}

const prettyPrintName = (name: string) => {
    const n = name.split(',')
    return `${n[1]} ${n[0]}`
}

class Container extends React.Component<IState & IProfileProps & IPropsFromDispatch>{

    public isMyProfile() {
        return this.props.match.params.id === undefined
    }

    public componentDidMount() {
        const id = this.isMyProfile() ? 0 : Number(this.props.match.params.id)
        this.props.profileFetchRequest({ id })
    }

    public render() {
        return (
            <>
                {/* { this.props.loading && 
                    <p>Loading profile...</p>} */}
                { this.props.data && 
                  <>
                    <PageTitle>{prettyPrintName(this.props.data.user.name)}</PageTitle>
                    <Profile  {...this.props.data} />
                  </> 
                }
                { this.props.error && 
                    <p>{this.props.error}</p> }
            </>
        )
    }
}

const mapStateToProps = (state: IApplicationState) => 
    state.profile
  
const mapDispatchToProps = (dispatch: Dispatch) : IPropsFromDispatch => ({
    profileFetchRequest: (request: IUserRequest) => dispatch(fetchRequest(request)),
    profileUpdateRequest: (request: IUserRequest) => dispatch(updateRequest(request))
})
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Container)
