import * as React from 'react'
import { Col, List, Panel, Row } from "rivet-react";
import { IFetchResult } from "../store/department";

const Department: React.SFC<IFetchResult> =
    (props) => (
        <Row>
            {props.members.length > 0 &&
                <Col lg={4}>
                    <h2 className="rvt-ts-26 rvt-m-top-lg">IT Professional Staff</h2>
                    <Panel margin={{ top: "xs" }}>
                        <List variant="plain">
                            {props.members.map((r, i) => (<li key={i}><a href={`/profiles/${r.id}`}>{r.name}</a></li>))}
                        </List>
                    </Panel>
                </Col>
            }
            {props.units.length > 0 &&
                <Col lg={4}>
                    <h2 className="rvt-ts-26 rvt-m-top-lg">Constituent Units</h2>
                    <Panel margin={{ top: "xs" }}>
                        <List variant="plain">
                            {props.units.map((r, i) => (<li key={i}><a href={`/units/${r.id}`}>{r.name}</a></li>))}
                        </List>
                    </Panel>
                </Col>
            }
            {props.supportingUnits.length > 0 && 
                <Col lg={4}>
                    <h2 className="rvt-ts-26 rvt-m-top-lg">Supporting Units</h2>
                    <Panel margin={{ top: "xs" }}>
                        <List variant="plain">
                            {props.supportingUnits.map((r, i) => (<li key={i}><a href={`/units/${r.id}`}>{r.name}</a></li>))}
                        </List>
                    </Panel>
                </Col>
            }
        </Row>
    )
export default Department
