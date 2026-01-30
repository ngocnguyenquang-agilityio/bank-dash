interface ChipIconProps {
  className?: string;
}

export const ChipIcon = ({ className }: ChipIconProps) => {
  return (
    <svg
      width="42"
      height="29"
      viewBox="0 0 33 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        y="0.133514"
        width="33"
        height="22"
        rx="5"
        fill="#FFC947"
        stroke="#b1b1b1"
        strokeWidth="0.5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.5 0.352425L12.8333 6.10176C12.8333 6.10176 14.3 11.1324 12.8333 15.4444L16.5 21.9124L20.1666 15.4444C20.1666 15.4444 18.7 11.8511 20.1666 6.10176C20.1666 6.10176 16.5 0.352425 16.5 0.352425Z"
        stroke="#b1b1b1"
        strokeWidth="1.3"
        strokeLinejoin="bevel"
      />
      <path d="M0 6.3659H12.8333" stroke="#b1b1b1" strokeWidth="1.3" strokeLinejoin="bevel" />
      <path d="M19.7996 6.3659H32.9996" stroke="#b1b1b1" strokeWidth="1.3" strokeLinejoin="bevel" />
      <path d="M0 15.1655H12.8333" stroke="#b1b1b1" strokeWidth="1.3" strokeLinejoin="bevel" />
      <path
        d="M19.7996 15.1655H32.9996"
        stroke="#b1b1b1"
        strokeWidth="1.3"
        strokeLinejoin="bevel"
      />
    </svg>
  );
};
