import * as React from "react";
import { reduxForm, InjectedFormProps, formValueSelector } from "redux-form";
import { Button } from "rivet-react";
import { RivetInputField, RivetInput, RivetSelect, RivetSelectField, RivetTextareaField, RivetTextarea, percentage } from "src/components/form";
import { UitsRole, IUnitMember, UnitPermissions } from "../../types";
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
          <RivetSelectField name="permissions" component={RivetSelect} label="Unit permissions">
            <option value={UnitPermissions.Viewer}>Viewer</option>
            <option value={UnitPermissions.Owner}>Owner</option>
            <option value={UnitPermissions.ManageMembers}>Manage Members</option>
            <option value={UnitPermissions.ManageTools}>Manage Tools</option>
          </RivetSelectField>
        </div>
        <div>
          <RivetInputField name="title" component={RivetInput} label="Title" />
        </div>
        <div>
          <RivetInputField name="percentage" component={RivetInput} label="Percentage" type="number" validate={percentage} />
        </div>
        <div>
          <RivetTextareaField name="notes" component={RivetTextarea} label="Notes" />
        </div>
        <div className="rvt-m-top-md">
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
