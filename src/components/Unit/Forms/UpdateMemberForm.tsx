import * as React from 'react';
import { reduxForm, InjectedFormProps, Field, formValueSelector } from 'redux-form';
import { Button } from 'rivet-react';
import { RivetInputField, RivetInput, RivetSelect, RivetSelectField } from 'src/components/form';
import { UitsRole, ItProRole } from '../store';
import { connect } from 'react-redux';

interface IFormProps extends InjectedFormProps<any>, IMemberFields {
    onSubmit: (e?: any) => any,
    field: Field,
}
interface IMemberFields {
    name: string;
    title: string;
    role: UitsRole | ItProRole | string,
    set: (f: string, v: string | any) => any
}

const form: React.SFC<IFormProps> = props => {
    return <>
        <form onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            props.onSubmit && props.onSubmit({
                name: props.name,
                title: props.title,
                role: props.role
            });
        }}>
            <div>
                <h1>{props.name}</h1>
                <pre>{JSON.stringify(props)}</pre>
                <Field name="id" component="input" type="hidden" />
            </div>
            <div>
                <Field name="title" component="input" /> 
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
    </>;
}

let UpdateMemberForm: any = reduxForm<IFormProps>({
    form: "updateMemberForm",
    enableReinitialize: true,
})(form);

let selector = formValueSelector("updateMemberForm");
UpdateMemberForm = connect(state => ({
    title: selector(state, 'title'),
    role: selector(state, 'role')
  }))(UpdateMemberForm)


export default UpdateMemberForm;