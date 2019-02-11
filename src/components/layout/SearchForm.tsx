/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Field, InjectedFormProps, reduxForm } from "redux-form";
import { Form } from "rivet-react";
import { connect } from "react-redux";
import { submit as search } from "../Search/store";
import { Dispatch } from "redux";

interface IDispatchProps {
  search: typeof search;
}

interface IProps extends InjectedFormProps<{}>, IDispatchProps {}

const isSearchPage = () => {
  return window.location.pathname.indexOf("/search") != -1;
};
let form: React.SFC<IProps> = ({ search }) => (
  <Form label="Search" labelVisibility="screen-reader-only" action="/search" method="GET">
    <div className="rvt-input-group">
      <Field
        type="text"
        name="term"
        className="rvt-input-group__input"
        component={"input"}
        onChange={e => {
          if (isSearchPage() && e && e.target && e.target.value) {
            search(e.target.value);
          }
        }}
      />
      <div className="rvt-input-group__append">
        <button type="submit" aria-label="Submit search" className="rvt-button rvtd-search__submit">
          <span className="rvt-sr-only">Submit search</span>
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
            <path
              fill="currentColor"
              d="M15.71,14.29,10.89,9.47a6,6,0,1,0-1.42,1.42l4.82,4.82a1,1,0,0,0,1.42,0A1,1,0,0,0,15.71,14.29ZM6,10a4,4,0,1,1,4-4A4,4,0,0,1,6,10Z"
            />
          </svg>
        </button>
      </div>
    </div>
  </Form>
);

let SearchForm: any = reduxForm({ form: "search" })(form);

SearchForm = connect(
  undefined,
  (dispatch: Dispatch): IDispatchProps => {
    return {
      search: (q: string) => dispatch(search(q))
    };
  }
)(SearchForm);

connect();
export default SearchForm;
