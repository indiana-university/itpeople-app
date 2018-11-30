import * as React from "react";
import { Row, Col } from "rivet-react";
import { IDepartmentProfile } from "./store";
import PageTitle from "../layout/PageTitle";
import { Panel } from "../Panel";
import { MemberList } from "./MemberList";
import { List } from "rivet-react/build/dist/components/List/List";
import { Breadcrumbs, Content } from "../layout";

const Presentation: React.SFC<IDepartmentProfile> = props => {
  const name = props.name;
  const description = props.description;
  const members = props.members || [];
  const units = props.units || [];
  const supportingUnits = props.supportingUnits || [];
  return (
    <>
      <Breadcrumbs
        crumbs={[{ text: "Home", href: "/" }, "Departments", name]}
      />

      <Content className="rvt-bg-white rvt-m-tb-xl rvt-p-tb-xl">
        <Row>
          <Col>
            <div className="rvt-m-bottom-xxl">
              <PageTitle>{name}</PageTitle>
              {description && <p>{description}</p>}
            </div>
          </Col>
        </Row>
      </Content>
      <Content className="rvt-bg-white rvt-m-tb-xl rvt-p-tb-xl">
        <Row>
          <Col>
            {members && members.length > 0 && (
              <div>
                <MemberList members={members} title="IT Professional Staff" />
              </div>
            )}
          </Col>
          <Col md={5} last={true}>
            {units.length > 0 && (
              <div className="rvt-m-bottom-xl">
                <Panel title="Constituent Units">
                  <List variant="plain">
                    {units.map((r, i) => (
                      <li key={i}>
                        <a href={`/units/${r.id}`}>{r.name}</a>
                        {r.description && <p>{r.description}</p>}
                      </li>
                    ))}
                  </List>
                </Panel>
              </div>
            )}

            {supportingUnits.length > 0 && (
              <Panel title="Supporting Units">
                <List variant="plain">
                  {supportingUnits.map((r, i) => (
                    <li key={i}>
                      <a href={`/units/${r.id}`}>{r.name}</a>
                      {r.description && <p>{r.description}</p>}
                    </li>
                  ))}
                </List>
              </Panel>
            )}
          </Col>
        </Row>
      </Content>
    </>
  );
};
export default Presentation;
