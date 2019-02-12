import * as React from "react";
import { reduxForm, InjectedFormProps, formValueSelector } from "redux-form";
import { Button } from "rivet-react";
import { RivetInputField, RivetInput, RivetSelect, RivetSelectField, RivetCheckboxField, RivetCheckbox } from "src/components/form";
import { UitsRole, IUnitMember } from "../../types";
import { connect } from "react-redux";

interface IFormProps extends InjectedFormProps<IUnitMember>, IUnitMember {}

const form: React.SFC<IFormProps> = props => {
  const { person } = props;
  return (
    <>
      <form onSubmit={props.handleSubmit}>
        <div className="rvt-ts-23 rvt-text-bold">{person ? person.name : "vacant"}</div>
        <div>
          <RivetSelectField name="role" component={RivetSelect} label="Role">
            <option value={UitsRole.Member}>Member</option>
            <option value={UitsRole.Leader}>Leader</option>
            <option value={UitsRole.Sublead}>Sublead</option>
            <option value={UitsRole.Related}>Related</option>
          </RivetSelectField>
        </div>
        <div>
          <RivetInputField name="title" component={RivetInput} label="Title" />
          <label>
            <p>Display title in orgchart?</p>
            <RivetCheckboxField name="showTitle" component={RivetCheckbox} label="Yes" />
          </label>
        </div>
        <div>
          <RivetInputField name="percentage" component={RivetInput} label="Percentage" type="number" min="0" max="100" />
          <label>
            <p>Display percentage in orgchart? {props.showPercentage}</p>
            <RivetCheckboxField name="showPercentage" component={RivetCheckbox} label="Yes" />
          </label>
        </div>
        <div>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </>
  );
};

let UpdateMemberForm: any = reduxForm<IUnitMember>({
  form: "updateMemberForm",
  enableReinitialize: true
})(form);

let selector = formValueSelector("updateMemberForm");
UpdateMemberForm = connect(state => ({
  person: selector(state, "person"),
  title: selector(state, "title"),
  role: selector(state, "role")
}))(UpdateMemberForm);

export default UpdateMemberForm;
