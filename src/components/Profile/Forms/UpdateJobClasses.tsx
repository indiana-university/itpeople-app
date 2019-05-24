import * as React from "react";
import { reduxForm, FieldArray, InjectedFormProps, Field, WrappedFieldArrayProps, WrappedFieldProps } from "redux-form";
import { List, Button } from "rivet-react";
import { RivetCheckboxField, RivetCheckbox } from "src/components/form";

interface IFormProps extends InjectedFormProps<IForm>, IForm { }
interface IForm {
  jobClasses: string[],
  loading?: boolean
}

const form: React.SFC<IFormProps> = props => {
  const { jobClasses } = props;
  return <form onSubmit={props.handleSubmit}>
    <FieldArray name="jobClasses" component={renderJobClasses} />
    <Button type="submit">Update</Button>
    {jobClasses.map(j => <div key={j}>{j}</div>)}
  </form>
}
const renderJobClasses: any = (props: WrappedFieldArrayProps<string>) => {
  console.log("***props", props)
  return (
    <List variant="plain" padding={{ left: "md" }}>
      {props.fields.map((name, i: number) => (
        <li key={name + i}>
          <Field name={name} component={renderTool} />
        </li>
      ))}
    </List>)
}

const renderTool = ({ input: { name, value: { name: toolName } } }: WrappedFieldProps) => (
  <RivetCheckboxField name={name + "enabled"} component={RivetCheckbox} label={toolName} />)

let UpdateJobClasses: any = reduxForm<IForm>({
  form: "updateJobClasses",
  enableReinitialize: false
})(form);

export { UpdateJobClasses };
