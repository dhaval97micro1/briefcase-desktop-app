type Props = {
  size: string;
  clipPath: string;
};
const HorizontalLineSkeleton = ({ size, clipPath }: Props) => {
  return (
    <svg role="img" height={size} width="100%" aria-labelledby="loading-aria">
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        clip-path={`url(#${clipPath})`}
        style={{ fill: `url("#fill")` } as React.CSSProperties}
      ></rect>
      <defs>
        <clipPath id={clipPath}>
          <rect x="0" y="0" rx="6" ry="6" width="100%" height={size} />
        </clipPath>
        <linearGradient id="fill">
          <stop offset="0.599964" stop-color="#dedede" stop-opacity="1">
            <animate
              attributeName="offset"
              values="-2; -2; 1"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            ></animate>
          </stop>
          <stop offset="1.59996" stop-color="lightgray" stop-opacity="1">
            <animate
              attributeName="offset"
              values="-1; -1; 2"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            ></animate>
          </stop>
          <stop offset="2.59996" stop-color="lightgray" stop-opacity="1">
            <animate
              attributeName="offset"
              values="0; 0; 3"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            ></animate>
          </stop>
        </linearGradient>
      </defs>
    </svg>
  );
};

export default HorizontalLineSkeleton;
