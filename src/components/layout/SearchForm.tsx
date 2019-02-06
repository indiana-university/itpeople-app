/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from 'react'
import { Field,InjectedFormProps, reduxForm } from 'redux-form'
import { Form } from "rivet-react";

const SearchForm : React.SFC<InjectedFormProps<{}>> = ({ handleSubmit }) => 
    <Form  label="Search" labelVisibility="screen-reader-only" action="/search" method="GET">
        <div className="rvt-input-group">
            <Field type="text" name="term" className="rvt-input-group__input" component={"input"}/>        
            <div className="rvt-input-group__append">
                <button type="submit" aria-label="Submit search" className="rvt-button rvtd-search__submit">
                <span className="rvt-sr-only">Submit search</span> 
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                    <path fill="currentColor" d="M15.71,14.29,10.89,9.47a6,6,0,1,0-1.42,1.42l4.82,4.82a1,1,0,0,0,1.42,0A1,1,0,0,0,15.71,14.29ZM6,10a4,4,0,1,1,4-4A4,4,0,0,1,6,10Z"/>
                </svg>
                </button>
            </div>
        </div>
    </Form>

export default reduxForm({form:'search'})(SearchForm)
