import * as React from 'react'
import { Breadcrumbs, Col, List, Row } from "rivet-react";
import { IUserProfile } from "./store";
import PageTitle from '../layout/PageTitle';
import { Panel } from '../Panel';

const Presentation: React.SFC<IUserProfile> = (props) => {
    const user = props || {};
    // const department = props.department || null;
    const responsibilities = user.responsibilities || [];
    const tools = user.tools || [];
    const memberships = props.unitMemberships || [];
    return (<>
        <Row className="rvt-m-bottom-md rvt-m-left-sm">
            <Col>
                <Breadcrumbs>
                    <List variant="plain" orientation="inline">
                        <li><a href="/">Home</a></li>
                        <li><a href="/profiles">Profiles</a></li>
                        <li>{user.name}</li>
                    </List>
                </Breadcrumbs>
            </Col>
        </Row>
        <Row>
            <Col md={7} className="rvt-p-all-lg">
                <Panel title="Contact Information">
                    <Row>
                        {user.photoUrl &&
                            <Col md={4}>
                                <div style={{ borderRadius: "100%", overflow: "hidden", objectFit: 'cover' }}>
                                    <img src={user.photoUrl} alt={`${name}`} width={"100%"} style={{ borderRadius: "100%", overflow: "hidden", objectFit: 'cover' }} />
                                </div>
                            </Col>
                        }
                        <Col>
                            <PageTitle>{user.name}</PageTitle>
                            <div className="rvt-ts-26">{user.position}</div>

                            {/* {department &&
                            <div>
                                <a href={`/departments/${department.id}`}>{department.name}</a>
                                {department.description && <div>{department.description}</div>}
                            </div>
                        } */}
                            {user.location &&
                                <div>{user.location}</div>
                            }
                            {user.campus &&
                                <div>{user.campus}</div>
                            }
                            {user.campusEmail &&
                                <div><a href={`mailto:${user.campusEmail}`}>{user.campusEmail}</a></div>
                            }
                            {user.campusPhone &&
                                <div>{user.campusPhone}</div>
                            }
                        </Col>
                    </Row>
                </Panel>

                <div className="rvt-m-top-lg">
                    <Panel title="Personal Inforamtion">
                        {responsibilities.length &&
                            <Row>
                                <Col>
                                    <h2 className="rvt-ts-26">Responsibilities</h2>
                                    {responsibilities.map((r, i) => (<div key={i}>{r}</div>))}
                                </Col>
                            </Row>
                        }
                        {!!tools.length &&
                            <Row>
                                <Col>
                                    <h2 className="rvt-ts-26 rvt-m-top-md rvt-border-top rvt-p-top-md">Tools</h2>
                                    {tools.map((t, i) => (<div key={i}>{t}</div>))}
                                </Col>
                            </Row>
                        }
                        {user.expertise && user.expertise.length > 0 &&
                            <Row>
                                <Col>
                                    <h2 className="rvt-ts-26 rvt-m-top-md rvt-border-top rvt-p-top-md">Interests</h2>
                                    <List variant="plain">
                                        {user.expertise.map && user.expertise.map((e, i) => (
                                            <li key={i}>{e}</li>
                                        ))}
                                    </List>

                                </Col>
                            </Row>
                        }
                    </Panel>
                </div>
            </Col>
            <Col md={5} className="rvt-p-all-lg">
                {!!memberships.length &&
                    <>
                        <Panel title="IT Units">
                            <h2 className="rvt-ts-26 rvt-m-bottom-md">IT Units</h2>
                            {memberships.map((m, i) => {
                                return (
                                    <div key={i}>
                                        <div>
                                            <a href={`/units/${m.id}`}><h2 className="rvt-ts-23">{m.name}</h2></a>
                                            <div>{m.description}</div>
                                        </div>

                                        {m.title &&
                                            <div>
                                                <h3 className="rvt-ts-20 rvt-m-top-md rvt-border-top rvt-p-top-md">Title</h3>
                                                <div>{m.title}</div>
                                            </div>
                                        }

                                        {m.role &&
                                            <div>
                                                <h3 className="rvt-ts-20 rvt-m-top-md rvt-border-top rvt-p-top-md">Role</h3>
                                                <div>{m.role}</div>
                                            </div>
                                        }

                                        {tools && tools.length &&
                                            <>
                                                <h3 className="rvt-ts-20 rvt-m-top-md rvt-border-top rvt-p-top-md">Tools</h3>
                                                <List variant="plain">
                                                    {tools.map((t, i) => (
                                                        <li key={i}>{t}</li>
                                                    ))}
                                                </List>
                                            </>
                                        }
                                    </div>);
                            })
                            }
                        </Panel>
                    </>
                }
            </Col>
        </Row>
    </>)
}
export default Presentation
