import * as React from "react";
import { ITool } from "src/components/types";
import { reduxForm, FieldArray, InjectedFormProps, Field, WrappedFieldArrayProps, WrappedFieldProps } from "redux-form";
import { List, Button } from "rivet-react";
import { RivetCheckboxField, RivetCheckbox } from "src/components/form";

interface IFormProps extends InjectedFormProps<IForm>, IForm { }
interface IForm {
  tools: ITool[],
  loading?: boolean
}

const form: React.SFC<IFormProps> = props => (
<>
  <form onSubmit={props.handleSubmit}>
    <FieldArray name="tools" component={renderTools} />
    <Button type="submit">Update</Button>
  </form>
</>)

const renderTools: any = ({fields}: WrappedFieldArrayProps<ITool>) => (
  <List variant="plain" padding={{ left: "md" }}>
    {fields.map((name, i: number) => (
      <li key={name + i}>
        <Field name={name} component={renderTool} />
      </li>
    ))}
  </List>)

const renderTool = ({ input: { name, value: { name: toolName } } }: WrappedFieldProps) => (
  <RivetCheckboxField name={name + "enabled"} component={RivetCheckbox} label={toolName} />)

let UpdateMemberTools: any = reduxForm<IForm>({
  form: "updateMemberTools",
  enableReinitialize: false
})(form);

export { UpdateMemberTools };
