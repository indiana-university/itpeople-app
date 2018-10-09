import * as React from 'react'
import { Col, List, Panel, Row } from "rivet-react";
import { IUnitFetchResult } from "../store/unit";

const Unit: React.SFC<IUnitFetchResult> =
    (props) => (
        <>
            <Row>
                <Col lg={6}>
                    <h2 className="rvt-ts-20 rvt-m-top-lg">People</h2>
                    <Panel margin={{ top: "xs" }}>
                        {props.admins.length > 0 &&
                            <>
                                <h3 className="rvt-ts-20">IT Leadership</h3>
                                <List variant="plain">
                                    {props.admins.filter(r => r.role === 4).map((r, i) => (<li key={i}><a href={`/profiles/${r.id}`}>{r.name}</a> (Admin)</li>))}
                                    {props.admins.filter(r => r.role === 3).map((r, i) => (<li key={i}><a href={`/profiles/${r.id}`}>{r.name}</a> (Co-Admin)</li>))}
                                </List>
                            </>
                        }
                        {props.itPros.length > 0 &&
                            <>
                                <h3 className="rvt-ts-20 rvt-m-top-lg">IT Professionals</h3>
                                <List variant="plain">
                                    {props.itPros.map((r, i) => (<li key={i}><a href={`/profiles/${r.id}`}>{r.name}</a></li>))}
                                </List>
                            </>
                        }
                        {props.selfs.length > 0 && 
                            <>
                                <h3 className="rvt-ts-20 rvt-m-top-lg">Self-Supporting</h3>
                                <List variant="plain">
                                    {props.selfs.map((r, i) => (<li key={i}><a href={`/profiles/${r.id}`}>{r.name}</a></li>))}
                                </List>
                            </>
                        }
                    </Panel>
                </Col>
                <Col lg={6}>
                    {props.supportedDepartments && 
                        <>
                            <h2 className="rvt-ts-20 rvt-m-top-lg">Supported Departments</h2>
                            <Panel margin={{ top: "xs" }}>
                                <List variant="plain">
                                    {props.supportedDepartments.map((r, i) => (<li key={i}><a href={`/departments/${r.id}`}>{r.name}</a> ({r.description})</li>))}
                                </List>
                            </Panel>
                        </>
                    }
                </Col>
            </Row>
        </>
    )
export default Unit
