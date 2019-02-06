/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { ISimpleSearchResult } from "./store";
import { Content } from "../layout";
import { Results, SearchLists } from "./Results";

const Presentation: React.SFC<ISimpleSearchResult & IProps> = ({
  selectedList,
  departments,
  setCurrentList,
  units,
  users
}) => (
  <>
    <Content className="rvt-p-top-xl rvt-bg-white rvt-p-bottom-xl rvt-m-top-xxl rvt-m-bottom-xxl">
      <Results
        users={users}
        departments={departments}
        units={units}
        selectedList={selectedList || SearchLists.People}
        setCurrentList={setCurrentList}
      />
    </Content>
  </>
);

interface IProps {
  setCurrentList(list: any): void;
}

export default Presentation;
