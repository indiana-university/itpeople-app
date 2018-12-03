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
  return (
    <>
      <Row>
        <Col className="rvt-m-bottom-lg search-list-button">
          <List variant="plain" orientation="inline">
            <button
              onClick={showPeople}
              className={
                "rvt-button--plain" +
                (selectedList == SearchLists.People ? " selected" : "")
              }
            >
              People ({users.length})
            </button>
            <button
              onClick={showUnits}
              className={
                "rvt-button--plain" +
                (selectedList == SearchLists.Units ? " selected" : "")
              }
            >
              Units ({units.length})
            </button>
            <button
              onClick={showDepartments}
              className={
                "rvt-button--plain" +
                (selectedList == SearchLists.Departments ? " selected" : "")
              }
            >
              Departments ({departments && departments.length})
            </button>
          </List>
        </Col>
      </Row>

      <Row>
        {users && users.length > 0 && selectedList === SearchLists.People && (
          <Col>
            <h2 className="sr-only">People</h2>
            <ProfileList users={users} />
          </Col>
        )}

        {units && units.length > 0 && selectedList === SearchLists.Units && (
          <Col>
            <h2 className="sr-only">Units</h2>
            <List variant="plain" className="list-dividers">
              {units.map((r, i) => (
                <li key={"membership:" + r.id} className="rvt-p-tb-lg">
                  <a href={`/units/${r.id}`}>{r.name}</a>
                  {r.description && <p>{r.description}</p>}
                </li>
              ))}
            </List>
          </Col>
        )}

        {departments &&
          departments.length > 0 &&
          selectedList === SearchLists.Departments && (
            <Col>
              <h2 className="sr-only">Departments</h2>
              <List variant="plain" className="list-dividers">
                {departments.map((r, i) => (
                  <li className="rvt-p-tb-lg" key={"department:" + r.id}>
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
