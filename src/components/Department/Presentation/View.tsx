import * as React from "react";
import { Breadcrumbs, Content } from "src/components/layout";
import { Row, Col } from "rivet-react";
import { Loader } from "src/components/Loader";
import { IState } from "../store";
import { UnitList, Profile } from ".";

export const View: React.SFC<IState> = ({ profile, memberUnits, supportingUnits }) => (
  <>
    <Breadcrumbs crumbs={[{ text: "Home", href: "/" }, "Departments", profile && profile.data ? profile.data.name: "loading..."]} />
    <Content className="rvt-bg-white rvt-m-tb-xl rvt-p-tb-xl">
      <Row>
        <Col>
          <Loader {...profile}>
            {profile.data && <Profile {...profile.data} />}
          </Loader>
        </Col>
      </Row>
    </Content>
    <Content className="rvt-bg-white rvt-m-tb-xl rvt-p-tb-xl">
      <Row>
        <Col md={6} className="rvt-p-lr-md">
          <Loader {...supportingUnits}>
            {supportingUnits.data && <UnitList units={supportingUnits.data.map(d => d.unit)} title="Supporting Units" />}
          </Loader>
        </Col>
        <Col md={6} last={true} className="rvt-p-lr-md">
          <Loader {...memberUnits}>
            {memberUnits.data && <UnitList units={memberUnits.data} title="Member Units"/>}
          </Loader>
        </Col>
      </Row>
    </Content>
  </>
);
