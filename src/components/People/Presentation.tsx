/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Col, Row, Panel } from "rivet-react";
import { CSVLink } from "react-csv";
import { EntityComparer, IAuthUser } from "../types";
import { Breadcrumbs, Content, PageTitle } from "../layout";
import { IState } from "./store";
import FilterPeopleForm from "./FilterPeopleForm";
import { Download } from "../icons"

const headers = [
  { label: "Name", key: "name" },
  { label: "NetID", key: "netId" },
  { label: "Email", key: "campusEmail" },
  { label: "Phone", key: "campusPhone" },
  { label: "Campus", key: "campus" },
  { label: "Department", key: "department.name" },
  { label: "Position", key: "position" },
  { label: "Interests", key: "expertise" }
];

const Presentation: React.SFC<IProps> = ({ people: { data: people, permissions }, user }) => (
  <>
    <Breadcrumbs crumbs={[{ text: "Home", href: "/" }, "People"]} />
    <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-bottom-xxl">

      <Row>
        <Col>
          <PageTitle>People</PageTitle>
          <p>
            Use the filters below to find IT People based on their role within a unit, their job classification, and/or campus.
          </p>
        </Col>
      </Row>

      <Row margin={{ top: "md" }}>
        <Col md={5}>
          <FilterPeopleForm />
        </Col>
        <Col md={7}>
          {people && people.length == 0 &&
            <Panel>
            <p>No people found matching those filters. You can make yourself easier to find by <a href={`/people  /${user.user_name}`}>keeping your profile up to date.</a></p>
            </Panel>
          }
          {people && people.length > 0 && people[0].name !== "default" &&
            <>
              <Row key={"export_link"} className="rvt-p-bottom-lg">
                  <CSVLink headers={headers}
                    data={people}
                    enclosingCharacter={`"`}
                    filename={"it-people.csv"}
                    className="rvt-button"
                    target="_blank">
                    <span style={{marginRight:".5rem"}}><Download  /></span> Export results to CSV
                  </CSVLink>
              </Row>

              {people
                .sort(EntityComparer)
                .map((r, i) => (
                  <Row key={"people:" + i} className="rvt-p-bottom-md">
                    <div>
                      <a href={`/people/${r.id}`} className="rvt-link-bold">{r.name}</a> {r.campusEmail && <>(<a href={`mailto:${r.campusEmail}`}>{r.netId}</a>)</>} <br />
                      {r.position && <>{r.position}<br /></>}
                    </div>
                  </Row>
                ))}

            </>
          }
        </Col>
      </Row>
    </Content>
  </>
);

interface IProps {
  people: IState,
  user: IAuthUser
}

export default Presentation;
