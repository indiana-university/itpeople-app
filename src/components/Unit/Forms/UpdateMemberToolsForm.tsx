import * as React from "react";
import { IToolGroup, ITool } from "src/components/types";
import { reduxForm, FieldArray, InjectedFormProps, Field, WrappedFieldArrayProps, WrappedFieldProps } from "redux-form";
import { List, Button } from "rivet-react";
import { RivetCheckboxField, RivetCheckbox } from "src/components/form";

interface IFormProps extends InjectedFormProps<IForm>, IForm { }
interface IForm {
  tools: IToolGroup[],
  loading?: boolean
}

const form: React.SFC<IFormProps> = props => (<>
  <form onSubmit={props.handleSubmit}>
    <FieldArray name="toolGroups" component={renderGroups} />
    <Button type="submit">Update</Button>
  </form>
</>)

const renderGroups: any = (props: WrappedFieldArrayProps<IToolGroup>) => (<>
  <List variant="plain" padding={{ bottom: "md" }}>
    {props.fields.map((name: string, index: number) => (
      <li>
        <Field name={name} component={renderGroup} />
      </li>
    ))}
  </List>
</>)

const renderGroup = (fieldProps: WrappedFieldProps) => (<div>
  <h3>{fieldProps.input.value.name}</h3>
  <FieldArray name={fieldProps.input.name + "tools"} component={renderTools} />
</div>)

const renderTools: any = (props: WrappedFieldArrayProps<ITool>) => (<List variant="plain" padding={{ left: "md" }}>
  {props.fields.map((name, i: number) => (
    <li key={name + i}>
      <Field name={name} component={renderTool} />
    </li>
  ))}
</List>)

const renderTool = ({ input: { name, value: { name: toolName } } }: WrappedFieldProps) => (<RivetCheckboxField name={name + "enabled"} component={RivetCheckbox} label={toolName} />)

let UpdateMemberTools: any = reduxForm<IForm>({
  form: "updateMemberTools",
  enableReinitialize: false
})(form);

export { UpdateMemberTools };
