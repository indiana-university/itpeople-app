import * as React from "react";
import { Panel } from "../../Panel";
import { IPerson } from "../../types";
import { Badge, List, ModalBody } from "rivet-react";
import { Pencil } from "src/components/icons";
import { Modal } from "src/components/layout/Modal";
import EditInterests from "../Forms/EditInterests";
import { EditJobClasses } from "../Forms/EditJobClasses";

export const PersonDetails: React.SFC<IProps> = (props) => {
  const { person, canEdit, editJobClasses, closeModal, save } = props;
  const { location, campus, campusEmail, campusPhone, department, interests = "", jobClasses = "" } = person;
  const interestList = interests.split(";").filter(s => !!s.trim())
  const jobClassList = jobClasses.split(";").filter(s => !!s.trim())
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
        {(jobClasses || canEdit) && (
          <div>
            {canEdit &&
              <div style={{ float: "right" }}>
                <Modal
                  id="Edit responsibilities"
                  title="Edit interests"
                  buttonText={<Pencil />}
                  variant="plain"
                  onOpen={() => { editJobClasses && editJobClasses(jobClassList) }}
                >
                  <ModalBody>
                    <EditJobClasses
                      jobClasses={jobClassList}
                      onSubmit={({ jobClasses }: any) => {
                        const jobClassNames = jobClasses.filter((c: any) => c.enabled).map((c: any) => c.name);
                        const updated: IPerson = { ...person, jobClasses: jobClassNames.join(";") }
                        save(updated)
                        closeModal();
                      }}
                    />
                  </ModalBody>
                </Modal>
              </div>
            }
            <h2 className="rvt-ts-23 rvt-text-bold">Responsibilities</h2>
            <List variant="plain">
              {jobClassList.map((r) => (<li key={`${r}-responsibility`}>{r}</li>))}
            </List>
          </div>
        )}
        {(interests || canEdit) && (
          <div>
            {canEdit &&
              <div style={{ float: "right" }}>
                <Modal id="Edit interests" title="Edit interests" buttonText={<Pencil />} variant="plain">
                  <ModalBody>
                    <EditInterests
                      interests={interestList}
                      onSubmit={(interests: string[]) => {
                        console.log("interests", interests)
                        const updated: IPerson = { ...person, interests: interests.join(";") }
                        save(updated)
                        closeModal();
                      }}
                    />
                  </ModalBody>
                </Modal>
              </div>
            }
            <h2 className="rvt-ts-23 rvt-text-bold">Professional interests</h2>
            <p>Professional interests are topics or skills that are commonly shared throughout this industry. Select a topic below to see who else has the same interests.</p>
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
  editJobClasses: (jobClasses: string[]) => any;
  closeModal: () => any;
  save: (person: IPerson) => any
}

// todo: endpoint for Responsibility list
// todo: endpoint to save profile