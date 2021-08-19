import * as React from "react";
import { reduxForm, InjectedFormProps, Field, formValueSelector, FieldArray, change } from "redux-form";
import { Button, ModalBody, List, Row, Col } from "rivet-react";
import { Modal, closeModal } from "../../layout/Modal";
import { saveMemberRequest, deleteMemberRequest, saveMemberTools } from "../store";
import { UitsRole, IUnitMember, IUnitMemberRequest, IApiState, Permissions, ITool, UnitMemberComparer, membersInRole } from "../../types";
import { connect } from "react-redux";
import { AddUser, Pencil, TrashCan, Eye, Gear } from "src/components/icons";
import { IApplicationState } from "src/components/types";
import { Dispatch } from "redux";
import AddMemberForm from "./AddMemberForm";
import UpdateMemberForm from "./UpdateMemberForm";
import { clearCurrent } from "src/components/lookup";
import { UpdateMemberTools } from "./UpdateMemberToolsForm";
import { Loader } from "src/components/Loader";

interface IFormProps extends InjectedFormProps<IFormFields>, IDispatchProps, IFormFields {
  onSubmit: (e?: any) => any;
  field: Field;
}
interface IFormFields {
  unitId: number;
  members: IUnitMember[];
}

interface IDispatchProps {
  closeModal: typeof closeModal;
  clearCurrent: typeof clearCurrent;
  removeMember: typeof deleteMemberRequest;
  save: typeof saveMemberRequest;
  editMember(member: any): any;
  editMemberTools(id: any, unitTools: ITool[]): any;
  saveMemberTools: typeof saveMemberTools;
  addMember(unitId: number, role?: UitsRole): any;
  tools: IApiState<any, ITool[]>;
}

const form: React.SFC<IFormProps> = props => {
  const { closeModal, clearCurrent, editMember, addMember, removeMember, save, editMemberTools, saveMemberTools, unitId, tools } = props;
  let canEditMemberTools = () => Permissions.canPut(tools.permissions);
  const renderMembers = ({ fields, input }: any) => {
    let members = fields.map(function (field: any, index: number) {
      let member = fields.get(index) as IUnitMember;
      return { ...member, index };
    }).sort(UnitMemberComparer) as IUnitMember[];    
    let memberPermissions = members.map(p => p.permissions);    
    let leaders = membersInRole(members, UitsRole.Leader);
    let subLeads = membersInRole(members, UitsRole.Sublead);
    let team = membersInRole(members, UitsRole.Member);
    let related = membersInRole(members, UitsRole.Related)
    const renderAddMemberForm = (save: typeof saveMemberRequest, id: string, role?: UitsRole) => (
      <div>
        <Modal
          id={"Add member to unit:" + id}
          title={"Add " + (id ? id : "member")}
          buttonText={
            <span>
              <AddUser /> Add member
            </span>
          }
          buttonStyle={{ marginLeft: -14 }}
          onOpen={() => { addMember(unitId, role); clearCurrent(); }}
          variant="plain"
        >
          <ModalBody>
            <AddMemberForm
              unitId={unitId}
              initialValues={{ unitId }}
              onSubmit={(values: IUnitMember) => {
                const netId = values.person ? values.person.netId : undefined;
                const personId = values.person ? values.person.id : undefined;
                const { title, showTitle, role, permissions, percentage, notes } = values;
                save({ unitId, netId, personId, title, showTitle, role, permissions, percentage, notes });
                closeModal();
              }}
            />
          </ModalBody>
        </Modal>
      </div>
    );
    const renderMember = function (member: IUnitMember) {
      const { name = "this member" } = member.person || {};
      const remove = () => confirm(`Are you sure you want to remove ${name} from this unit?`) && removeMember(member);
      const person = member.person;
      return (
        <li key={member.id}>
          <Row>
            {person && person.photoUrl && (
              <Col sm={2}>
                <img
                  src={person.photoUrl}
                  width={"100%"}
                  style={{
                    borderRadius: "100%",
                    overflow: "hidden",
                    objectFit: "cover"
                  }}
                />
              </Col>
            )}
            <Col>
              <h3 className="rvt-ts-18 rvt-text-bold">
                {person && person.name}
              </h3>
              {member.title && (
                <div>
                  {member.showTitle && (
                    <span title="Visible on orgchart">
                      <Eye width={20} />{" "}
                    </span>
                  )}
                  {member.title}
                  {member.percentage && member.percentage != 100 &&
                    <span style={{ paddingLeft: "0.25rem" }}>
                      ({member.percentage}%)
                    </span>
                  }
                </div>
              )}
            </Col>
            <div style={{ textAlign: "right" }}>
              <Loader {...tools}>
                {canEditMemberTools() || memberPermissions?.includes("ManageTools") && tools && tools.data && (
                  <span style={{ textAlign: "left" }}>
                    <Modal
                      id={`Edit tools permissions: ${member.id}`}
                      buttonText={<Gear />}
                      variant="plain"
                      title={`Edit tools permissions: ${
                        person ? person.name : "Vacancy"
                      }`}
                      onOpen={() => {
                        editMemberTools(member, tools.data || []);
                      }}
                    >
                      <ModalBody>
                        <UpdateMemberTools
                          onSubmit={({ tools }: { tools: ITool[] }) => {
                            const newToolIds = tools
                              .filter(tool => tool.enabled)
                              .map(tool => tool.id);
                            saveMemberTools(member, newToolIds);
                            closeModal();
                          }}
                        />
                      </ModalBody>
                    </Modal>
                  </span>
                )}
              </Loader>

              <span style={{ textAlign: "left" }}>
                <Modal
                  id={`Edit member: ${member.id}`}
                  buttonText={<Pencil />}
                  variant="plain"
                  title={`Edit member: ${person ? person.name : "Vacancy"}`}
                  onOpen={() => editMember(member)}
                >
                  <ModalBody>
                    <UpdateMemberForm
                      onSubmit={(values: IUnitMember) => {
                        const {
                          id,
                          unitId,
                          personId,
                          title,
                          showTitle,
                          role,
                          permissions,
                          percentage,
                          notes
                        } = values;
                        save({
                          id,
                          unitId,
                          personId,
                          title,
                          showTitle,
                          role,
                          permissions,
                          percentage,
                          notes
                        });
                        closeModal();
                      }}
                    />
                  </ModalBody>
                </Modal>
              </span>

              <Button
                variant="plain"
                type="button"
                title="Remove member"
                onClick={remove}
              >
                <TrashCan />
              </Button>
            </div>
          </Row>
        </li>
      );
    };

    return (
      <>
        <h2 className="rvt-ts-29 rvt-text-bold">Leaders</h2>
        <p>
          Unit <em>Leaders</em> are VPs, directors, managers.
        </p>
        {renderAddMemberForm(save, "Leader", UitsRole.Leader)}
        <List variant="plain" className="list-dividers list-dividers--show-last rvt-m-top-lg">
          {leaders.map(renderMember)}
        </List>

        <h2 className="rvt-ts-29 rvt-text-bold">Subleads</h2>
        <p>
          Unit <em>Subleads</em> are team leads and co-admins.
        </p>
        {renderAddMemberForm(save, "Subleads", UitsRole.Sublead)}
        <List variant="plain" className="list-dividers list-dividers--show-last rvt-m-top-lg">
          {subLeads.map(renderMember)}
        </List>

        <h2 className="rvt-ts-29 rvt-text-bold">Members</h2>
        <p>
          Unit <em>Members</em> are individual contributers.
        </p>
        {renderAddMemberForm(save, "Members", UitsRole.Member)}
        <List variant="plain" className="list-dividers list-dividers--show-last rvt-m-top-lg">
          {team.map(renderMember)}
        </List>

        <h2 className="rvt-ts-29 rvt-text-bold">Related People</h2>
        <p>
          <em>Related</em> people are executive assistants and self-supported faculty/staff that do not solely report to this unit.
        </p>
        {renderAddMemberForm(save, "Others", UitsRole.Related)}
        <List variant="plain" className="list-dividers list-dividers--show-last rvt-m-top-lg">
          {related.map(renderMember)}
        </List>
      </>
    );
  };

  return (
    <>
      <div>
        <FieldArray name="members" component={renderMembers} rerenderOnEveryChange={true} />
      </div>
    </>
  );
};

let selector = formValueSelector("updateMembersForm");
let UpdateMembersForm: any = reduxForm<IFormFields>({
  form: "updateMembersForm"
})(form);
UpdateMembersForm = connect(
  (state: IApplicationState) => ({
    title: selector(state, "title"),
    role: selector(state, "role"),
    unitId: selector(state, "unitId"),
    tools: state.unit.tools
  }),
  (dispatch: Dispatch) => {
    return {
      closeModal: () => dispatch(closeModal()),
      clearCurrent: () => dispatch(clearCurrent()),
      removeMember: (member: IUnitMember) => dispatch(deleteMemberRequest(member)),
      save: (member: IUnitMemberRequest) => dispatch(saveMemberRequest(member)),
      editMember: (member: IUnitMember) => {
        for (const key in member) {
          dispatch(change("updateMemberForm", key, member[key]));
        }
      },
      editMemberTools: (member: IUnitMember, tools: ITool[]) => {
        const memberToolIds = new Set(member.memberTools.map(t => t.toolId))
        const toolCheckboxState = tools.map(tool => ({ ...tool, enabled: memberToolIds.has(tool.id) }));
        dispatch(change("updateMemberTools", "tools", toolCheckboxState));
      },
      saveMemberTools: (member: IUnitMember, newToolIds: number[]) => dispatch(saveMemberTools(member, newToolIds)),
      addMember: (unitId: number, role?: UitsRole) => {
        dispatch(change("addMemberForm", "unitId", unitId));
        dispatch(change("addMemberForm", "role", role || UitsRole.Member));
      }
    };
  }
)(UpdateMembersForm);

export default UpdateMembersForm;
