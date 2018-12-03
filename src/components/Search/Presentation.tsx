import * as React from "react";
import { Col, Row } from "rivet-react";
import { ISimpleSearchResult } from "./store";
import { Content, PageTitle, SearchForm } from "../layout";
import { Results, SearchLists } from "./Results";

const Presentation: React.SFC<ISimpleSearchResult & IProps> = ({
  selectedList,
  departments,
  setCurrentList,
  submitSearch,
  units,
  users
}) => (
  <>
    <Content className="rvt-p-top-xl rvt-bg-white rvt-p-bottom-xl rvt-m-top-xxl rvt-m-bottom-xxl">
      <Row>
        <Col lg={8} style={{ color: "#333" }}>
          <PageTitle>IT People</PageTitle>
          <p className="rvt-hide-md-down">
            Description of what IT People is and how to use it...Lorem ipsum
            dolor sit amet, usu an elit euismod pertinax, iudico ignota possit
            mei ei. Ius ad dicta praesent, malis liber nec ei. Adhuc novum
            ceteros sed ea, omnes possit graecis at eam. In pri aeterno
            delectus. Porro facer ad eum, vel vivendum lobortis praesent ei, mea
            at prompta numquam consulatu.
          </p>
        </Col>
      </Row>

      <Row>
        <Col className="rvt-m-top-lg">
          <SearchForm onSubmit={submitSearch} />
        </Col>
      </Row>
    </Content>

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
  submitSearch?: any;
  setCurrentList(list: any): void;
}

export default Presentation;
