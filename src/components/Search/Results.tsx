/**
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";
import { Row, Col } from "rivet-react";
import { List } from "rivet-react/build/dist/components/List/List";
import { IDefaultState, EntityComparer, IBuilding, IPerson, IDepartment, IUnit, PeopleBySurnameComparer } from "../types";
import { Loader } from "../Loader";
import { join } from "src/util";

interface IProps {
  people: IDefaultState<IPerson[]>;
  departments: IDefaultState<IDepartment[]>;
  buildings: IDefaultState<IBuilding[]>;
  units: IDefaultState<IUnit[]>;
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
  const hasNoResults = !hasResults(people) && !hasResults(units) && !hasResults(departments) && !hasResults(buildings);

  const searchHeader = (name:string, selector:SearchLists, state:IDefaultState<any>) =>
    <> 
      { hasResults(state) &&
        <li>
          <button onClick={()=>setCurrentList(selector)} className={"rvt-button--plain" + (selectedList == selector ? " selected" : "")}>
            {name} ({state.data.length})
          </button>
        </li> } 
    </>

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
            {searchHeader("People", SearchLists.People, people)}
            {searchHeader("Units", SearchLists.Units, units)}
            {searchHeader("Departments", SearchLists.Departments, departments)}
            {searchHeader("Buildings", SearchLists.Buildings, buildings)}
          </ul>
        </Col>
      </Row>
      <Row>
        {people && people.data && people.data.length > 0 && selectedList === SearchLists.People && (
          <Col>
            <h2 className="sr-only">People</h2>
            <List variant="plain" className="list-dividers">
              {people.data.sort(PeopleBySurnameComparer).map((r, i) => (
                <li key={"unit-results:" + i} className="rvt-p-tb-xs">
                    <a href={"/people/" + r.id}>{r.name}</a>
                    {r.position && <><br/>{r.position}</>}
                </li>
              ))}
            </List>
          </Col>
        )}
        {units && units.data && units.data.length > 0 && selectedList === SearchLists.Units && (
          <Col>
            <h2 className="sr-only">Units</h2>
            <List variant="plain" className="list-dividers">
              {units.data.sort(EntityComparer).map((r, i) => (
                <li key={"unit-results:" + i} className="rvt-p-tb-xs">
                  <a href={`/units/${r.id}`}>{r.name}</a>
                  {r.description && <><br />{r.description}</>}
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
                <li className="rvt-p-tb-xs" key={"department-result:" + i}>
                  <a href={`/departments/${r.id}`}>{r.name}</a>
                  {r.description && <><br />{r.description}</>}
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
                <li className="rvt-p-tb-xs" key={"bldg-result:" + i}>
                  <a href={`/buildings/${r.id}`}>{r.name}</a>
                  {(r.address || r.city) && <><br/>{join([r.address, r.city], ", ")}</>}
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
