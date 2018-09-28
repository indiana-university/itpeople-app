import * as React from 'react'
import { List } from "rivet-react";
import { IProps } from "../store/profile";

const ReadOnlyProfile : React.SFC<IProps> = 
({ user, roles }) => (
    <>
        <h2>User</h2>
        <List>
            <li><strong>NetId:</strong> {user.netId}</li>
            <li><strong>Name:</strong> {user.name}</li>
            <li><strong>Position:</strong> {user.position}</li>
            <li><strong>Campus:</strong> {user.locationCode}</li>
            <li><strong>Campus Location:</strong> {user.location || '(not provided)'}</li>
            <li><strong>Campus Email:</strong> {user.campusEmail}</li>
            <li><strong>Campus Phone:</strong> {user.campusPhone || '(not provided)'}</li>
        </List>
        <h2>Roles</h2>
        <List>
            {roles.map(r => (<li><strong>{r.department}:</strong> {r.role}</li>))}
        </List>
    </>
)
export default ReadOnlyProfile
