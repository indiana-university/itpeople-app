import * as React from 'react'
import { IDepartmentList } from "./store";
import PageTitle from '../layout/PageTitle';

const Presentation: React.SFC<IDepartmentList> =
    (props) => {
        return (
            <>
                <PageTitle>Departments</PageTitle>
                <caption className="sr-only">List of Departments</caption>
                <ul>
                    {props.departments.map((r, i) => (
                        <li>
                            <a href={`/departments/${r.id}`}>{r.name}</a>
                            <div>{r.description}</div>
                        </li>
                    ))}
                </ul>
            </>
        )
    }
export default Presentation
