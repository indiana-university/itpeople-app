import * as React from "react";
import { Breadcrumbs, Content } from "src/components/layout";
import { Row, Col, List } from "rivet-react";
import { Loader } from "src/components/Loader";
import { IState } from "../store";
import { Profile } from ".";
import { Panel } from "src/components/Panel";

export const View: React.SFC<IState> = ({ profile, memberUnits, supportingUnits }) => {
  return <>
    <Breadcrumbs crumbs={[{ text: "Home", href: "/" }, "Departments", profile && profile.data ? profile.data.name : "..."]} />
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
            <div className="rvt-m-bottom-xl">
              <Panel title="Supporting Units">
                  { supportingUnits && supportingUnits.data && supportingUnits.data.length !== 0 &&
                    <List variant="plain">
                      {supportingUnits.data.map((r, i) => 
                        <li key={"unit:" + i}>
                          <a href={`/units/${r.unit.id}`}>{r.unit.name}</a>
                            {r.supportType && (
                            <div>
                              <span style={{ fontSize: "smaller" }}>({r.supportType?.name})</span>
                            </div>
                            )}
                            {r.department.description && (   
                              <div>
                                <span>{r.department.description}</span>
                              </div>
                            )}
                        </li>)}
                    </List>
                    }
                  { 
                    !supportingUnits || !supportingUnits.data || supportingUnits.data.length === 0 && 
                      <p>No units found.</p> 
                  }
              </Panel>
              </div>
              {/* { supportingUnits.data && <UnitList units={supportingUnits.data.map(r => r.unit).filter(u => u)} title="Supporting Units" /> } */}
          </Loader>
        </Col>
      </Row>
    </Content>
  </>
};
