import * as React from "react";
import {
  reduxForm,
  InjectedFormProps,
  Field,
  formValueSelector,
  FieldArray,
  change
} from "redux-form";
import { Button, ModalBody, ModalControls, List, Row, Col } from "rivet-react";
import { Modal, closeModal } from "../../layout/Modal";
import {
  UitsRole,
  ItProRole,
  IUnitMember,
  saveMemberRequest,
  deleteMemberRequest
} from "../store";
import { connect } from "react-redux";
import { AddUser, Pencil, TrashCan } from "src/components/icons";
import { IApplicationState } from "src/components/types";
import { Dispatch } from "redux";
import AddMemberForm from "./AddMemberForm";
import UpdateMemberForm from "./UpdateMemberForm";

interface IFormProps extends InjectedFormProps<IFormFields>, IDispatchProps {
  onSubmit: (e?: any) => any;
  field: Field;
}
interface IFormFields {
  members: IUnitMember[]
}

interface IDispatchProps {
  closeModal: typeof closeModal;
  removeMember(m: IUnitMember): any; // <-- TODO: map redux action in store
  editMember(memmber: any): any;
  save: typeof saveMemberRequest;
}

const form: React.SFC<IFormProps> = props => {
  const { closeModal, editMember, removeMember, save } = props;
  const renderMembers = ({ fields, input }: any) => {
    let members = fields.map(function(field: any, index: number) {
      let member = fields.get(index) as IUnitMember;
      return { ...member, index };
    }) as IUnitMember[];
    let leaders = members.filter(
      m => m.role == ItProRole.Admin || m.role == UitsRole.Leader
    );
    let standardMember = members.filter(
      m =>
        m.role == ItProRole.Pro ||
        m.role == UitsRole.Member ||
        m.role == UitsRole.Sublead
    );
    let others = members.filter(
      m => m.role == ItProRole.Aux || m.role == UitsRole.Related
    );

    const addMemberFrom = (
      <div>
        <Modal
          id="Add member to unit"
          title="Add member"
          buttonText={
            <span style={{ color: "#006298" }}>
              <AddUser /> Add member
            </span>
          }
          variant="plain"
        >
          <ModalBody>
            <AddMemberForm
              initialValues={}
              onSubmit={(member: any) => {
                save(member);
                fields.push(member);
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
      </div>
    );
    const renderMember = function(member: IUnitMember) {
      const remove = () => {
        removeMember(member);
      };
      const person = member.person;
      return (
        <li>
          <Row>
            <Col>
              <h3 className="rvt-ts-18 rvt-text-bold">
                {person && person.name}
              </h3>
              {member.title && <div>{member.title}</div>}
            </Col>
            <div style={{ textAlign: "right" }}>
              <span style={{ textAlign: "left" }}>
                <Modal
                  id={`Edit member: ${member.memberId}`}
                  buttonText={<Pencil />}
                  variant="plain"
                  title={`Edit member: ${person ? person.name : "Vacancy" }`}
                  onOpen={() => {
                    editMember(member);
                  }}
                >
                  <ModalBody>
                    <UpdateMemberForm
                      {...member}
                      onSubmit={(m: any) => {
                        save(m);
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
              <Button
                className="rvt-button--plain"
                type="button"
                title="Remove Member"
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
        <h2 className="rvt-ts-29 rvt-text-bold">Unit Leadership</h2>
        <p>
          Use Leadership for VPs directors and managers. Click on the person’s
          name to edit more detailed information about their role within this
          unit.
        </p>
        {addMemberFrom}
        <List
          variant="plain"
          className="list-dividers list-dividers--show-last"
        >
          {leaders.map(member => {
            return renderMember(member);
          })}
        </List>

        <h2 className="rvt-ts-29 rvt-text-bold">Unit Members</h2>
        <p>
          Use Related People for admins and others who are do not solely report
          to this unit. Click on the person’s name to edit more detailed
          information about their role within this unit.
        </p>
        {addMemberFrom}
        <List
          variant="plain"
          className="list-dividers list-dividers--show-last rvt-m-top-lg"
        >
          {standardMember.map(member => {
            return renderMember(member);
          })}
        </List>

        <h2 className="rvt-ts-29 rvt-text-bold">Related people</h2>
        <p>
          Use Related People for admins and others who are do not solely report
          to this unit. Click on the person’s name to edit more detailed
          information about their role within this unit.
        </p>
        {addMemberFrom}
        <List
          variant="plain"
          className="list-dividers list-dividers--show-last"
        >
          {others.map(member => {
            return renderMember(member);
          })}
        </List>
      </>
    );
  };

  return (
    <>
      <div>
        <FieldArray
          name="members"
          component={renderMembers}
          rerenderOnEveryChange={true}
        />
      </div>
    </>
  );
};

let UpdateMembersForm: any = reduxForm<IFormFields>({
  form: "updateMembersForm",
  enableReinitialize: true
})(form);

let selector = formValueSelector("updateMembersForm");
UpdateMembersForm = connect(
  (state: IApplicationState) => ({
    title: selector(state, "title"),
    role: selector(state, "role")
  }),
  (dispatch: Dispatch) => {
    return {
      closeModal: () => dispatch(closeModal()),
      removeMember: (member: IUnitMember) =>{
        console.log("deleting member", member)
        return dispatch(deleteMemberRequest(member)) 
      }, // <-- TODO: map redux action in store
      save: (member: IUnitMember) => {
        console.log("saving member", member) 
        return dispatch(saveMemberRequest(member))
      },
      editMember: (member: IUnitMember) => {
        console.log("editing` member", member)
        // <-- loads member into edit form
        dispatch(change("updateMemberForm", "title", member.title));
        dispatch(change("updateMemberForm", "role", member.role));
      }
    };
  }
)(UpdateMembersForm);

export default UpdateMembersForm;
