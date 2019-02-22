import { IDepartment } from "src/components/types";
import { PageTitle } from "src/components/layout";
import * as React from "react";

export const Profile: React.SFC<IDepartment> = ({name, description}) =>
  <div className="rvt-m-bottom-xxl">
    <PageTitle>{name}</PageTitle>
    {description && <p>{description}</p>}
  </div>
