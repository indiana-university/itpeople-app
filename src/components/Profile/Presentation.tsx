import * as React from 'react'
import { Breadcrumbs, Col, List, Row } from "rivet-react";
import { IUserProfile } from "./store";
import PageTitle from '../layout/PageTitle';

const Presentation: React.SFC<IUserProfile> = (props) => {
    const user = props.user || {};
    // const department = props.department || null;
    const responsibilities = user.responsibilities || [];
    const tools = user.tools || [];
    const memberships = props.unitMemberships || [];
    return (<>
        <Row className="rvt-m-bottom-md">
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
            <Col>
                <Row>
                    {user.photoUrl &&
                        <Col md={4}>
                            <div style={{ borderRadius: "100%", overflow: "hidden" }}>
                                <img src={user.photoUrl} alt={`${name}`} width={"100%"} />
                            </div>
                        </Col>
                    }
                    <Col>
                        <PageTitle>{user.name}</PageTitle>
                        <div className="rvt-ts-26">{user.position}</div>

                        {user.role &&
                            <div>{user.role}</div>
                        }
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
                {responsibilities.length &&
                    <Row>
                        <Col>
                            <h2 className="rvt-ts-26 rvt-m-top-lg">Responsibilities</h2>
                            {responsibilities.map((r, i) => (<div key={i}>{r}</div>))}
                        </Col>
                    </Row>
                }
                {!!tools.length &&
                    <Row>
                        <Col>
                            <h2 className="rvt-ts-26 rvt-m-top-lg">Tools</h2>
                            {tools.map((t, i) => (<div key={i}>{t}</div>))}
                        </Col>
                    </Row>
                }
                {user.expertise &&
                    <Row>
                        <Col>
                            <h2 className="rvt-ts-26 rvt-m-top-lg">Interests</h2>
                            {user.expertise}
                        </Col>
                    </Row>
                }

            </Col>
            <Col md={5}>
                {!!memberships.length &&
                    <Row>
                        <Col>
                            <h2 className="rvt-ts-26 rvt-m-top-lg">Units</h2>
                            <List variant="plain">
                                {memberships.map((u, i) => (<li key={i}><a href={`/units/${u.id}`}>{u.name}</a></li>))}
                            </List>
                        </Col>
                    </Row>
                }
            </Col>
        </Row>
    </>)
}
export default Presentation
