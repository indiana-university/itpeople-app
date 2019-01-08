import * as React from 'react';
import { reduxForm, InjectedFormProps, FieldArray, Field, FieldArrayFieldsProps } from 'redux-form';
import * as unit from '../store';
import { Breadcrumbs, Content, PageTitle } from 'src/components/layout';
import { Section, List, Button } from 'rivet-react';
import { RivetInputField, RivetInput, RivetTextarea, RivetTextareaField, required, url } from 'src/components/form';

interface IFormActions {
    save: typeof unit.saveRequest;
    cancel: typeof unit.cancel;
}

interface IFormProps extends
    unit.IUnitProfile, IFormActions, InjectedFormProps<unit.IUnitProfile, IFormActions> { }

interface IMemberField extends unit.IUnitMember { fieldId: number };

const renderParent = ({ input }: any) => {
    const unit = input.value;
    return <>
        <h4>{unit.name}</h4>
        {unit.description &&
            <p>{unit.description}</p>
        }

    </>
}

const renderChildren = ({ fields }: any) => {
    return <>
        <List variant="plain">
            {fields.map((field: any, index: number) => {
                const unit = fields.get(index);
                return (<li key={index}>
                    <Button
                        className="rvt-button--danger"
                        type="button"
                        title="Remove Unit"
                        onClick={() => fields.remove(index)}
                    >x</Button>
                    <h4>{unit.name}</h4>
                    {unit.description &&
                        <p>{unit.description}</p>
                    }
                </li>
                )
            }
            )}
        </List>
        <Button
            className="rvt-button"
            type="button"
            title="Add child unit"
            onClick={() => alert("Add child modal?")}
        >Add child</Button>
    </>
}

const renderDepartments = ({ fields }: any) => {
    return <>
        <List variant="plain">
            {fields.map((field: any, index: number) => {
                const department = fields.get(index);
                return (<li key={index}>
                    <Button
                        className="rvt-button--danger"
                        type="button"
                        title="Remove department"
                        onClick={() => fields.remove(index)}
                    >x</Button>
                    <h4>{department.name}</h4>
                    {department.description &&
                        <p>{department.description}</p>
                    }
                </li>
                )
            }
            )}
        </List>
        <Button
            className="rvt-button"
            type="button"
            title="Add department unit"
            onClick={() => alert("Add department modal")}
        >Add department</Button>
    </>
}

const renderMember = (member: IMemberField, index: number, fields: FieldArrayFieldsProps<any>) => (<li key={index}>
    <Button
        className="rvt-button--danger"
        type="button"
        title="Remove Member"
        onClick={() => fields.remove(member.fieldId)}
    >x</Button>
    <h4>{member.name}</h4>
    <div>{member.role}</div>
</li>)

const renderMembers = ({ fields }: any) => {
    let members = fields.map((target: any, index: number) => {
        let member = fields.get(index) as unit.IUnitMember;
        return { ...member, fieldId: index };
    }) as (unit.IUnitMember & { fieldId: number })[];
    let leaders = members.filter((m) => (m.role == unit.ItProRole.Admin || m.role == unit.UitsRole.Leader))
    let standardMember = members.filter((m) => (m.role == unit.ItProRole.Pro || m.role == unit.UitsRole.Member || m.role == unit.UitsRole.Sublead))
    let others = members.filter((m) => (m.role == unit.ItProRole.Aux || m.role == unit.UitsRole.Related))

    return <>
        <h2>Leadership</h2>
        <List variant="plain">
            {leaders.map((member, index) => renderMember(member, index, fields))}
        </List>

        <h2>Members</h2>
        <List variant="plain">
            {standardMember.map((member, index) => renderMember(member, index, fields))}
        </List>

        <h2>Other</h2>
        <List variant="plain">
            {others.map((member, index) => renderMember(member, index, fields))}
        </List>

        <Button type="button" onClick={() => alert("add member modal")}>Add Member</Button>
    </>;
}

const EditForm: React.SFC<IFormProps> = props =>
    <>
        <Breadcrumbs
            crumbs={[
                { text: "Home", href: "/" },
                { text: "Units", href: "/units" },
                props.name
            ]} />
        <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-bottom-xxl" >
            <PageTitle>Edit Unit</PageTitle>
            <Section>
                <form onSubmit={props.save}>
                    <div>
                        <RivetInputField name="name" component={RivetInput} label="Name" validate={[required]} />
                    </div>
                    <div>
                        <RivetTextareaField name="description" component={RivetTextarea} label="Description" validate={[required]} />
                    </div>
                    <div>
                        <RivetInputField name="url" component={RivetInput} label="URL" validate={[url]} />
                    </div>

                    <hr />
                    <h2>Members</h2>
                    <div>
                        <FieldArray name="members" component={renderMembers} />
                    </div>

                    <hr />
                    <h2>Parent</h2>
                    <div>
                        <Field name="parent" component={renderParent} />
                    </div>

                    <hr />
                    <h2>Children</h2>
                    <div>
                        <FieldArray name="children" component={renderChildren} />
                    </div>

                    <hr />
                    <h2>Supported departments</h2>
                    <div>
                        <FieldArray name="departments" component={renderDepartments} />
                    </div>

                    <code><pre>{JSON.stringify(props)}</pre></code>

                    <div>
                        <Button onClick={props.cancel}>Cancel</Button>
                        <Button type="submit" disabled={props.invalid}>Save</Button>
                    </div>

                </form>
            </Section>
        </Content>
    </>;

export default reduxForm<unit.IUnitProfile, IFormActions>({
    form: "editUnit",
    enableReinitialize: true
})(EditForm);

