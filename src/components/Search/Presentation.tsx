import * as React from "react";
import { Col, List, Row } from "rivet-react";
import { ISimpleSearchResult } from "./store";
import { Content, PageTitle, SearchForm } from "../layout";
import { ProfileList } from "../Profile/ProfileList";

const Presentation: React.SFC<ISimpleSearchResult> = props => (
  <>
    <div
      className="rvt-p-top-xl rvt-p-bottom-xl rvt-m-top-xxl rvt-m-bottom-xxl"
      style={{ backgroundColor: "#ffffff" }}
    >
      <Content>
        <Row>
          <Col lg={8} style={{ color: "#333" }}>
            <PageTitle>IT People</PageTitle>
            <p className="rvt-hide-md-down">
              Description of what IT People is and how to use it...Lorem ipsum
              dolor sit amet, usu an elit euismod pertinax, iudico ignota possit
              mei ei. Ius ad dicta praesent, malis liber nec ei. Adhuc novum
              ceteros sed ea, omnes possit graecis at eam. In pri aeterno
              delectus. Porro facer ad eum, vel vivendum lobortis praesent ei,
              mea at prompta numquam consulatu.
            </p>
          </Col>
        </Row>

        <Row>
          <Col className="rvt-m-top-lg">
            <SearchForm />
          </Col>
        </Row>
      </Content>
    </div>

    <div
      className="rvt-p-top-xl rvt-p-bottom-xl rvt-m-top-xxl rvt-m-bottom-xxl"
      style={{ backgroundColor: "#ffffff" }}
    >
      <Content>
        <Row>
          {props.users.length > 0 && (
            <Col lg={4}>
              <h2 className="rvt-ts-26 rvt-m-top-lg">People</h2>
              <ProfileList users={props.users} />
            </Col>
          )}
          {props.units.length > 0 && (
            <Col lg={4}>
              <h2 className="rvt-ts-26 rvt-m-top-lg">Units</h2>
              <List variant="plain" className="list-stripes">
                {props.units.map((r, i) => (
                  <li key={i} className="rvt-p-all-lg">
                    <a href={`/units/${r.id}`}>{r.name}</a>
                  </li>
                ))}
              </List>
            </Col>
          )}
          {props.departments.length > 0 && (
            <Col lg={4}>
              <h2 className="rvt-ts-26 rvt-m-top-lg">Departments</h2>
              <List variant="plain" className="list-stripes">
                {props.departments.map((r, i) => (
                  <li className="rvt-p-all-lg">
                    <a href={`/departments/${r.id}`}>
                      {r.name}
                      {r.description && ` (${r.description})`}
                    </a>
                  </li>
                ))}
              </List>
            </Col>
          )}
        </Row>
      </Content>
    </div>
  </>
);
export default Presentation;
