/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Row, Col } from "rivet-react";
import { List } from "rivet-react/build/dist/components/List/List";
import { IEntity, IDefaultState, EntityComparer, IBuilding } from "../types";
import { ProfileList } from "../Profile/ProfileList";
import { Loader } from "../Loader";
import { join } from "src/util";

interface IProps {
  people: IDefaultState<IEntity[]>;
  departments: IDefaultState<IEntity[]>;
  buildings: IDefaultState<IBuilding[]>;
  units: IDefaultState<IEntity[]>;
  selectedList: SearchLists;
  setCurrentList(list: SearchLists): void;
}
export enum SearchLists {
  People = "people",
  Units = "units",
  Buildings = "buildings",
  Departments = "departments"
}
const hasResults = (response: IDefaultState<any[]>) => {
  return response.data && response.data.length > 0;
};
export const Results: React.SFC<IProps> = ({ departments, setCurrentList, selectedList, units, people, buildings }) => {
  const showDepartments = () => setCurrentList(SearchLists.Departments);
  const showBuildings = () => setCurrentList(SearchLists.Buildings);
  const showUnits = () => setCurrentList(SearchLists.Units);
  const showPeople = () => setCurrentList(SearchLists.People);
  const hasNoResults = !hasResults(people) && !hasResults(units) && !hasResults(departments) && !hasResults(buildings);
  return (
    <>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", right: 0 }}>
          <Loader
            loading={departments.loading || units.loading || people.loading || buildings.loading}
            error={departments.error || units.error || people.error || buildings.error}
          />
        </span>
      </div>
      <Row>
        <Col className="rvt-m-bottom-lg search-list-button">
          <ul className="rvt-list rvt-plain-list rvt-inline-list">
            {hasResults(people) && people.data && (
              <li>
                <button onClick={showPeople} className={"rvt-button--plain" + (selectedList == SearchLists.People ? " selected" : "")}>
                  People ({people.data.length})
                </button>
              </li>
            )}
            {hasResults(units) && units.data && (
              <li>
                <button onClick={showUnits} className={"rvt-button--plain" + (selectedList == SearchLists.Units ? " selected" : "")}>
                  Units ({units.data.length})
                </button>
              </li>
            )}
            {hasResults(departments) && departments.data && (
              <li>
                <button onClick={showDepartments} className={"rvt-button--plain" + (selectedList == SearchLists.Departments ? " selected" : "")}>
                  Departments ({departments.data.length})
                </button>
              </li>
            )}
            {hasResults(buildings) && buildings.data && (
              <li>
                <button onClick={showBuildings} className={"rvt-button--plain" + (selectedList == SearchLists.Buildings ? " selected" : "")}>
                  Buildings ({buildings.data.length})
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

        {buildings && buildings.data && buildings.data.length > 0 && selectedList === SearchLists.Buildings && (
          <Col>
            <h2 className="sr-only">Buildings</h2>
            <List variant="plain" className="list-dividers">
              {buildings.data.sort(EntityComparer).map((r, i) => (
                <li className="rvt-p-tb-lg" key={"bldg-result:" + i}>
                  <a href={`/buildings/${r.id}`}>{r.name}</a>
                  {(r.address || r.city) && <p>{join([r.address, r.city], ", ")}</p>}
                </li>
              ))}
            </List>
          </Col>
        )}


        {hasNoResults && (
          <Col>
            <div>No results found</div>
          </Col>
        )}
      </Row>
    </>
  );
};
