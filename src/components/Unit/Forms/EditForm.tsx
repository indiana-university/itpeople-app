import * as React from 'react';
import { reduxForm, InjectedFormProps, FieldArray, Field } from 'redux-form';
import * as unit from '../store';
import { Breadcrumbs, Content, PageTitle } from 'src/components/layout';
import { Section, List, Button, Row, Col, ModalBody } from 'rivet-react';
import { Modal, closeModal } from '../../layout/Modal'
import { RivetInputField, RivetInput, RivetTextarea, RivetTextareaField, required, url } from 'src/components/form';
import { TrashCan, ArrowUp, ArrowDown, ParentUnitIcon, ChildrenUnitsIcon } from 'src/components/icons';
import AddMemeberForm from './AddMemeberForm';
import { connect } from 'react-redux';
import UpdateParentForm from './UpdateParentForm';
import AddChildForm from './AddChildForm';
import AddDepartmentForm from './AddDepartmentFrom';
import { Panel } from 'src/components/Panel';

interface IFormActions {
    save: typeof unit.saveRequest;
    cancel: typeof unit.cancel;
    closeModal: typeof closeModal
}

interface IFormProps extends unit.IUnitProfile, IFormActions, InjectedFormProps<unit.IUnitProfile, IFormActions> { }

interface IMemberField extends unit.IUnitMember { fieldId: number };
let modalClose = () => { };
let EditForm: React.SFC<IFormProps> | any = (props: IFormProps) => {
    modalClose = props.closeModal;
    return <>
        <Breadcrumbs
            crumbs={[
                { text: "Home", href: "/" },
                { text: "Units", href: "/units" },
                props.name
            ]} />
        <form onSubmit={props.save}>
            <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-bottom-xxl" >
                <Button onClick={props.cancel} type="button" style={{ float: "right" }}>Cancel</Button>
                <PageTitle>Edit Unit</PageTitle>
                <Section>
                    <div>
                        <RivetInputField name="name" component={RivetInput} label="Name" validate={[required]} />
                    </div>
                    <div>
                        <RivetTextareaField name="description" component={RivetTextarea} label="Description" validate={[required]} />
                    </div>
                    <div>
                        <RivetInputField name="url" component={RivetInput} label="URL" validate={[url]} />
                    </div>

                </Section>
            </Content>
            <Content className="rvt-bg-white rvt-p-tb-lg rvt-m-bottom-xxl" >
                <Row>
                    <Col md={6}>
                        <div>
                            <FieldArray name="members" component={renderMembers} />
                        </div>
                    </Col>
                    <Col md={6}>
                        <Panel title="Parents and children">
                            <h2 className="rvt-text-bold">Parent</h2>
                            <p>A parent is a step higher on the org chart. If your unit is part of a larger group, add that group here.</p>
                            <div>
                                <Field name="parent" component={renderParent} />
                            </div>

                            <h2 className="rvt-text-bold rvt-m-top-xxl">Children</h2>
                            <p>A child is a step lower on the org chart. If this unit has groups associated with it, add those groups here.</p>
                            <div>
                                <FieldArray name="children" component={renderChildren} />
                            </div>
                        </Panel>

                        <Panel title="Supported Departments">
                            <p>Some units provide support for departments. If this unit supports other departments, add them here.</p>
                            <div>
                                <FieldArray name="supportedDepartments" component={renderDepartments} />
                            </div>
                        </Panel>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div>
                            <Button type="submit" disabled={props.invalid}>Save Edits</Button>
                            <Button onClick={props.cancel} variant="plain">Cancel</Button>
                        </div>
                    </Col>
                </Row>
            </Content>
        </form>

    </>
};


const renderMembers = ({ fields }: any) => {
    let members = fields.map((target: any, index: number) => {
        let member = fields.get(index) as unit.IUnitMember;
        return { ...member, fieldId: index };
    }) as IMemberField[];
    let leaders = members.filter((m) => (m.role == unit.ItProRole.Admin || m.role == unit.UitsRole.Leader))
    let standardMember = members.filter((m) => (m.role == unit.ItProRole.Pro || m.role == unit.UitsRole.Member || m.role == unit.UitsRole.Sublead))
    let others = members.filter((m) => (m.role == unit.ItProRole.Aux || m.role == unit.UitsRole.Related))

    return <>

        <h2 className="rvt-ts-29 rvt-text-bold">Unit Leadership</h2>
        <p>Use Leadership for VPs directors and managers. Click on the person’s name to edit more detailed information about their role within this unit.</p>
        <List variant="plain" className="list-dividers list-dividers--show-last">
            {
                leaders.map((member, index) => {
                    const moveDown = leaders[index + 1] ? () => { fields.swap(member.fieldId, leaders[index + 1].fieldId) } : undefined;
                    const moveUp = leaders[index - 1] ? () => { fields.swap(member.fieldId, leaders[index - 1].fieldId) } : undefined;
                    const remove = () => { fields.remove(index) };
                    return renderMember(member, index, remove, moveUp, moveDown)
                })}
        </List>

        <h2 className="rvt-ts-29 rvt-text-bold">Unit Members</h2>
        <p>Use Related People for admins and others who are do not solely report to this unit. Click on the person’s name to edit more detailed information about their role within this unit.</p>

        <List variant="plain" className="list-dividers list-dividers--show-last">
            {
                standardMember.map((member, index) => {
                    const moveDown = standardMember[index + 1] ? () => { fields.swap(member.fieldId, standardMember[index + 1].fieldId) } : undefined;
                    const moveUp = standardMember[index - 1] ? () => { fields.swap(member.fieldId, standardMember[index - 1].fieldId) } : undefined;
                    const remove = () => { fields.remove(index) };
                    return renderMember(member, index, remove, moveUp, moveDown)
                })}
        </List>

        <h2 className="rvt-ts-29 rvt-text-bold">Related people</h2>
        <p>Use Related People for admins and others who are do not solely report to this unit. Click on the person’s name to edit more detailed information about their role within this unit.</p>

        <List variant="plain" className="list-dividers list-dividers--show-last">
            {
                others.map((member, index) => {
                    const moveDown = others[index + 1] ? () => { fields.swap(member.fieldId, others[index + 1].fieldId) } : undefined;
                    const moveUp = others[index - 1] ? () => { fields.swap(member.fieldId, others[index - 1].fieldId) } : undefined;
                    const remove = () => { fields.remove(index) };
                    return renderMember(member, index, remove, moveUp, moveDown)
                })}
        </List>
        <Modal
            id="Add member to unit"
            title="Modal Dialog"
            buttonText="Add Member"
        >
            <ModalBody>
                <AddMemeberForm onSubmit={(member: any) => {
                    fields.push(member);
                    console.log(member)
                    modalClose();
                }} />
            </ModalBody>
        </Modal>
    </>;
}

const renderMember = (
    member: IMemberField,
    index: number,
    remove?: () => any,
    moveUp?: () => any,
    moveDown?: () => any) => (<li key={index}>
        <Row>
            <Col>
                <Button
                    title={"Edit: " + member.name}
                    type="button"
                    variant="plain"
                    className="rvt-p-all-remove"
                    style={{ border: 0 }}
                    onClick={() => { alert("edit members") }}
                >{member.name}</Button>
                <div>{member.role}</div>
            </Col>
            <Col last={true} md={3} style={{ textAlign: "right" }}>
                {moveUp && <Button
                    className="rvt-button--plain"
                    type="button"
                    title="Move Member"
                    onClick={moveUp}
                ><ArrowUp /></Button>
                }
                {moveDown &&
                    <Button
                        className="rvt-button--plain"
                        type="button"
                        title="Move Member"
                        onClick={moveDown}
                    ><ArrowDown /></Button>
                }
                {remove && <Button
                    className="rvt-button--plain"
                    type="button"
                    title="Remove Member"
                    onClick={remove}
                ><TrashCan /></Button>
                }
            </Col>
        </Row>
    </li>)

const renderParent = ({ input }: any) => {
    return <>
        <Modal
            id="update unit parents"
            title="Update Parent"
            buttonText="Update parent"
        >
            <ModalBody>
                <UpdateParentForm onSubmit={(parent: any) => {
                    input.onChange(parent);
                    modalClose();
                }} />
            </ModalBody>
        </Modal>

        <Row className="rvt-m-top-md">
            <Col style={{ minWidth: 60, flexGrow: 0 }}><ParentUnitIcon /></Col>
            <Col><h4>{input.value.name}</h4></Col>
            <Col style={{ minWidth: 60, flexGrow: 0 }}>
                <Button
                    className="rvt-button--plain"
                    type="button"
                    title="Remove Member"
                    onClick={() => input.onChange(null)}
                ><TrashCan /></Button>
            </Col>
        </Row>


        {input.value.description &&
            <Row className="rvt-grid">
                <Col style={{ minWidth: 60, flexGrow: 0 }} />
                <Col className="rvt-grid__item">{input.value.description}</Col>
            </Row>
        }

    </>
}

const renderChildren = ({ fields }: any) => {
    return <>
        <Modal title="Add child unit" id="Add child unit" buttonText="Add child">
            <ModalBody>
                <AddChildForm onSubmit={(child: any) => {
                    fields.push(child);
                    modalClose()
                }} />
            </ModalBody>
        </Modal>
        <List variant="plain">
            {fields.map((field: any, index: number) => {
                const unit = fields.get(index);
                return (<li key={index}>
                    <Row>
                        <Col style={{ minWidth: 60, flexGrow: 0 }}><ChildrenUnitsIcon width="100%" height="auto" /></Col>
                        <Col><h4>{unit.name}</h4></Col>
                        <Col style={{ minWidth: 150, flexGrow: 0, textAlign: "right" }}>
                            {fields.get(index - 1) &&
                                <Button
                                    variant="plain"
                                    type="button"
                                    title="Move Unit up"
                                    onClick={() => fields.swap(index, index - 1)}
                                ><ArrowUp /></Button>
                            }
                            {fields.get(index + 1) &&
                                <Button
                                    variant="plain"
                                    type="button"
                                    title="Move Unit down"
                                    onClick={() => fields.swap(index, index + 1)}
                                ><ArrowDown /></Button>
                            }
                            <Button
                                variant="plain"
                                type="button"
                                title="Remove Unit"
                                onClick={() => fields.remove(index)}
                            ><TrashCan /></Button>
                        </Col>
                    </Row>
                    {unit.description &&
                        <Row className="rvt-grid">
                            <Col style={{ minWidth: 60, flexGrow: 0 }} />
                            <Col className="rvt-grid__item">{unit.description}</Col>
                        </Row>
                    }
                </li>
                )
            }
            )}
        </List>
    </>
}

const renderDepartments = ({ fields }: any) => {
    return <>
        <Modal id="add department to unit" title="Add department" buttonText="Add department">
            <ModalBody>
                <AddDepartmentForm onSubmit={(department: any) => {
                    console.log(department);
                    fields.push(department);
                    modalClose();
                }} />
            </ModalBody>
        </Modal>
        <List variant="plain">
            {fields.map((field: any, index: number) => {
                const department = fields.get(index);
                return (<li key={index}>
                    <Row>
                        <Col>
                            <h4>{department.name}</h4>
                        </Col>
                        <Col style={{ flexGrow: 0, minWidth: 150, textAlign: "right" }}>
                            {fields.get(index - 1) &&
                                <Button
                                    variant="plain"
                                    type="button"
                                    title="Move department up"
                                    onClick={() => fields.swap(index, index - 1)}
                                ><ArrowUp /></Button>
                            }
                            {fields.get(index + 1) &&
                                <Button
                                    variant="plain"
                                    type="button"
                                    title="Move department down"
                                    onClick={() => fields.swap(index, index + 1)}
                                ><ArrowDown /></Button>
                            }
                            <Button
                                variant="plain"
                                type="button"
                                title="Remove Department"
                                onClick={() => fields.remove(index)}
                            ><TrashCan /></Button>
                        </Col>
                    </Row>
                    {department.description &&
                        <Row>
                            <Col>{department.description}</Col>
                        </Row>
                    }
                </li>
                )
            }
            )}
        </List>
    </>
}

EditForm = reduxForm<unit.IUnitProfile, IFormActions>({
    form: "editUnit",
    enableReinitialize: true
})(EditForm);

EditForm = connect(null, {
    closeModal: closeModal
})(EditForm)

export default EditForm;
