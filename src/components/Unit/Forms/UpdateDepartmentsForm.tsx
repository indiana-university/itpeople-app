import * as React from "react";
import { reduxForm, InjectedFormProps } from "redux-form";
import { connect } from "react-redux";
import { Button, ModalBody, ModalControls, List, Row, Col } from "rivet-react";
import { RivetInputField, RivetInput } from "../../form";
import { IApplicationState, IEntity } from "../../types";
import { Dispatch } from "redux";
import { lookupDepartment } from "..";
import { IUnitProfile } from "../store";
import { Modal, closeModal } from "../../layout/Modal";
import { TrashCan } from "../../icons";

interface IFormProps
  extends InjectedFormProps<any>,
    IUnitProfile,
    IDispatchProps,
    IProps {}
interface IDispatchProps {
  closeModal: typeof closeModal;
  addDepartment: (d:any)=>any; // <-- todo: wire up redux store
  removeDepartment: (d:any)=>any; // <-- todo: wire up redux store
  lookupDepartment: typeof lookupDepartment;
}
interface IProps {
  filtered: IEntity[];
}

const form: React.SFC<IFormProps> = props => {
  const {addDepartment, removeDepartment, supportedDepartments, closeModal, filtered, reset, lookupDepartment} = props;
  const handleChange = (e: any) => {
    const q = e.target.value;
    lookupDepartment(q);
  };
  const addDepartmentForm = (
    <form>
      <div>
        <RivetInputField
          name="Search departments"
          component={RivetInput}
          label="Search departments"
          onChange={handleChange}
          onLoad={handleChange}
        />
      </div>

      {filtered && filtered.length > 0 && (
        <div
          className="rvt-dropdown__menu"
          style={{ position: "relative", padding: 0 }}
        >
          {filtered.map((department: any, i: number) => {
            return (
              <div key={i}>
                <Button
                  type="button"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    addDepartment(department)
                    closeModal();
                    reset();
                    lookupDepartment("");
                  }}
                >
                  {department && department.name}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </form>
  );

  return (
    <>
      <Modal
        id="add department to unit"
        title="+ add department"
        buttonText="+ add department"
        variant="plain"
      >
        <ModalBody>
          {addDepartmentForm}
        </ModalBody>
        <ModalControls>
          <Button type="button" onClick={closeModal} variant="plain">
            Cancel
          </Button>
        </ModalControls>
      </Modal>
      <List variant="plain">
        {supportedDepartments.map((department: any, index: number) => {
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
                    onClick={() => removeDepartment(department)}
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

let UpdateDepartmentsForm: any = reduxForm<IFormProps>({
  form: "updateUnitDepartments",
  enableReinitialize: true
})(form);

UpdateDepartmentsForm = connect(
  (state: IApplicationState) => {
    const filtered = state.lookup.current;
    return { filtered };
  },
  (dispatch: Dispatch): IDispatchProps => {
    return {
      lookupDepartment: (q: string) => {
        return dispatch(lookupDepartment(q));
      },
      closeModal: ()=> dispatch(closeModal()),
      addDepartment: (a)=>{}, // <-- todo: wire to redux actions
      removeDepartment: (a)=>{}, // <-- todo: wire to redux actions
    }
  }
)(UpdateDepartmentsForm);

export default UpdateDepartmentsForm;
