import * as React from "react";
import { List } from "rivet-react";
import { ITool, IToolGroup } from "src/components/types";
import { reduxForm } from "redux-form";

const form: React.SFC<any> = props => {

  return (
    <>
      {toolGroups.map(group => (
      <form onSubmit={props.handleSubmit}>
          <h2>{group.name}</h2>
          <p>{group.description}</p>
          <List variant="plain" padding={{ left: "lg", bottom: "md" }}>
            {group.tools.map((tool: ITool) => (
              <li>
                {/* TODO: add redux form */}
                {/* <RivetCheckboxField name={"tool-" + tool.id} value={tool.id} checked={tool.enabled} label={tool.name} /> */}

                {tool.name} 
              </li>
            ))}
          </List>
        </form>
      ))}
    </>);
}


// let canEditPermisions = () => true;
let toolGroups: IToolGroup[] = [
  {
    id: 0,
    name: "Box o' tools",
    tools: [
      {
        enabled: true,
        name: "Wrench",
        id: 0
      },
      {
        enabled: false,
        name: "Hammer",
        id: 0
      },
      {
        enabled: true,
        name: "Delta 18-900L Laser Drill Press",
        id: 0
      },
      {
        enabled: true,
        name: "Delta 46-460 Variable Speed Lathe",
        id: 0
      }
    ]
  },
  {
    id: 0,
    name: "Other tools",
    tools: [
      {
        enabled: true,
        name: "Screwdriver",
        id: 0
      },
      {
        enabled: false,
        name: "Superpass",
        id: 0
      }
    ]
  }
];

let UpdateMemberTools: any = reduxForm<IToolGroup[]>({
  form: "updateMemberTools",
  enableReinitialize: true
})(form);

// let selector = formValueSelector("updateMemberForm");
// UpdateMemberTools = connect()(UpdateMemberTools);

// Question: should this trigger an API call to fetch latest tools
// TODO: Get master list of tools - from redux store? Unit store?
// TODO: Get this user's enabled tools - List of IDs appended to Membership record or separate endpoint?

export { UpdateMemberTools };
