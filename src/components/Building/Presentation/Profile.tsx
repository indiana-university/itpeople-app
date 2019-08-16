import { IBuilding } from "src/components/types";
import { PageTitle } from "src/components/layout";
import * as React from "react";
import { join } from "src/util";

export const Profile: React.SFC<IBuilding> = ({name, code, address, city}) =>
  <div className="rvt-m-bottom-xxl">
    <PageTitle>{name}</PageTitle>
    {(address || city) && <p>{join([address, city], ", ")}</p>}
    {code && <p>Building Code: {code}</p>}
  </div>
