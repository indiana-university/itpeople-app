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

const ProfileForm : React.SFC<IApiState2<profile.IUser> & IProfileFormProps & InjectedFormProps<{}, profile.IUser & IProfileFormProps>> = 
({ loading, error, data, onSubmit }) => {

    const handleSubmit = (e:any)=> {
        e.preventDefault();
        const id = data ? data.id : 0
        onSubmit({id});
    }

    return (
            <>
                { !data && loading && <p>Loading...</p>}
                { data && 
                  <>
                    <h2>User</h2>
                    <List>
                        <li><strong>NetId:</strong> {data.netId}</li>
                        <li><strong>Name:</strong> {data.name}</li>
                        <li><strong>Position:</strong> {data.position}</li>
                        <li><strong>Campus:</strong> {data.locationCode}</li>
                        <li><strong>Campus Location:</strong> {data.location || '(not provided)'}</li>
                        <li><strong>Campus Email:</strong> {data.campusEmail}</li>
                        <li><strong>Campus Phone:</strong> {data.campusPhone || '(not provided)'}</li>
                    </List>
                    <h2>Roles</h2>
                    <List>
                        {data.serviceOrgs.map((r,i) => (<li key={i}><strong>{r.name}:</strong></li>))}
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
