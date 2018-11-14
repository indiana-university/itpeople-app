import * as React from 'react'
import { Col, List, Panel, Row, Section } from "rivet-react";
import { ChildrenCard, IUnitProfile, MemberLists, ParentCard } from "./index";

const Presentation: React.SFC<IUnitProfile> =
  (props) => {
    return (
      <>
        <p><a href={props.url}>Unit Website</a></p>
        <Row>
          <Col lg={7}>
            <Section>
              {props.description && 
                <div className="group-describer rvt-m-bottom-lg"><span>{props.description}</span></div>
              }
            
              <MemberLists {...props} title="Unit Members" />
            </Section>
          </Col>
          <Col lg={5}>
            {props.supportedDepartments.length > 0 &&
              <>
                <h2 className="rvt-ts-26 rvt-m-top-lg">Supported Departments</h2>
                <Panel margin={{ top: "xs" }}>
                  <List variant="plain">
                    {props.supportedDepartments.map((r, i) => (<li key={i}><a href={`/departments/${r.id}`}>{r.name}</a> ({r.description})</li>))}
                  </List>
                </Panel>
              </>
            }
            <ParentCard parent={props.parent} />
            <ChildrenCard children={props.children} />
          </Col>
        </Row>
      </>
    )
  }
export default Presentation
