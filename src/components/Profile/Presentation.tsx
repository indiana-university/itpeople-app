import * as React from 'react'
import { Col, List, Row } from "rivet-react";
import { IUserProfile } from "./store";
import PageTitle from '../layout/PageTitle';

const Presentation: React.SFC<IUserProfile> = (props) => {
    const user = props.user || {};
    const department = props.department || null;
    const responsibilities = user.responsibilities || [];
    const tools = user.tools || [];
    const memberships = props.unitMemberships || [];
    return (<>
        <Row>
            <Col>
                <PageTitle>{user.name}</PageTitle>
                <div className="rvt-ts-26">{user.position}</div>

                {user.role &&
                    <div>{user.role}</div>
                }
                {department &&
                    <div><a href={`/departments/${department.id}`}>{department.name}</a> ({department.description})</div>
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
                {user.location &&
                    <div>{user.location}</div>
                }
                {user.expertise &&
                    <div>{user.expertise}</div>
                }

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
            <Col md={5}>
                <img src={user.photoUrl} width="100%" style={{maxWidth:500}}/>
            </Col>
        </Row>
    </>)
}
export default Presentation
