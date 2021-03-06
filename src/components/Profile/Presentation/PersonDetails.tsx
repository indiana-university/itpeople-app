import * as React from "react";
import { Panel } from "../../Panel";
import { IPerson, JobClassDisplayNames } from "../../types";
import { Badge, List, ModalBody } from "rivet-react";
import { Pencil } from "src/components/icons";
import { Modal } from "src/components/layout/Modal";
import EditInterests from "../Forms/EditInterests";
import { EditJobClasses } from "../Forms/EditJobClasses";

export const PersonDetails: React.SFC<IProps> = (props) => {
  const { person, canEdit, editJobClasses, closeModal, save } = props;
  const { location, campus, campusEmail, campusPhone, department, expertise = "", responsibilities = "" } = person;
  const splitListItems = (str: string) => str.split(",").map(s => s.trim()).filter(s => !!s.trim())
  const interestList = splitListItems(expertise)
  const jobClassList = splitListItems(responsibilities)
  return <>
    <Panel title="Contact Information">
      <div className="list-dividers">
        <div>
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
          {department &&
            <div>
              <strong>Department: </strong>
              <a href={`/departments/${department.id}`}>{department.name}</a>
            </div>}
        </div>
        {(responsibilities || canEdit) && (
          <div>
            {canEdit &&
              <div style={{ float: "right" }}>
                <Modal
                  id="Edit responsibilities"
                  title="Edit responsibilities"
                  buttonText={<Pencil />}
                  variant="plain"
                  onOpen={() => { editJobClasses && editJobClasses(jobClassList) }}
                >
                  <ModalBody>
                    <EditJobClasses
                      responsibilities={jobClassList}
                      onSubmit={({ responsibilities }: any) => {
                        const jobClassNames = responsibilities.filter((c: any) => c.enabled).map((c: any) => c.name);
                        const updated: IPerson = { ...person, responsibilities: jobClassNames.join(",") }
                        save(updated)
                        closeModal();
                      }}
                    />
                  </ModalBody>
                </Modal>
              </div>
            }
            <h2 className="rvt-ts-23 rvt-text-bold">Responsibilities</h2>
            <p>What kinds of work do you do on a day-to-day basis?</p>
            <List variant="plain">
              {jobClassList.map((r) => (<li key={`${r}-responsibility`}>{JobClassDisplayNames[r] || r}</li>))}
            </List>
          </div>
        )}
        {(expertise || canEdit) && (
          <div>
            {canEdit &&
              <div style={{ float: "right" }}>
                <Modal id="Edit interests" title="Edit interests" buttonText={<Pencil />} variant="plain">
                  <ModalBody>
                    <EditInterests
                      expertise={interestList}
                      onSubmit={(interests: string[]) => {
                        const expertise = Array.from(new Set(interests)).join(",");
                        const updated: IPerson = { ...person, expertise }
                        save(updated)
                        closeModal();
                      }}
                    />
                  </ModalBody>
                </Modal>
              </div>
            }
            <h2 className="rvt-ts-23 rvt-text-bold">Professional interests</h2>
            <p>What kinds of skills, technologies, or languages do you want to work with or learn about?</p>
            <List variant="plain" orientation="inline">
              {interestList.map((interest: string) => (<li key={`${interest}-badge`}><Badge>{interest}</Badge></li>))}
            </List>
          </div>
        )}
      </div>
    </Panel>
  </>
}

interface IProps {
  person: IPerson;
  canEdit?: boolean;
  editJobClasses: (responsibilities: string[]) => any;
  closeModal: () => any;
  save: (person: IPerson) => any
}

// todo: endpoint for Responsibility list
// todo: endpoint to save profile