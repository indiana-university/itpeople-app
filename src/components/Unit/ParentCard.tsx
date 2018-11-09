import * as React from 'react'
import { IEntity } from "../types";

interface IProps {
    parent?: IEntity
}
export const ParentCard: React.SFC<IProps> = (props) => {
    const parent = props.parent;
    return (
        <>
            {
                parent && 
                <div className="rvt-panel rvt-m-bottom-xl">
                    <h2 className="rvt-ts-20 rvt-ts-26-lg-up">
                        <svg width="41" height="35" viewBox="0 0 41 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0)">
                                <rect width="41" height="35" />
                                <rect x="15.3528" y="0.5" width="10.2944" height="10.2904" fill="#DF3603" stroke="black" />
                                <rect x="15.3528" y="24.21" width="10.2944" height="10.2904" fill="#C4C4C4" stroke="black" />
                                <rect x="30.2056" y="24.21" width="10.2944" height="10.2904" fill="#C4C4C4" stroke="black" />
                                <rect x="0.5" y="24.21" width="10.2944" height="10.2904" fill="#C4C4C4" stroke="black" />
                                <line x1="20.0001" y1="23.71" x2="20.0001" y2="11.2905" stroke="black" />
                                <path d="M35.585 24.1118V16.334H5.4151V24.1118" stroke="black" />
                            </g>
                            <defs>
                                <clipPath id="clip0">
                                    <rect width="41" height="35" fill="white" />
                                </clipPath>
                            </defs>
                        </svg> Parent</h2>

                    <div className="related-group rvt-m-bottom-md" id="ua-vpit">
                        <a href={parent.id + ""} className="rvt-m-bottom-remove related-group-item-name rvt-text-bold">{parent.name}</a>
                        {parent.description &&
                            <p className="rvt-ts-14 rvt-m-top-remove rvt-m-bottom-remove">{parent.description}</p>
                        }
                    </div>
                </div>
            }
        </>
    )
}