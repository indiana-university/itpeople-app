import * as React from 'react'
import { IEntity } from '../types';

interface IProps {
    users?: IEntity[]
}
const Presentation: React.SFC<IProps> = (props) => {
    const users = props.users || [];

    return (<div>
        {users && users.length &&
            users.map((user) => (
                <div>
                    <a href={"/profiles/" + user.id}>{user.name}</a>
                </div>
            ))}
    </div>)
}


export default Presentation