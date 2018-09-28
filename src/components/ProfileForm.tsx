import * as React from 'react'
import { Field,InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Form, Input, List } from "rivet-react";
import { IApiState2 } from '../store/common';
import * as profile from "../store/profile"

interface IProfileFormProps {
    onSubmit: typeof profile.updateRequest
}

const ix = (props:any) => (
    <Input {...props.input} {...props} />
)

const ProfileForm : React.SFC<IApiState2<profile.IProps> & IProfileFormProps & InjectedFormProps<{}, profile.IProps & IProfileFormProps>> = 
({ loading, error, data, onSubmit }) => {

    const handleSubmit = (e:any)=> {
        e.preventDefault();
        const id = data && data.user ? data.user.id : 0
        onSubmit({id});
    }

    return (
            <>
                { !data && loading && <p>Loading...</p>}
                { data && data.user && 
                  <>
                    <h2>User</h2>
                    <List>
                        <li><strong>NetId:</strong> {data.user.netId}</li>
                        <li><strong>Name:</strong> {data.user.name}</li>
                        <li><strong>Position:</strong> {data.user.position}</li>
                        <li><strong>Campus:</strong> {data.user.locationCode}</li>
                        <li><strong>Campus Location:</strong> {data.user.location || '(not provided)'}</li>
                        <li><strong>Campus Email:</strong> {data.user.campusEmail}</li>
                        <li><strong>Campus Phone:</strong> {data.user.campusPhone || '(not provided)'}</li>
                    </List>
                    <h2>Roles</h2>
                    <List>
                        {data.roles.map((r,i) => (<li key={i}><strong>{r.department}:</strong> {r.role}</li>))}
                    </List>
                    <Form  label="Profile update" labelVisibility="screen-reader-only" method="GET" onSubmit={handleSubmit}>
                        <Field type="text" name="expertise" component={ix} label="Expertise" margin={{ bottom: 'md' }}/>        
                        <Button type="submit" disabled={loading}>Update</Button>
                    </Form>
                  </>
                }
            </>
        )
    
}

export default reduxForm({form:'profile'})(ProfileForm)
