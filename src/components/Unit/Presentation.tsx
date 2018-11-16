import * as React from 'react'
import { Col, List, Panel, Row, Section } from "rivet-react";
import { ChildrenCard, IUnitProfile, MemberLists, ParentCard } from "./index";
import PageTitle from '../layout/PageTitle';

const Presentation: React.SFC<IUnitProfile> =
  (props) => {
    return (
      <>
        <PageTitle>{props.name}</PageTitle>
        <Row>
          <Col lg={7}>
            <Section className="rvt-m-bottom-md">
              {props.description &&
                <div className="group-describer rvt-m-bottom-md"><span>{props.description}</span></div>
              }
              {props.url &&
                <a href={props.url} className="rvt-button rvt-button--secondary">Unit Website</a>
              }
            </Section>
            <Section>
              <MemberLists {...props} />
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
