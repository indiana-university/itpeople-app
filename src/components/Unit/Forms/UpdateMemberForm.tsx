import * as React from "react";
import { reduxForm, InjectedFormProps, formValueSelector } from "redux-form";
import { Button } from "rivet-react";
import { RivetInputField, RivetInput, RivetSelect, RivetSelectField } from "src/components/form";
import { UitsRole, IUnitMember } from "../store";
import { connect } from "react-redux";

interface IFormProps extends InjectedFormProps<IUnitMember>, IUnitMember {}

const form: React.SFC<IFormProps> = props => {
  const { person } = props;
  return (
    <>
      <form onSubmit={props.handleSubmit}>
        <div>
          <h1>{person && person.name}</h1>
        </div>
        <div>
          <RivetInputField name="title" component={RivetInput} label="Title" />
        </div>
        <div>
          <RivetSelectField name="role" component={RivetSelect} label="Role">
            <option value={UitsRole.Member}>Member</option>
            <option value={UitsRole.Leader}>Leader</option>
            <option value={UitsRole.Sublead}>Sublead</option>
            <option value={UitsRole.Related}>Related</option>
          </RivetSelectField>
        </div>
        <hr />
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
