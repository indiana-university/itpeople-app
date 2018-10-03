import * as React from 'react';
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Container, Footer, Header, HeaderIdentity, HeaderNavigation } from 'rivet-react';
import { IApplicationState  } from '../../store'
import * as Auth from '../../store/auth'
// import { simpleSearchFetchRequest } from '../../store/search';

export interface IPageProps {
    children?: React.ReactNode
    user?: Auth.IAuthUser
}

// We can use `typeof` here to map our dispatch types to the props, like so.
interface IPropsFromDispatch {
  signInRequest: typeof Auth.signInRequest
  signOutRequest: typeof Auth.signOutRequest
  // search: typeof simpleSearchFetchRequest
}

const Page: React.SFC<IPageProps & IPropsFromDispatch> = ({ user, signInRequest, signOutRequest, children }) => (
  <>
    <Header title="IT Pro Database">
      { user &&
        <HeaderNavigation>
          <a href="/units">Units</a>
          <a href="/orgs">Departments</a>
        </HeaderNavigation>
      }
      { user &&
        <HeaderIdentity username={user.user_name} onLogout={signOutRequest}>
          <a href="/me">Profile</a>
        </HeaderIdentity>
      }
      { !user &&
        <HeaderNavigation>
          <a href="#" onClick={signInRequest}>Log In</a>
        </HeaderNavigation>
      }
    </Header>
    <main id="main-content" className="rvt-m-top-xl rvt-m-bottom-xxl" style={{ flex: 1 }}>
      <Container>
        { children }
      </Container>
    </main>
    <Footer />
  </>
);

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ auth }: IApplicationState) => ({
  user: auth.data
})

// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = (dispatch: Dispatch) : IPropsFromDispatch => ({
  signInRequest: () => dispatch(Auth.signInRequest()),
  signOutRequest: () => dispatch(Auth.signOutRequest()),
  // simpleSearch: () => dispatch(simpleSearchFetchRequest())
})

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page)

