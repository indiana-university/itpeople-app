import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IApplicationState } from '../store';
import * as Profile from '../store/profile';
import PageTitle from './layout/PageTitle';
// import ProfileForm from './ProfileForm';
import ReadOnlyProfile from './ReadOnlyProfile';

interface IProfileProps {
    match: any,
    path: string
}
// We can use `typeof` here to map our dispatch types to the props, like so.
interface IPropsFromDispatch {
    profileFetchRequest: typeof Profile.fetchRequest,
    profileUpdateRequest: typeof Profile.updateRequest
}

// tslint:disable-next-line:max-classes-per-file
class ProfileContainer extends React.Component<Profile.IState & IProfileProps & IPropsFromDispatch>{

    public isMyProfile() {
        return this.props.match.params.id === undefined
    }

    public componentDidMount() {
        console.log(this.props.match.params)
        const id = this.isMyProfile() ? 0 : Number(this.props.match.params.id)
        console.log(id)
        this.props.profileFetchRequest({ id })
    }

    public render() {
        return (
            <>
                <PageTitle>Profile</PageTitle>
                { this.props.loading && 
                    <p>Loading profile...</p>}
                { this.props.data && 
                    <ReadOnlyProfile  {...this.props.data} /> }
                { this.props.error && 
                    <p>{this.props.error}</p> }
            </>
        )
    }
}

// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = (state: IApplicationState) => ({
    ...state.profile
  })
  
  // mapDispatchToProps is especially useful for constraining our actions to the connected component.
  // You can access these via `this.props`.
  const mapDispatchToProps = (dispatch: Dispatch) : IPropsFromDispatch => ({
    profileFetchRequest: (request: Profile.IFetchRequest) => dispatch(Profile.fetchRequest(request)),
    profileUpdateRequest: (request: Profile.IFetchRequest) => dispatch(Profile.updateRequest(request))
  })
  
// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(ProfileContainer)
