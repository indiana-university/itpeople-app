import * as React from "react";
import { IEntity } from "../types";
import PageTitle from "../layout/PageTitle";

interface IProps {
  departments: IEntity[];
}

const Presentation: React.SFC<IProps> = ({ departments }) => {
  return (
    <>
      <PageTitle>Departments</PageTitle>
      <caption className="sr-only">List of Departments</caption>
      <ul>
        {departments &&
          departments.length > 0 &&
          departments.map((r, i) => (
            <li>
              <a href={`/departments/${r.id}`}>{r.name}</a>
              <div>{r.description}</div>
            </li>
          ))}
      </ul>
    </>
  );
};
export default Presentation;
