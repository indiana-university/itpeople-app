import { mount } from 'enzyme';
import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

it('renders without crashing', () => {
  mount(
    <Router>
      <App />
    </Router>
  );
});

it('renders the home page by default', () => {
  const cut = mount(
    <Router>
      <App />
    </Router>
  );
  expect(cut.find("h1").text()).toBe("Home")
});
