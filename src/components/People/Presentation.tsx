import * as React from 'react'
import { IEntity } from '../types';
import { ProfileList } from './ProfileList';

interface IProps {
    users?: IEntity[]
}
const Presentation: React.SFC<IProps> = (props) => {
    const users = props.users || [];

    return (<div>
        {users && users.length &&
           
            <ProfileList users={users} />
           }
    </div>)
}


export default Presentation