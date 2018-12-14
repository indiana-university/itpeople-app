/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */


import * as React from 'react';
import Helmet from 'react-helmet';

interface IPageTitleProps {
    children: string
}

const PageTitle : React.SFC<IPageTitleProps> = ({ children, ...attrs }) => (
  <>
    <Helmet><title>{children} - IT Pro Database - Indiana University</title></Helmet>
    <h1 {...attrs} className="rvt-ts-32 rvt-ts-41-lg-up rvt-text-bold">{children}</h1>
  </>
);

PageTitle.displayName = 'PageTitle';

export default PageTitle;
