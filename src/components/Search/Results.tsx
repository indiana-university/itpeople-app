import * as React from "react";
import { Row, Col } from "rivet-react";
import { List } from "rivet-react/build/dist/components/List/List";
import { IEntity } from "../types";
import { ProfileList } from "../Profile/ProfileList";

interface IProps {
  users: Array<IEntity>;
  departments: Array<IEntity>;
  units: Array<IEntity>;
  selectedList: SearchLists;
  setCurrentList(list: SearchLists): void;
}
export enum SearchLists {
  People,
  Units,
  Departments
}

export const Results: React.SFC<IProps> = ({
  departments,
  setCurrentList,
  selectedList,
  units,
  users
}) => {
  const showDepartments = () => {
    setCurrentList(SearchLists.Departments);
  };
  const showUnits = () => {
    setCurrentList(SearchLists.Units);
  };
  const showPeople = () => {
    setCurrentList(SearchLists.People);
  };
  return <>
      <Row>
        <List variant="plain" orientation="inline">
          {users.length > 0 && <button onClick={showPeople}>
              People {users.length}
            </button>}
          {units.length > 0 && <button onClick={showUnits}>
              Units {units.length}
            </button>}
          {departments.length > 0 && <button onClick={showDepartments}>
              Departments {departments.length}
            </button>}
        </List>
      </Row>
      <Row>
        {users.length > 0 && selectedList === SearchLists.People && <Col lg={4}>
            <h2 className="rvt-ts-26 rvt-m-top-lg">People</h2>
            <ProfileList users={users} />
          </Col>}

      {units.length > 0 && selectedList === SearchLists.Units && <Col lg={4}>
            <h2 className="rvt-ts-26 rvt-m-top-lg">Units</h2>
            <List variant="plain" className="list-stripes">
              {units.map((r, i) => <li key={i} className="rvt-p-all-lg">
                  <a href={`/units/${r.id}`}>{r.name}</a>
                  {r.description && <p>{r.description}</p>}
                </li>)}
            </List>
          </Col>}

      {departments.length > 0 && selectedList === SearchLists.Departments && <Col lg={4}>
            <h2 className="rvt-ts-26 rvt-m-top-lg">Departments</h2>
            <List variant="plain" className="list-stripes">
              {departments.map((r, i) => (
                <li className="rvt-p-all-lg" key={"departments/" + r.id}>
                  <a href={`/departments/${r.id}`}>{r.name}</a>
                  {r.description && <p>{r.description}</p>}
                </li>
              ))}
            </List>
          </Col>}
      </Row>
    </>;
};
