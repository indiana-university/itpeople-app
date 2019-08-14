import * as React from "react";
import { Breadcrumbs, Content } from "src/components/layout";
import { Row, Col } from "rivet-react";
import { Loader } from "src/components/Loader";
import { UnitList } from "src/components/Units/UnitList";
import { IState } from "../store";
import { Profile } from ".";

export const View: React.SFC<IState> = ({ profile, supportingUnits }) => (
  <>
    <Breadcrumbs crumbs={[{ text: "Home", href: "/" }, "Buildings", profile && profile.data ? profile.data.name : "..."]} />
    <Content className="rvt-bg-white rvt-m-tb-xl rvt-p-tb-xl">
      <Row>
        <Col>
          <Loader {...profile}>{profile.data && <Profile {...profile.data} />}</Loader>
        </Col>
      </Row>
    </Content>
    <Content className="rvt-bg-white rvt-m-tb-xl rvt-p-tb-xl">
      <Row>
        <Col md={6} className="rvt-p-lr-md">
          <Loader {...supportingUnits}>
            {supportingUnits.data && supportingUnits.data.length > 0 && (
              <UnitList units={supportingUnits.data.map(r => r.unit).filter(u => u)} title="Supporting Units" />
            )}
          </Loader>
        </Col>
      </Row>
    </Content>
  </>
);
