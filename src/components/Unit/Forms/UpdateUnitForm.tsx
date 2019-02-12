import * as React from "react";
import { reduxForm, InjectedFormProps } from "redux-form";
import * as unit from "../store";
import { Section, Button } from "rivet-react";
import { RivetInputField, RivetInput, RivetTextarea, RivetTextareaField, required, url } from "src/components/form";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IUnit } from "src/components/types";

interface IDispatchActions {
  save: typeof unit.saveUnitProfileRequest;
  close: typeof unit.cancel;
}

interface IFormProps extends IUnit, IDispatchActions, InjectedFormProps<IUnit, IDispatchActions> {}

let UpdateUnitForm: React.SFC<IFormProps> | any = ({close,save,handleSubmit}: IFormProps) => {
  const doHandle = (values: IUnit) => {
    save(values);
    close();
  };
  
  return (
    <form onSubmit={handleSubmit(doHandle)} >
      <Section className="rvt-p-bottom-sm">
        <div>
          <RivetInputField name="name" component={RivetInput} label="Name" validate={[required]} />
        </div>
        <div>
          <RivetTextareaField name="description" component={RivetTextarea} label="Description" />
        </div>
        <div>
          <RivetInputField name="url" component={RivetInput} label="URL" validate={[url]} />
        </div>
      </Section>
      <Button>Save</Button>
    </form>
  );
};

UpdateUnitForm = reduxForm<IUnit, IDispatchActions>({
  form: "updateUnitForm",
  enableReinitialize: true
})(UpdateUnitForm);

UpdateUnitForm = connect(
  undefined,
  (dispatch: Dispatch): IDispatchActions => ({
    save: (updated: IUnit) => dispatch(unit.saveUnitProfileRequest(updated)),
    close: () => dispatch(unit.cancel())
  })
)(UpdateUnitForm);

export default UpdateUnitForm;
