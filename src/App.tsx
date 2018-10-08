import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import DepartmentContainer from './components/DepartmentContainer';
import DepartmentsContainer from './components/DepartmentsContainer';
import Home from './components/Home';
import Page from './components/layout/Page';
import ProfileContainer from './components/ProfileContainer';
import Signin from './components/Signin';
import SimpleSearchContainer from "./components/SimpleSearchContainer";
import UnitContainer from "./components/UnitContainer";
import UnitsContainer from "./components/UnitsContainer";

const App : React.SFC = () => (
  <Page>
    <Switch>
      <Route path="/" exact={true} component={Home} />
      <Route path="/signin" component={Signin} />
      <Route path="/profiles/:id" component={ProfileContainer} /> 
      <Route path="/me" component={ProfileContainer} /> 
      <Route path="/search" component={SimpleSearchContainer} /> 
      <Route path="/departments/:id" component={DepartmentContainer} /> 
      <Route path="/departments" component={DepartmentsContainer} /> 
      <Route path="/units/:id" component={UnitContainer} /> 
      <Route path="/units" component={UnitsContainer} /> 
    </Switch>
  </Page>
)

export default App;
