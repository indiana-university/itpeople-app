import * as React from "react";
import { Breadcrumbs, Content } from "src/components/layout";
import { Row, Col } from "rivet-react";
import { Loader } from "src/components/Loader";
import { IState } from "../store";
import { UnitList, Profile } from ".";

export const View: React.SFC<IState> = ({ profile, constituentUnits, supportingUnits }) => (
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
            {supportingUnits.data && <UnitList units={supportingUnits.data} title="Supporting Units" />}
          </Loader>
        </Col>
        <Col md={6} last={true} className="rvt-p-lr-md">
          <Loader {...constituentUnits}>
            {constituentUnits.data && <UnitList units={constituentUnits.data} title="Constituent Units"/>}
          </Loader>
        </Col>
      </Row>
    </Content>
  </>
);
