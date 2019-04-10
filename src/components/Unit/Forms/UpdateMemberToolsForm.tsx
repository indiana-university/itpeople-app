import * as React from "react";
import { IToolGroup, ITool } from "src/components/types";
import { reduxForm, FieldArray, InjectedFormProps, Field, WrappedFieldArrayProps, WrappedFieldProps } from "redux-form";
import { List, Button } from "rivet-react";
import { RivetCheckboxField, RivetCheckbox } from "src/components/form";

interface IFormProps extends InjectedFormProps<IForm> { }
interface IForm {
  tools: IToolGroup[]
}

const form: React.SFC<IFormProps> = props => {

  return (
    <>
      <form onSubmit={props.handleSubmit}>
        {console.log("TOOL GROUPS PROPS: " + JSON.stringify(props))}
        <FieldArray name="tools" component={renderTools} />
        <Button type="button">Update</Button>
      </form>
    </>
  );
}

const renderTools: any = (props: WrappedFieldArrayProps<IToolGroup>) => {

  return (
    // {/* TODO: add redux form */}
    // {/* <RivetCheckboxField name={"tool-" + tool.id} value={tool.id} checked={tool.enabled} label={tool.name} /> */}
    // {/* <Field name={tool} type="checkbox" component={renderTool} /> */}
    <List variant="plain">
      {props.fields.map((name: string, index: number) => (
        <li>
          <Field name={name} component={renderTool} />
        </li>
      ))}
    </List>
  );
}

const renderTool = ({ input: { value: toolGroup } }: WrappedFieldProps) => (
  <div>
    <h3>{toolGroup.name}</h3>
    <List variant="plain" padding={{left:"md"}}>
      {toolGroup.tools.map(({ id, name }: ITool, i: number) => {
        return (
          <li key={"" + toolGroup.name + i}>
            <RivetCheckboxField name={"tool"+id}  component={RivetCheckbox} label={name} />
          </li>
        )
      })}
    </List>
  </div>
)

let UpdateMemberTools: any = reduxForm<IForm>({
  form: "updateMemberTools",
  enableReinitialize: true
})(form);

export { UpdateMemberTools };
