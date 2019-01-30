import * as React from "react";
import { reduxForm, InjectedFormProps, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { Button, ModalBody, ModalControls, Row, Col } from "rivet-react";
import { RivetInputField, RivetInput, required } from "../../form";
import { IApplicationState } from "../../types";
import { Dispatch } from "redux";
import { lookupUnit, saveUnitRequest, IUnit } from "../store";
import { Modal, closeModal } from "../../layout/Modal";
import { ParentUnitIcon, TrashCan } from "../../icons";

interface IFormProps extends InjectedFormProps<IFields>, IFields, IDispathProps, IProps {}

interface IDispathProps {
  closeModal: typeof closeModal;
  lookupUnit: typeof lookupUnit;
  save: typeof saveUnitRequest;
}
interface IFields {
  unit: IUnit;
  parent: IUnit;
}
interface IProps {
  units: any;
}

const form: React.SFC<IFormProps> = props => {
  const { closeModal, lookupUnit, save, unit, parent } = props;

  const EditParentForm = (
    <>
      <form>
        <div>
          <RivetInputField
            name="q"
            component={RivetInput}
            label="Search"
            validate={[required]}
            onChange={(e: any) => {
              const q = e.target.value;
              lookupUnit(q);
            }}
            onLoad={(e: any) => {
              const q = e.target.value;
              lookupUnit(q);
            }}
          />
        </div>

        {props.units && props.units.length > 0 && (
          <div className="rvt-dropdown__menu" style={{ position: "relative", padding: 0 }}>
            {props.units.map((u: any, i: number) => {
              // todo: circular reference check
              return (
                <div key={i}>
                  <Button
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      closeModal();
                      save({ ...unit, parentId: u.id });
                      props.reset();
                      props.lookupUnit("");
                    }}
                  >
                    {u && u.name}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </form>
    </>
  );
  return (
    <>
      <Modal id="update unit parents" title="Update Parent" buttonText="+ Add new parent" variant="plain">
        <ModalBody>{EditParentForm}</ModalBody>
        <ModalControls>
          <Button type="button" onClick={closeModal} variant="plain">
            Cancel
          </Button>
        </ModalControls>
      </Modal>

      {parent && (
        <>
          <Row className="rvt-m-top-md">
            <Col style={{ minWidth: 60, flexGrow: 0 }}>
              <ParentUnitIcon />
            </Col>
            <Col>
              <h4>{parent.name}</h4>
            </Col>
            <Col style={{ minWidth: 60, flexGrow: 0 }}>
              <Button
                className="rvt-button--plain"
                type="button"
                title="Remove Parent"
                onClick={() => save({ ...unit, parentId: undefined })}
              >
                <TrashCan />
              </Button>
            </Col>
          </Row>
          {parent.description && (
            <Row className="rvt-grid">
              <Col style={{ minWidth: 60, flexGrow: 0 }} />
              <Col className="rvt-grid__item">{parent.description}</Col>
            </Row>
          )}
        </>
      )}
    </>
  );
};

let UpdateParentForm: any = reduxForm<IFields>({
  form: "updateUnitParent",
  enableReinitialize: true
})(form);

const selector = formValueSelector("updateUnitParent");
UpdateParentForm = connect(
  (state: IApplicationState) => {
    const id = selector(state, "id");
    const units = state.lookup.current;
    return { id, units };
  },
  (dispatch: Dispatch): IDispathProps => ({
    closeModal: () => dispatch(closeModal()),
    lookupUnit: (q: string) => dispatch(lookupUnit(q)),
    save: unit => dispatch(saveUnitRequest(unit))
  })
)(UpdateParentForm);

export default UpdateParentForm;
