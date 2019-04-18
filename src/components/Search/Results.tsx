/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Row, Col } from "rivet-react";
import { List } from "rivet-react/build/dist/components/List/List";
import { IEntity, IDefaultState, EntityComparer } from "../types";
import { ProfileList } from "../Profile/ProfileList";
import { Loader } from "../Loader";

interface IProps {
  people: IDefaultState<IEntity[]>;
  departments: IDefaultState<IEntity[]>;
  units: IDefaultState<IEntity[]>;
  selectedList: SearchLists;
  setCurrentList(list: SearchLists): void;
}
export enum SearchLists {
  People = "people",
  Units = "units",
  Departments = "departments"
}

export const Results: React.SFC<IProps> = ({ departments, setCurrentList, selectedList, units, people }) => {
  const showDepartments = () => setCurrentList(SearchLists.Departments);
  const showUnits = () => setCurrentList(SearchLists.Units);
  const showPeople = () => setCurrentList(SearchLists.People);

  return (
    <>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", right: 0 }}>
          <Loader
            loading={departments.loading || units.loading || people.loading}
            error={departments.error || units.error || people.error}
          />
        </span>
      </div>
      <Row>
        <Col className="rvt-m-bottom-lg search-list-button">
          <ul className="rvt-list rvt-plain-list rvt-inline-list">
            {people && people.data && people.data.length > 0 && (
              <li>
                <button onClick={showPeople} className={"rvt-button--plain" + (selectedList == SearchLists.People ? " selected" : "")}>
                  People ({people.data.length})
                </button>
              </li>
            )}
            {units && units.data && units.data.length > 0 && (
              <li>
                <button onClick={showUnits} className={"rvt-button--plain" + (selectedList == SearchLists.Units ? " selected" : "")}>
                  Units ({units.data.length})
                </button>
              </li>
            )}
            {departments && departments.data && departments.data.length > 0 && (
              <li>
                <button
                  onClick={showDepartments}
                  className={"rvt-button--plain" + (selectedList == SearchLists.Departments ? " selected" : "")}
                >
                  Departments ({departments.data.length})
                </button>
              </li>
            )}
          </ul>
        </Col>
      </Row>

      <Row>
        {people && people.data && people.data.length > 0 && selectedList === SearchLists.People && (
          <Col>
            <h2 className="sr-only">People</h2>
            <ProfileList users={people.data.sort(EntityComparer)} />
          </Col>
        )}

        {units && units.data && units.data.length > 0 && selectedList === SearchLists.Units && (
          <Col>
            <h2 className="sr-only">Units</h2>
            <List variant="plain" className="list-dividers">
              {units.data.sort(EntityComparer).map((r, i) => (
                <li key={"unit-results:" + i} className="rvt-p-tb-lg">
                  <a href={`/units/${r.id}`}>{r.name}</a>
                  {r.description && <p>{r.description}</p>}
                </li>
              ))}
            </List>
          </Col>
        )}

        {departments && departments.data && departments.data.length > 0 && selectedList === SearchLists.Departments && (
          <Col>
            <h2 className="sr-only">Departments</h2>
            <List variant="plain" className="list-dividers">
              {departments.data.sort(EntityComparer).map((r, i) => (
                <li className="rvt-p-tb-lg" key={"department-result:" + i}>
                  <a href={`/departments/${r.id}`}>{r.name}</a>
                  {r.description && <p>{r.description}</p>}
                </li>
              ))}
            </List>
          </Col>
        )}
      </Row>
    </>
  );
};
