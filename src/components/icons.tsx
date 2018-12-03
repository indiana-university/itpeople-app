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

interface IIconProps {
  width?: number | string;
  height?: number | string;
}
