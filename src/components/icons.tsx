/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from "react";

export const ChildrenUnitsIcon: React.SFC<IIconProps> = props => (
  <>
    <svg
      width="41"
      height="35"
      viewBox="0 0 41 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0)">
        <rect width="41" height="35" />
        <rect
          x="15.3528"
          y="0.5"
          width="10.2944"
          height="10.2904"
          fill="#C4C4C4"
          stroke="black"
        />
        <rect
          x="15.3528"
          y="24.21"
          width="10.2944"
          height="10.2904"
          fill="#DF3603"
          stroke="black"
        />
        <rect
          x="30.2056"
          y="24.21"
          width="10.2944"
          height="10.2904"
          fill="#DF3603"
          stroke="black"
        />
        <rect
          x="0.5"
          y="24.21"
          width="10.2944"
          height="10.2904"
          fill="#DF3603"
          stroke="black"
        />
        <line
          x1="20.0001"
          y1="23.71"
          x2="20.0001"
          y2="11.2905"
          stroke="black"
        />
        <path d="M35.585 24.1118V16.334H5.4151V24.1118" stroke="black" />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="41" height="35" fill="white" />
        </clipPath>
      </defs>
    </svg>
  </>
);

export const ParentUnitIcon: React.SFC<IIconProps> = props => (
  <>
    <svg
      width="41"
      height="35"
      viewBox="0 0 41 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0)">
        <rect width="41" height="35" />
        <rect
          x="15.3528"
          y="0.5"
          width="10.2944"
          height="10.2904"
          fill="#DF3603"
          stroke="black"
        />
        <rect
          x="15.3528"
          y="24.21"
          width="10.2944"
          height="10.2904"
          fill="#C4C4C4"
          stroke="black"
        />
        <rect
          x="30.2056"
          y="24.21"
          width="10.2944"
          height="10.2904"
          fill="#C4C4C4"
          stroke="black"
        />
        <rect
          x="0.5"
          y="24.21"
          width="10.2944"
          height="10.2904"
          fill="#C4C4C4"
          stroke="black"
        />
        <line
          x1="20.0001"
          y1="23.71"
          x2="20.0001"
          y2="11.2905"
          stroke="black"
        />
        <path d="M35.585 24.1118V16.334H5.4151V24.1118" stroke="black" />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="41" height="35" fill="white" />
        </clipPath>
      </defs>
    </svg>
  </>
);
export const Chevron: React.SFC<IIconProps> = props => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="currentColor"
      d="M8,12.46a2,2,0,0,1-1.52-.7L1.24,5.65a1,1,0,1,1,1.52-1.3L8,10.46l5.24-6.11a1,1,0,0,1,1.52,1.3L9.52,11.76A2,2,0,0,1,8,12.46Z"
    />
  </svg>
);
export const Pencil: React.SFC<IIconProps> = props => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M14.62 3.16938L11.74 0.319375C11.5339 0.114803 11.2554 7.01325e-09 10.965 7.01325e-09C10.6746 7.01325e-09 10.3961 0.114803 10.19 0.319375L0 10.5994V14.9794H4.45L14.64 4.70938C14.8389 4.50115 14.9482 4.22323 14.9445 3.93529C14.9407 3.64736 14.8242 3.37237 14.62 3.16938ZM3.62 12.9794H2V11.4194L8 5.41938L9.58 6.97938L3.62 12.9794ZM11 5.54938L9.4 3.97938L11 2.37938L12.57 3.97938L11 5.54938Z" fill="currentColor" />
  </svg>);

interface IIconProps {
  width?: number | string;
  height?: number | string;
}
