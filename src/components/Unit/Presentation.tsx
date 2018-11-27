import * as React from 'react'
import { Col, List, Row, Section } from "rivet-react";
import { ChildrenCard, IUnitProfile, MemberLists, ParentCard } from "./index";
import { Panel } from "../Panel";
import PageTitle from '../layout/PageTitle';

const Presentation: React.SFC<IUnitProfile> =
  (props) => {
    return (
      <>
        <PageTitle>{props.name}</PageTitle>
        <Row>
          <Col lg={6}>
            <Section className="rvt-m-bottom-xl rvt-p-bottom-xl">
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
          <Col lg={5} last={true}>
            <div className="rvt-m-all-md">
              {(props.parent || props.children) &&
                <div className="rvt-m-bottom-lg">
                  <Panel title="Parent and Children">
                    <ParentCard parent={props.parent} />
                    <ChildrenCard children={props.children} />
                  </Panel>
                </div>

              }
              {props.supportedDepartments.length > 0 &&
                <Panel title="Supported Departments">
                  <List variant="plain">
                    {props.supportedDepartments.map((r, i) => (<li key={i}><a href={`/departments/${r.id}`}>{r.name}</a> <br /> {r.description}</li>))}
                  </List>
                </Panel>
              }
            </div>
          </Col>
        </Row>
      </>
    )
  }
export default Presentation
