import * as React from "react";
import { Col, List, Row } from "rivet-react";
import { IUserProfile } from "./store";
import PageTitle from "../layout/PageTitle";
import { Panel } from "../Panel";
import { Breadcrumbs, Content } from "../layout";
import { Chevron } from "../icons";

const Presentation: React.SFC<IUserProfile & IProps> = props => {
  const user = props || {};
  // const responsibilities = user.responsibilities || [];
  // const tools = user.tools || [];
  const memberships = props.unitMemberships || [];
  const toggleUnit = props.toggleUnit;
  const visuallyExpandedUnits: Array<number> =
    props.visuallyExpandedUnits || [];
  return (
    <>
      <Breadcrumbs
        crumbs={[{ text: "Home", href: "/" }, "Profiles", user.name]}
      />
      <Content>
        <div className="rvt-bg-white">
          {user.photoUrl && (
            <Row
              style={{
                justifyContent: "center",
                marginTop: "14em",
                marginBottom: "-1em"
              }}
              className="rvt-p-lr-md"
            >
              <Col md={4} lg={3} style={{ marginTop: "-10em" }}>
                <div
                  style={{
                    borderRadius: "100%",
                    overflow: "hidden",
                    objectFit: "cover"
                  }}
                >
                  <img
                    src={user.photoUrl}
                    alt={`${name}`}
                    width={"100%"}
                    style={{
                      borderRadius: "100%",
                      overflow: "hidden",
                      objectFit: "cover"
                    }}
                  />
                </div>
              </Col>
            </Row>
          )}

          <Row style={{ justifyContent: "center" }}>
            <Col md={9} className="rvt-text-center rvt-m-top-md">
              <PageTitle>{user.name}</PageTitle>
              <div className="rvt-ts-26">{user.position}</div>
              {/* {user.location && <div>{user.location}</div>}
              {user.campus && <div>{user.campus}</div>}
              {user.campusEmail && (
                <div>
                  <a href={`mailto:${user.campusEmail}`}>{user.campusEmail}</a>
                </div>
              )}
              {user.campusPhone && <div>{user.campusPhone}</div>} */}
            </Col>
          </Row>
        </div>
      </Content>

      <Content className="rvt-bg-white">
        <Row className="rvt-p-top-lg">
          <Col md={6} className="rvt-p-all-lg">
            <Panel title="Contact Information">
            {user.location && 
                <div>
                  <strong>Location: </strong> 
                  {user.location}
                </div>}
              {user.campus && 
                <div>
                  <strong>Campus: </strong> 
                  {user.campus}
                </div>}
              {user.campusEmail && 
                <div>
                  <strong>Email: </strong> 
                  <a href={`mailto:${user.campusEmail}`}>{user.campusEmail}</a>
                </div>
              }
              {user.campusPhone && 
                <div>
                  <strong>Phone: </strong> 
                  {user.campusPhone}
                </div>}
              {/* <div className="list-dividers">
                {responsibilities.length > 0 && (
                  <div>
                    <h2 className="rvt-ts-23 rvt-text-bold">
                      Responsibilities
                    </h2>
                    <List variant="plain">
                      {responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </List>
                  </div>
                )}
                {tools.length > 0 && (
                  <div>
                    <h2 className="rvt-ts-23 rvt-text-bold">Tools</h2>
                    <List variant="plain">
                      {tools.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </List>
                  </div>
                )}
                {user.expertise && user.expertise.length > 0 && (
                  <div>
                    <h2 className="rvt-ts-23 rvt-text-bold">Interests</h2>
                    <List variant="plain">
                      {user.expertise.map &&
                        user.expertise.map((e, i) => <li key={i}>{e}</li>)}
                    </List>
                  </div>
                )}
              </div> */}
            </Panel>
          </Col>
          <Col md={6} className="rvt-p-all-lg">
            {!!memberships.length && (
              <Panel title="IT Units">
                <div className="list-dividers profile-units">
                  {memberships.map((m, i) => {
                    const isExpanded = visuallyExpandedUnits.indexOf(m.id) > -1;
                    const toggle = () => {
                      toggleUnit(m.id);
                    };
                    return (
                      <div key={i + "-profile-unit"}>
                        <Row>
                          <Col>
                            <a href={`/units/${m.id}`}>
                              <h2 className="rvt-ts-23 rvt-text-bold">
                                {m.name}
                              </h2>
                            </a>
                            {m.description && (
                              <div className="rvt-m-bottom-sm">
                                {m.description}
                              </div>
                            )}
                          </Col>
                          <Col sm={1}>
                            <button
                              className={
                                "rvt-button--plain" +
                                (isExpanded ? " expanded" : "")
                              }
                              onClick={toggle}
                              style={{ position: "absolute", right: 0 }}
                            >
                              <span className="sr-only">Toggle</span>
                              <Chevron />
                            </button>
                          </Col>
                        </Row>
                        {isExpanded && (
                          <Row>
                            <Col>
                              {m.title && (
                                <div className="rvt-m-top-sm">
                                  <span className="rvt-text-bold">Title: </span>
                                  {m.title}
                                </div>
                              )}

                              {m.role && (
                                <div className="rvt-m-top-sm">
                                  <span className="rvt-text-bold">Role: </span>
                                  {m.role}
                                </div>
                              )}
                              {m.tools && m.tools.length > 0 && (
                                <div className="rvt-m-top-sm">
                                  <h3 className="rvt-ts-16 rvt-text-bold">
                                    Tools
                                  </h3>
                                  <List variant="plain">
                                    {m.tools.map((t, i) => (
                                      <li key={i}>{t}</li>
                                    ))}
                                  </List>
                                </div>
                              )}
                            </Col>
                          </Row>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Panel>
            )}
          </Col>
        </Row>
      </Content>
    </>
  );
};

interface IProps {
  toggleUnit(id: number): void;
}
export default Presentation;
