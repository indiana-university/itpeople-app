import * as React from 'react'
import { Col, List, Panel, Row } from "rivet-react";
import { ISimpleSearchResult } from "../store/searchSimple";

const SimpleSearch: React.SFC<ISimpleSearchResult> =
    (props) => (
        <Row>
            {props.users.length > 0 &&
                <Col lg={4}>
                    <h2 className="rvt-ts-26 rvt-m-top-lg">People</h2>
                    <Panel margin={{ top: "xs" }}>
                        <List variant="plain">
                            {props.users.map((r, i) => (<li key={i}><a href={`/profiles/${r.id}`}>{r.name}</a></li>))}
                        </List>
                    </Panel>
                </Col>
            }
            {props.units.length > 0 &&
                <Col lg={4}>
                    <h2 className="rvt-ts-26 rvt-m-top-lg">Units</h2>
                    <Panel margin={{ top: "xs" }}>
                        <List variant="plain">
                            {props.units.map((r, i) => (<li key={i}><a href={`/units/${r.id}`}>{r.name}</a></li>))}
                        </List>
                    </Panel>
                </Col>
            }
            {props.departments.length > 0 &&
                <Col lg={4}>
                    <h2 className="rvt-ts-26 rvt-m-top-lg">Departments</h2>
                    <Panel margin={{ top: "xs" }}>
                        <List variant="plain">
                            {props.departments.map((r, i) => (<li key={i}><a href={`/departments/${r.id}`}>{r.name}{r.description && ` (${r.description})`}</a></li>))}
                        </List>
                    </Panel>
                </Col>
            }
        </Row>
    )
export default SimpleSearch
