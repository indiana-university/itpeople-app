import * as React from "react";
import { reduxForm, InjectedFormProps } from "redux-form";
import * as unit from "../store";
import { Section, Button } from "rivet-react";
import {
  RivetInputField,
  RivetInput,
  RivetTextarea,
  RivetTextareaField,
  required,
  url
} from "src/components/form";
import { connect } from "react-redux";
import { IApplicationState } from "src/components/types";
import { Dispatch } from "redux";


interface IDispatchActions {
  save: typeof unit.saveRequest;
  close: typeof unit.cancel;
}

interface IFormProps
  extends unit.IUnitProfile,
    IDispatchActions,
    InjectedFormProps<unit.IUnitProfile, IDispatchActions> {}

let UpdateUnitForm: React.SFC<IFormProps> | any = (props: IFormProps) => {
  const onSave = (e: React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    props.save();
    props.close();
  };

  return (
    <form onSubmit={onSave}>
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
      <Button>Save</Button>
    </form>
  );
};

UpdateUnitForm = reduxForm<unit.IUnitProfile, IDispatchActions>({
  form: "updateUnitForm",
  enableReinitialize: true
})(UpdateUnitForm);

UpdateUnitForm = connect(
  (state: IApplicationState) => {
    const unit = state.unit;
    return { initialValues: unit.data };
  },
  (dispatch: Dispatch): IDispatchActions => ({
    save: () => dispatch(unit.saveRequest()),
    close: () => dispatch(unit.cancel())
  })
)(UpdateUnitForm);

export default UpdateUnitForm;
