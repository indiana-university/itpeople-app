import * as React from "react";
import { reduxForm, InjectedFormProps, Field, formValueSelector, FieldArray, change } from "redux-form";
import { Button, ModalBody, ModalControls, List, Row, Col } from "rivet-react";
import { Modal, closeModal } from "../../layout/Modal";
import { UitsRole, ItProRole, IUnitMember, saveMemberRequest, deleteMemberRequest, IUnitMemberRequest } from "../store";
import { connect } from "react-redux";
import { AddUser, Pencil, TrashCan } from "src/components/icons";
import { IApplicationState } from "src/components/types";
import { Dispatch } from "redux";
import AddMemberForm from "./AddMemberForm";
import UpdateMemberForm from "./UpdateMemberForm";

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
  removeMember: typeof deleteMemberRequest;
  save: typeof saveMemberRequest;
  editMember(member: any): any;
  addMember(unitId: number, role?: UitsRole): any;
}

const form: React.SFC<IFormProps> = props => {
  const { closeModal, editMember, addMember, removeMember, save, unitId } = props;
  const renderMembers = ({ fields, input }: any) => {
    let members = fields.map(function(field: any, index: number) {
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
          onOpen={() => addMember(unitId, role)}
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
    const renderMember = function(member: IUnitMember) {
      const remove = () => removeMember(member);
      const person = member.person;
      return (
        <li key={member.id}>
          <Row>
            <Col>
              <h3 className="rvt-ts-18 rvt-text-bold">{person && person.name}</h3>
              {member.title && <div>{member.title}</div>}
            </Col>
            <div style={{ textAlign: "right" }}>
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
                  <ModalControls>
                    <Button type="button" onClick={closeModal} variant="plain">
                      Cancel
                    </Button>
                  </ModalControls>
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
        <p>Use Leadership for VPs, directors, managers.</p>
        {renderAddMemberForm(save, "Leader", UitsRole.Leader)}
        <List variant="plain" className="list-dividers list-dividers--show-last">
          {leaders.map(renderMember)}
        </List>

        <h2 className="rvt-ts-29 rvt-text-bold">Unit Members</h2>
        <p>
          Use Related People for admins and others who are do not solely report to this unit. Click on the person’s name to edit more
          detailed information about their role within this unit.
        </p>
        {renderAddMemberForm(save, "Members", UitsRole.Member)}
        <List variant="plain" className="list-dividers list-dividers--show-last rvt-m-top-lg">
          {standardMember.map(renderMember)}
        </List>

        <h2 className="rvt-ts-29 rvt-text-bold">Related people</h2>
        <p>
          Use Related People for admins and others who are do not solely report to this unit. Click on the person’s name to edit more
          detailed information about their role within this unit.
        </p>
        {renderAddMemberForm(save, "Others", UitsRole.Related)}
        <List variant="plain" className="list-dividers list-dividers--show-last">
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
