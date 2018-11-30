import * as React from "react";
import { Breadcrumbs, Col, List, Row } from "rivet-react";
import { IUserProfile } from "./store";
import PageTitle from "../layout/PageTitle";
import { Panel } from "../Panel";
import { Content } from "../layout/Content";

const Presentation: React.SFC<IUserProfile> = props => {
  const user = props || {};
  const responsibilities = user.responsibilities || [];
  const tools = user.tools || [];
  const memberships = props.unitMemberships || [];
  return (
    <>
      <Content>
        <Row className="rvt-m-bottom-md rvt-m-left-sm">
          <Col>
            <Breadcrumbs>
              <List variant="plain" orientation="inline">
                <li>
                  <a href="/">Home</a>
                </li>
                <li>Profiles</li>
                <li>{user.name}</li>
              </List>
            </Breadcrumbs>
          </Col>
        </Row>
      </Content>

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
              {user.location && <div>{user.location}</div>}
              {user.campus && <div>{user.campus}</div>}
              {user.campusEmail && (
                <div>
                  <a href={`mailto:${user.campusEmail}`}>{user.campusEmail}</a>
                </div>
              )}
              {user.campusPhone && <div>{user.campusPhone}</div>}
            </Col>
          </Row>
        </div>
      </Content>

      <div className="rvt-bg-white">
        <Content>
          <Row className="rvt-p-top-lg">
            <Col md={6} className="rvt-p-all-lg">
              <Panel title="Personal Information">
                {responsibilities.length && (
                  <Row>
                    <Col>
                      <h2 className="rvt-ts-23 rvt-text-bold">
                        Responsibilities
                      </h2>
                      <List variant="plain">
                        {responsibilities.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </List>
                    </Col>
                  </Row>
                )}
                {!!tools.length && (
                  <Row>
                    <Col>
                      <h2 className="rvt-ts-23 rvt-text-bold rvt-m-top-md rvt-border-top rvt-p-top-md">
                        Tools
                      </h2>
                      <List variant="plain">
                        {tools.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </List>
                    </Col>
                  </Row>
                )}
                {user.expertise && user.expertise.length > 0 && (
                  <Row>
                    <Col>
                      <h2 className="rvt-ts-23 rvt-text-bold rvt-m-top-md rvt-border-top rvt-p-top-md">
                        Interests
                      </h2>
                      <List variant="plain">
                        {user.expertise.map &&
                          user.expertise.map((e, i) => <li key={i}>{e}</li>)}
                      </List>
                    </Col>
                  </Row>
                )}
              </Panel>
            </Col>
            <Col md={6} className="rvt-p-all-lg">
              {!!memberships.length && (
                <>
                  <Panel title="IT Units">
                    {memberships.map((m, i) => {
                      return (
                        <div key={i}>
                          <div>
                            <a href={`/units/${m.id}`}>
                              <h2 className="rvt-ts-23 rvt-text-bold">
                                {m.name}
                              </h2>
                            </a>
                            <div>{m.description}</div>
                          </div>

                          {m.title && (
                            <div>
                              <h3 className="rvt-ts-20 rvt-text-bold rvt-m-top-md rvt-border-top rvt-p-top-md">
                                Title
                              </h3>
                              <div>{m.title}</div>
                            </div>
                          )}

                          {m.role && (
                            <div>
                              <h3 className="rvt-ts-20 rvt-text-bold rvt-m-top-md rvt-border-top rvt-p-top-md">
                                Role
                              </h3>
                              <div>{m.role}</div>
                            </div>
                          )}

                          {tools && tools.length && (
                            <>
                              <h3 className="rvt-ts-20 rvt-text-bold rvt-m-top-md rvt-border-top rvt-p-top-md">
                                Tools
                              </h3>
                              <List variant="plain">
                                {tools.map((t, i) => (
                                  <li key={i}>{t}</li>
                                ))}
                              </List>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </Panel>
                </>
              )}
            </Col>
          </Row>
        </Content>
      </div>
    </>
  );
};
export default Presentation;
