import * as React from "react";
import {
  reduxForm,
  InjectedFormProps,
  FieldArray,
  Field,
  change
} from "redux-form";
import * as unit from "../store";
import { Breadcrumbs, Content, PageTitle } from "src/components/layout";
import {
  Section,
  List,
  Button,
  Row,
  Col,
  ModalBody,
  ModalControls
} from "rivet-react";
import { Modal, closeModal } from "../../layout/Modal";
import {
  RivetInputField,
  RivetInput,
  RivetTextarea,
  RivetTextareaField,
  required,
  url
} from "src/components/form";
import {
  TrashCan,
  ParentUnitIcon,
  ChildrenUnitsIcon,
  Pencil,
  AddUser
} from "src/components/icons";
import AddMemberForm from "./AddMemberForm";
import { connect } from "react-redux";
import UpdateParentForm from "./UpdateParentForm";
import AddChildForm from "./AddChildForm";
import AddDepartmentForm from "./AddDepartmentForm";
import { Panel } from "src/components/Panel";
import UpdateMemberForm from "./UpdateMemberForm";

interface IFormActions {
  save: typeof unit.saveRequest;
  cancel: typeof unit.cancel;
  closeModal: typeof closeModal;
  editMember: (member: unit.IUnitMember) => any;
  addMember: (member: unit.IUnitMember) => any;
}

interface IFormProps
  extends unit.IUnitProfile,
    IFormActions,
    InjectedFormProps<unit.IUnitProfile, IFormActions> {}

interface IMemberField extends unit.IUnitMember {
  fieldId: number;
  update: (m: any) => any;
}

let modalClose = () => {};
let editMember = (member: unit.IUnitMember) => {};
let addMember = (member: unit.IUnitMember) => {};

let EditForm: React.SFC<IFormProps> | any = (props: IFormProps) => {
  modalClose = props.closeModal;
  editMember = props.editMember;
  addMember = props.addMember;
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { text: "Home", href: "/" },
          { text: "Units", href: "/units" },
          props.name
        ]}
      />
      <form onSubmit={props.save}>
        <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-bottom-xxl">
          <Button
            onClick={props.cancel}
            type="button"
            style={{ float: "right" }}
          >
            Cancel
          </Button>
          <PageTitle>Edit Unit</PageTitle>
          <Section>
            <div>
              <RivetInputField
                name="name"
                component={RivetInput}
                label="Name"
                validate={[required]}
              />
            </div>
            <div>
              <RivetTextareaField
                name="description"
                component={RivetTextarea}
                label="Description"
                validate={[required]}
              />
            </div>
            <div>
              <RivetInputField
                name="url"
                component={RivetInput}
                label="URL"
                validate={[url]}
              />
            </div>
          </Section>
        </Content>
        <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-bottom-xxl">
          <Row>
            <Col md={6}>
              <div>
                <FieldArray
                  name="members"
                  component={renderMembers}
                  rerenderOnEveryChange={true}
                />
              </div>
            </Col>
            <Col md={5} last={true}>
              <div className="rvt-m-bottom-lg">
                <Panel title="Parents and children">
                  <h2 className="rvt-text-bold">Parent</h2>
                  <p>
                    A parent is a step higher on the org chart. If your unit is
                    part of a larger group, add that group here.
                  </p>
                  <div>
                    <Field name="parent" component={renderParent} />
                  </div>

                  <h2 className="rvt-text-bold rvt-m-top-xxl">Children</h2>
                  <p>
                    A child is a step lower on the org chart. If this unit has
                    groups associated with it, add those groups here.
                  </p>
                  <div>
                    <FieldArray name="children" component={renderChildren} />
                  </div>
                </Panel>
              </div>
              <Panel title="Supported Departments">
                <p>
                  Some units provide support for departments. If this unit
                  supports other departments, add them here.
                </p>
                <div>
                  <FieldArray
                    name="supportedDepartments"
                    component={renderDepartments}
                  />
                </div>
              </Panel>
            </Col>
          </Row>
          <Row>
            <Col>
              <div>
                <Button type="submit" disabled={props.invalid}>
                  Save Edits
                </Button>
                <Button onClick={props.cancel} variant="plain">
                  Cancel
                </Button>
              </div>
            </Col>
          </Row>
        </Content>
      </form>
    </>
  );
};

const renderMembers = ({ fields, input }: any) => {
  let members = fields.map(function(field: any, index: number) {
    let member = fields.get(index) as unit.IUnitMember;
    let update = (m: unit.IUnitMember) => {
      fields.splice(index, 1, { ...member, ...m });
    };
    return { ...member, fieldId: index, update };
  }) as IMemberField[];

  let leaders = members.filter(
    m => m.role == unit.ItProRole.Admin || m.role == unit.UitsRole.Leader
  );
  let standardMember = members.filter(
    m =>
      m.role == unit.ItProRole.Pro ||
      m.role == unit.UitsRole.Member ||
      m.role == unit.UitsRole.Sublead
  );
  let others = members.filter(
    m => m.role == unit.ItProRole.Aux || m.role == unit.UitsRole.Related
  );
  const createActions = (
    member: IMemberField,
    index: number,
    list: IMemberField[]
  ) => {
    return {
      down: list[index + 1]
        ? () => {
            fields.swap(member.fieldId, list[index + 1].fieldId);
          }
        : undefined,
      up: list[index - 1]
        ? () => {
            fields.swap(member.fieldId, list[index - 1].fieldId);
          }
        : undefined,
      remove: () => {
        fields.remove(member.fieldId);
      }
    };
  };
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
            onSubmit={(member: any) => {

              addMember(member);

              fields.push(member);
              modalClose();
            }}
          />
        </ModalBody>
        <ModalControls>
          <Button type="button" onClick={modalClose} variant="plain">
            Cancel
          </Button>
        </ModalControls>
      </Modal>
    </div>
  );
  return (
    <>
      <h2 className="rvt-ts-29 rvt-text-bold">Unit Leadership</h2>
      <p>
        Use Leadership for VPs directors and managers. Click on the person’s
        name to edit more detailed information about their role within this
        unit.
      </p>
      {addMemberFrom}
      <List variant="plain" className="list-dividers list-dividers--show-last">
        {leaders.map((member, index) => {
          const { down, up, remove } = createActions(member, index, leaders);
          return renderMember(member, index, remove, up, down);
        })}
      </List>

      <h2 className="rvt-ts-29 rvt-text-bold">Unit Members</h2>
      <p>
        Use Related People for admins and others who are do not solely report to
        this unit. Click on the person’s name to edit more detailed information
        about their role within this unit.
      </p>
      {addMemberFrom}
      <List
        variant="plain"
        className="list-dividers list-dividers--show-last rvt-m-top-lg"
      >
        {standardMember.map((member, index) => {
          const { down, up, remove } = createActions(
            member,
            index,
            standardMember
          );
          return renderMember(member, index, remove, up, down);
        })}
      </List>

      <h2 className="rvt-ts-29 rvt-text-bold">Related people</h2>
      <p>
        Use Related People for admins and others who are do not solely report to
        this unit. Click on the person’s name to edit more detailed information
        about their role within this unit.
      </p>
      {addMemberFrom}
      <List variant="plain" className="list-dividers list-dividers--show-last">
        {others.map((member, index) => {
          const { down, up, remove } = createActions(member, index, others);
          return renderMember(member, index, remove, up, down);
        })}
      </List>
    </>
  );
};

const renderMember = function(
  member: IMemberField,
  index: number,
  remove?: () => any,
  moveUp?: () => any,
  moveDown?: () => any
) {
  return (
    <li key={index}>
      <Row>
        <Col>
          <h3 className="rvt-ts-18 rvt-text-bold">{member.name}</h3>
          {member.title && <div>{member.title}</div>}
        </Col>
        <div style={{ textAlign: "right" }}>
          <span style={{ textAlign: "left" }}>
            <Modal
              id={`Edit member: ${member.id}`}
              buttonText={<Pencil />}
              variant="plain"
              title={`Edit member: ${member.name}`}
              onOpen={() => {
                editMember(member);
              }}
            >
              <ModalBody>
                <UpdateMemberForm
                  {...member}
                  onSubmit={(m: any) => {
                    member.update(m);
                    modalClose();
                  }}
                />
              </ModalBody>
              <ModalControls>
                <Button type="button" onClick={modalClose} variant="plain">
                  Cancel
                </Button>
              </ModalControls>
            </Modal>
          </span>
          {remove && (
            <Button
              className="rvt-button--plain"
              type="button"
              title="Remove Member"
              onClick={remove}
            >
              <TrashCan />
            </Button>
          )}
        </div>
      </Row>
    </li>
  );
};

const renderParent = ({ input }: any) => {
  return (
    <>
      <Modal
        id="update unit parents"
        title="Update Parent"
        buttonText="+ Add new parent"
        variant="plain"
      >
        <ModalBody>
          <UpdateParentForm
            onSubmit={(parent: any) => {
              input.onChange(parent);
              modalClose();
            }}
          />
        </ModalBody>
        <ModalControls>
          <Button type="button" onClick={modalClose} variant="plain">
            Cancel
          </Button>
        </ModalControls>
      </Modal>

      {input.value && (
        <Row className="rvt-m-top-md">
          <Col style={{ minWidth: 60, flexGrow: 0 }}>
            <ParentUnitIcon />
          </Col>
          <Col>
            <h4>{input.value.name}</h4>
          </Col>
          <Col style={{ minWidth: 60, flexGrow: 0 }}>
            <Button
              className="rvt-button--plain"
              type="button"
              title="Remove Member"
              onClick={() => input.onChange(null)}
            >
              <TrashCan />
            </Button>
          </Col>
        </Row>
      )}

      {input.value.description && (
        <Row className="rvt-grid">
          <Col style={{ minWidth: 60, flexGrow: 0 }} />
          <Col className="rvt-grid__item">{input.value.description}</Col>
        </Row>
      )}
    </>
  );
};

const renderChildren = ({ fields }: any) => {
  return (
    <>
      <Modal
        title="Add child unit"
        id="+ add child unit"
        buttonText="+ Add new child"
        variant="plain"
      >
        <ModalBody>
          <AddChildForm
            onSubmit={(child: any) => {
              fields.push(child);
              modalClose();
            }}
          />
        </ModalBody>
        <ModalControls>
          <Button type="button" onClick={modalClose} variant="plain">
            Cancel
          </Button>
        </ModalControls>
      </Modal>
      <List variant="plain">
        {fields.map((field: any, index: number) => {
          const unit = fields.get(index);
          return (
            <li key={index}>
              <Row>
                <Col style={{ minWidth: 60, flexGrow: 0 }}>
                  <ChildrenUnitsIcon width="100%" height="auto" />
                </Col>
                <Col>
                  <h4>{unit.name}</h4>
                </Col>
                <Col style={{ minWidth: 150, flexGrow: 0, textAlign: "right" }}>
                  <Button
                    variant="plain"
                    type="button"
                    title="Remove Unit"
                    onClick={() => fields.remove(index)}
                  >
                    <TrashCan />
                  </Button>
                </Col>
              </Row>
              {unit.description && (
                <Row className="rvt-grid">
                  <Col style={{ minWidth: 60, flexGrow: 0 }} />
                  <Col className="rvt-grid__item">{unit.description}</Col>
                </Row>
              )}
            </li>
          );
        })}
      </List>
    </>
  );
};

const renderDepartments = ({ fields }: any) => {
  return (
    <>
      <Modal
        id="add department to unit"
        title="+ add department"
        buttonText="+ add department"
        variant="plain"
      >
        <ModalBody>
          <AddDepartmentForm
            onSubmit={(department: any) => {
              console.log(department);
              fields.push(department);
              modalClose();
            }}
          />
        </ModalBody>
        <ModalControls>
          <Button type="button" onClick={modalClose} variant="plain">
            Cancel
          </Button>
        </ModalControls>
      </Modal>
      <List variant="plain">
        {fields.map((field: any, index: number) => {
          const department = fields.get(index);
          return (
            <li key={index}>
              <Row>
                <Col>
                  <h4 className="rvt-text-bold">{department.name}</h4>
                </Col>
                <Col style={{ flexGrow: 0, minWidth: 150, textAlign: "right" }}>
                  <Button
                    variant="plain"
                    type="button"
                    title="Remove Department"
                    onClick={() => fields.remove(index)}
                  >
                    <TrashCan />
                  </Button>
                </Col>
              </Row>
              {department.description && (
                <Row>
                  <Col>{department.description}</Col>
                </Row>
              )}
            </li>
          );
        })}
      </List>
    </>
  );
};

EditForm = reduxForm<unit.IUnitProfile, IFormActions>({
  form: "editUnit",
  enableReinitialize: true
})(EditForm);

EditForm = connect(
  null,
  dispatch => {
    return {
      closeModal: () => dispatch(closeModal()), // <-- closes modal
      editMember: (member: unit.IUnitMember) => {
        // <-- loads member into edit form
        dispatch(change("updateMemberForm", "name", member.name));
        dispatch(change("updateMemberForm", "title", member.title));
        dispatch(change("updateMemberForm", "role", member.role));
      },
      addMember: (member:any) => { dispatch(unit.saveMemberRequest(member))}
    };
  }
)(EditForm);

export default EditForm;
