import * as React from 'react'
import { Col, List, Panel, Row } from "rivet-react";
import { IUnitFetchResult } from "../store/unit";

const Unit: React.SFC<IUnitFetchResult> =
    (props) => (
        <>
            <Row>
                <Col lg={4}>
                    {props.admins &&
                        <>
                            <h2 className="rvt-ts-20 rvt-m-top-lg">Administrators</h2>
                            <Panel margin={{ top: "xs" }}>
                                <List variant="plain">
                                    {props.admins.map((r, i) => (<li key={i}><a href={`/profiles/${r.id}`}>{r.name}</a></li>))}
                                </List>
                            </Panel>
                        </>
                    }
                </Col>
                <Col lg={4}>
                    {props.itPros &&
                        <>
                            <h2 className="rvt-ts-20 rvt-m-top-lg">IT Professionals</h2>
                            <Panel margin={{ top: "xs" }}>
                                <List variant="plain">
                                    {props.itPros.map((r, i) => (<li key={i}><a href={`/profiles/${r.id}`}>{r.name}</a></li>))}
                                </List>
                            </Panel>
                        </>
                    }
                </Col>
                <Col lg={4}>
                    {props.selfs && 
                        <>
                            <h2 className="rvt-ts-20 rvt-m-top-lg">Self-Supporting</h2>
                            <Panel margin={{ top: "xs" }}>
                                <List variant="plain">
                                    {props.selfs.map((r, i) => (<li key={i}><a href={`/profiles/${r.id}`}>{r.name}</a></li>))}
                                </List>
                            </Panel>
                        </>
                    }
                </Col>
            </Row>
            <Row>
                <Col lg={4}>
                    {props.supportedDepartments && 
                        <>
                            <h2 className="rvt-ts-20 rvt-m-top-lg">Supported Departments</h2>
                            <Panel margin={{ top: "xs" }}>
                                <List variant="plain">
                                    {props.supportedDepartments.map((r, i) => (<li key={i}><a href={`/departments/${r.id}`}>{r.name}</a></li>))}
                                </List>
                            </Panel>
                        </>
                    }
                </Col>
            </Row>
        </>
    )
export default Unit
