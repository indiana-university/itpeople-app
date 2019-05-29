import * as React from "react";
import { reduxForm, FieldArray, InjectedFormProps, Field, WrappedFieldArrayProps, WrappedFieldProps } from "redux-form";
import { List, Button } from "rivet-react";
import { RivetCheckboxField, RivetCheckbox } from "src/components/form";
import { JobClassDisplayNames } from "../Container";

interface IFormProps extends InjectedFormProps<IForm>, IForm { }
interface IForm {
  responsibilities: string[],
  loading?: boolean
}

const form: React.SFC<IFormProps> = ({ responsibilities, handleSubmit }) =>
  <form onSubmit={handleSubmit}>
    <FieldArray name="responsibilities" component={renderResponsibilities} />
    <Button type="submit">Update</Button>
  </form>

const renderResponsibilities: any = (props: WrappedFieldArrayProps<string>) =>
  <List variant="plain" padding={{ left: "md" }}>
    {props.fields.map((name, i: number) => (
      <li key={name + i}>
        <Field name={name} component={renderTool} />
      </li>
    ))}
  </List>

const renderTool = ({ input: { name, value: { name: toolName } } }: WrappedFieldProps) =>
  <RivetCheckboxField name={name + "enabled"} component={RivetCheckbox} label={JobClassDisplayNames[toolName] || toolName} />

let EditJobClasses: any = reduxForm<IForm>({
  form: "updateResponsibilities",
  enableReinitialize: false
})(form);

export { EditJobClasses };
