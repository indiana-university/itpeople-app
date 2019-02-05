import * as React from "react";
import { Panel } from "../../Panel";
import { IPerson } from "../../types";

export const PersonDetails: React.SFC<IPerson> = ({location, campus, campusEmail, campusPhone, department}) => 
    <>
        <Panel title="Contact Information">
            {location &&
                <div>
                    <strong>Location: </strong>
                    {location}
                </div>}
            {campus &&
                <div>
                    <strong>Campus: </strong>
                    {campus}
                </div>}
            {campusEmail &&
                <div>
                    <strong>Email: </strong>
                    <a href={`mailto:${campusEmail}`}>{campusEmail}</a>
                </div>
            }
            {campusPhone &&
                <div>
                    <strong>Phone: </strong>
                    {campusPhone}
                </div>}
            { department &&
                <div>
                  <strong>Department: </strong>
                  <a href={`/departments/${department.id}`}>{department.name}</a>
                </div>}
            { 
            /* <div className="list-dividers">
                {responsibilities.length > 0 && (
                  <div>
                    <h2 className="rvt-ts-23 rvt-text-bold">
                      Responsibilities
                    </h2>
                    <List variant="plain">
                      {responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </List>
                  </div>
                )}
                {tools.length > 0 && (
                  <div>
                    <h2 className="rvt-ts-23 rvt-text-bold">Tools</h2>
                    <List variant="plain">
                      {tools.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </List>
                  </div>
                )}
                {user.expertise && user.expertise.length > 0 && (
                  <div>
                    <h2 className="rvt-ts-23 rvt-text-bold">Interests</h2>
                    <List variant="plain">
                      {user.expertise.map &&
                        user.expertise.map((e, i) => <li key={i}>{e}</li>)}
                    </List>
                  </div>
                )}
              </div> */}
        </Panel>
    </>