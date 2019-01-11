import * as React from 'react';
import { reduxForm, InjectedFormProps, formValueSelector } from 'redux-form';
import { Button } from 'rivet-react';
import { RivetInputField, RivetInput, required, RivetSelect, RivetSelectField } from 'src/components/form';
import { connect } from 'react-redux';
import { IApplicationState } from 'src/components/types';
import { UitsRole, ItProRole } from '../store';

interface IFormProps extends InjectedFormProps<any>, IMemberFields {
    onSubmit: (e?: any) => any
}
interface IMemberFields {
    name: string;
    title: string;
    role: UitsRole | ItProRole
}

const AddMemberForm: React.SFC<IFormProps> = props => {
    return <>
        <form onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            props.onSubmit({
                name: props.name,
                title: props.title,
                role: props.role
            })
            props.reset();
        }}>
            <div>
                <RivetInputField name="name" component={RivetInput} label="Name" validate={[required]} />
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
                <Button type="submit" disabled={props.invalid}>Save</Button>
            </div>
        </form>
    </>;
}

let addMemberForm: any = reduxForm<IFormProps>({
    form: "addMemberForm",
    enableReinitialize: true
})(AddMemberForm);


// Decorate with connect to read form values
const selector = formValueSelector('addMemberForm') // <-- same as form name
addMemberForm = connect(
    (state: IApplicationState) => {
        const name = selector(state, "name");
        const title = selector(state, "title");
        const role = selector(state, "role");
        return { name, title, role }
    }
)(addMemberForm)

export default addMemberForm;