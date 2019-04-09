import * as React from "react";
import { reduxForm, InjectedFormProps, Field, formValueSelector, FieldArray, change } from "redux-form";
import { Button, ModalBody, List, Row, Col } from "rivet-react";
import { Modal, closeModal } from "../../layout/Modal";
import { saveMemberRequest, deleteMemberRequest } from "../store";
import { UitsRole, ItProRole, IUnitMember, IUnitMemberRequest } from "../../types";
import { connect } from "react-redux";
import { AddUser, Pencil, TrashCan, Eye, Gear } from "src/components/icons";
import { IApplicationState } from "src/components/types";
import { Dispatch } from "redux";
import AddMemberForm from "./AddMemberForm";
import UpdateMemberForm from "./UpdateMemberForm";
import { clearCurrent } from "src/components/lookup";
import { UpdateMemberTools } from "./UpdateMemberToolsForm";

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
  addMember(unitId: number, role?: UitsRole): any;
}

const form: React.SFC<IFormProps> = props => {
  // TODO
  let canEditPermisions = () => true;

  const { closeModal, clearCurrent, editMember, addMember, removeMember, save, unitId } = props;
  const renderMembers = ({ fields, input }: any) => {
    let members = fields.map(function (field: any, index: number) {
      let member = fields.get(index) as IUnitMember;
      return { ...member, index };
    }) as IUnitMember[];
    let leaders = members.filter(m => m.role == ItProRole.Admin || m.role == UitsRole.Leader);
    let standardMember = members.filter(m => m.role == ItProRole.Pro || m.role == UitsRole.Member || m.role == UitsRole.Sublead);
    let others = members.filter(m => m.role == ItProRole.Aux || m.role == UitsRole.Related);
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
                const { unitId, personId, title, showTitle, role, permissions, percentage, showPercentage } = values;
                save({ unitId, personId, title, showTitle, role, permissions, percentage, showPercentage });
                closeModal();
              }}
            />
          </ModalBody>
        </Modal>
      </div>
    );
    const renderMember = function (member: IUnitMember) {
      const remove = () => removeMember(member);
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
              <h3 className="rvt-ts-18 rvt-text-bold">{person && person.name}</h3>
              {member.title && (
                <div>
                  {member.showTitle && (
                    <span title="Visible on orgchart">
                      <Eye width={20} />{" "}
                    </span>
                  )}
                  {member.title}
                </div>
              )}
              {member.percentage && (
                <div>
                  {member.showPercentage && (
                    <span title="Visible on orgchart">
                      <Eye width={20} />{" "}
                    </span>
                  )}
                  {member.percentage}%
                </div>
              )}
            </Col>
            <div style={{ textAlign: "right" }}>
              {canEditPermisions() && (
                <span style={{ textAlign: "left" }}>
                  <Modal
                    id={`Edit tools permissions: ${member.id}`}
                    buttonText={<Gear />}
                    variant="plain"
                    title={`Edit tools permissions: ${person ? person.name : "Vacancy"}`}
                  >
                    <ModalBody>
                      <UpdateMemberTools />
                    </ModalBody>
                  </Modal>
                </span>
              )}

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
                        const { id, unitId, personId, title, showTitle, role, permissions, percentage, showPercentage } = values;
                        save({ id, unitId, personId, title, showTitle, role, permissions, percentage, showPercentage });
                        closeModal();
                      }}
                    />
                  </ModalBody>
                </Modal>
              </span>

              <Button variant="plain" type="button" title="Remove member" onClick={remove}>
                <TrashCan />
              </Button>
            </div>
          </Row>
        </li>
      );
    };

    return (
      <>
        <h2 className="rvt-ts-29 rvt-text-bold">Unit Leadership</h2>
        <p>
          Use Leadership for VPs directors and managers. Click on the pencil icon to edit more detailed information about their role within
          this unit.
        </p>
        {renderAddMemberForm(save, "Leader", UitsRole.Leader)}
        <List variant="plain" className="list-dividers list-dividers--show-last rvt-m-top-lg">
          {leaders.map(renderMember)}
        </List>

        <h2 className="rvt-ts-29 rvt-text-bold">Unit Members</h2>
        <p>
          Use Related People for admins and others who are do not solely report to this unit. Click on the pencil icon to edit more detailed
          information about their role within this unit.
        </p>
        {renderAddMemberForm(save, "Members", UitsRole.Member)}
        <List variant="plain" className="list-dividers list-dividers--show-last rvt-m-top-lg">
          {standardMember.map(renderMember)}
        </List>

        <h2 className="rvt-ts-29 rvt-text-bold">Related people</h2>
        <p>
          Use Related People for admins and others who are do not solely report to this unit. Click on the pencil icon to edit more detailed
          information about their role within this unit.
        </p>
        {renderAddMemberForm(save, "Others", UitsRole.Related)}
        <List variant="plain" className="list-dividers list-dividers--show-last rvt-m-top-lg">
          {others.map(renderMember)}
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

let UpdateMembersForm: any = reduxForm<IFormFields>({
  form: "updateMembersForm"
})(form);

let selector = formValueSelector("updateMembersForm");
UpdateMembersForm = connect(
  (state: IApplicationState) => ({
    title: selector(state, "title"),
    role: selector(state, "role"),
    unitId: selector(state, "unitId")
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
      addMember: (unitId: number, role?: UitsRole) => {
        dispatch(change("addMemberForm", "unitId", unitId));
        dispatch(change("addMemberForm", "role", role || UitsRole.Member));
      }
    };
  }
)(UpdateMembersForm);

export default UpdateMembersForm;
