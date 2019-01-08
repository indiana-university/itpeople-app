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
export const ArrowUp: React.SFC<IIconProps> = props => (
  <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.71409 4.2958L5.71409 0.295798C5.62113 0.20207 5.51053 0.127676 5.38867 0.0769069C5.26681 0.0261382 5.1361 -1.35258e-10 5.00409 -1.35258e-10C4.87208 -1.35258e-10 4.74137 0.0261382 4.61951 0.0769069C4.49766 0.127676 4.38705 0.20207 4.29409 0.295798L0.294092 4.2958C0.105788 4.4841 -1.1037e-07 4.7395 -1.1037e-07 5.0058C-1.1037e-07 5.2721 0.105788 5.52749 0.294092 5.7158C0.482395 5.9041 0.73779 6.00989 1.00409 6.00989C1.27039 6.00989 1.52579 5.9041 1.71409 5.7158L4.00409 3.4158L4.00409 15.0058C4.00409 15.271 4.10945 15.5254 4.29699 15.7129C4.48452 15.9004 4.73888 16.0058 5.00409 16.0058C5.26931 16.0058 5.52366 15.9004 5.7112 15.7129C5.89873 15.5254 6.00409 15.271 6.00409 15.0058L6.00409 3.4158L8.29409 5.7058C8.48539 5.86962 8.73147 5.95523 8.98314 5.94551C9.23482 5.93579 9.47356 5.83146 9.65165 5.65336C9.82975 5.47527 9.93408 5.23653 9.9438 4.98485C9.95352 4.73318 9.86792 4.4871 9.70409 4.2958H9.71409Z" fill="black" />
  </svg>
)
export const ArrowDown: React.SFC<IIconProps> = props => (
  <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.230245 11.7101L4.23024 15.7101C4.32321 15.8038 4.43381 15.8782 4.55567 15.929C4.67753 15.9797 4.80823 16.0059 4.94024 16.0059C5.07226 16.0059 5.20296 15.9797 5.32482 15.929C5.44668 15.8782 5.55728 15.8038 5.65024 15.7101L9.65024 11.7101C9.83855 11.5218 9.94434 11.2664 9.94434 11.0001C9.94434 10.7338 9.83855 10.4784 9.65024 10.2901C9.46194 10.1018 9.20655 9.99597 8.94024 9.99597C8.67394 9.99597 8.41855 10.1018 8.23024 10.2901L5.94024 12.5901L5.94025 1.00006C5.94025 0.734844 5.83489 0.48049 5.64735 0.292954C5.45982 0.105418 5.20546 6.06209e-05 4.94025 6.05977e-05C4.67503 6.05745e-05 4.42068 0.105418 4.23314 0.292954C4.0456 0.48049 3.94025 0.734844 3.94025 1.00006L3.94024 12.5901L1.65025 10.3001C1.45894 10.1362 1.21287 10.0506 0.961192 10.0603C0.709516 10.0701 0.470777 10.1744 0.292682 10.3525C0.114587 10.5306 0.0102544 10.7693 0.00053354 11.021C-0.00918728 11.2727 0.0764193 11.5188 0.240245 11.7101L0.230245 11.7101Z" fill="black" />
  </svg>

)
export const TrashCan: React.SFC<IIconProps> = props => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M10.5 11.5V7.5C10.5 6.9 10.1 6.5 9.5 6.5C8.9 6.5 8.5 6.9 8.5 7.5V11.5C8.5 12.1 8.9 12.5 9.5 12.5C10.1 12.5 10.5 12.1 10.5 11.5Z" fill="black" />
    <path d="M7.5 11.5V7.5C7.5 6.9 7.1 6.5 6.5 6.5C5.9 6.5 5.5 6.9 5.5 7.5V11.5C5.5 12.1 5.9 12.5 6.5 12.5C7.1 12.5 7.5 12.1 7.5 11.5Z" fill="black" />
    <path d="M15 3H11V1C11 0.4 10.6 0 10 0H6C5.4 0 5 0.4 5 1V3H1C0.4 3 0 3.4 0 4C0 4.6 0.4 5 1 5H2V15C2 15.6 2.4 16 3 16H13C13.6 16 14 15.6 14 15V5H15C15.6 5 16 4.6 16 4C16 3.4 15.6 3 15 3ZM7 2H9V3H7V2ZM12 5V14H4V5H12Z" fill="black" />
  </svg>
)
interface IIconProps {
  width?: number | string;
  height?: number | string;
}
