import * as React from 'react';
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Footer, Header, HeaderIdentity, HeaderNavigation } from 'rivet-react';
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
      { /* user &&
          <HeaderNavigation>
            <a href="#">Nav one</a>
            <HeaderMenu label="Nav two">
                <a href="#">Item one</a>
                <a href="#">Item two</a>
                <a href="#">Item three</a>
                <a href="#">Item four</a>
            </HeaderMenu>
            <React.Fragment>
              <label htmlFor="search" className="rvt-sr-only">Search</label>
              <div className="rvt-input-group">
                  <input className="rvt-input-group__input" type="text" id="search"/>
                  <div className="rvt-input-group__append">
                    <button type="submit" aria-label="Submit search" className="rvt-button rvtd-search__submit">
                      <span className="rvt-sr-only">Submit search</span> 
                      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M15.71,14.29,10.89,9.47a6,6,0,1,0-1.42,1.42l4.82,4.82a1,1,0,0,0,1.42,0A1,1,0,0,0,15.71,14.29ZM6,10a4,4,0,1,1,4-4A4,4,0,0,1,6,10Z"/>
                      </svg>
                    </button>
                  </div>
              </div>
            </React.Fragment>
          </HeaderNavigation>
      */ }
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
    <main id="main-content" className="rvt-m-top-xl rvt-m-left-xxl-md-up rvt-m-right-xxl-md-up rvt-m-bottom-xxl" style={{ flex: 1 }}>
      { children }
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

