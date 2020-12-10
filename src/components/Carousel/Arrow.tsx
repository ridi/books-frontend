import { css, Interpolation } from '@emotion/core';
import React from 'react';
import { clearOutline } from 'src/styles';
import ArrowV from 'src/svgs/ArrowV.svg';
import ArrowBoldV from 'src/svgs/ArrowBoldV.svg';

interface ArrowProps {
  side?: 'left' | 'right';
  color?: 'white' | 'dark';
  wrapperStyle?: Interpolation;
  className?: string;
  width?: string;
  height?: string;
  fill?: string;
  label: string;
  onClickHandler?: React.MouseEventHandler<HTMLButtonElement>;
  arrowType?: 'normal' | 'bold';
}

const defaultOpacity = css`
  :hover {
    opacity: 0.6;
  }
  transition: opacity 0.1s;
  cursor: pointer;
  @media (hover: none) {
    :hover {
      opacity: 0.95;
    }
  }
  opacity: 0.95;
`;

const leftRotate = css`
  transform-origin: center;
  transform: rotateX(180deg) translate(-2%, 0) rotate(180deg);
`;

export const arrowTransition = css`
  opacity: 0;
  pointer-events: none;
`;

const Arrow: React.FunctionComponent<ArrowProps> = (props) => {
  const {
    color, side, wrapperStyle, onClickHandler, arrowType, className, label,
  } = props;
  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    if (onClickHandler) {
      onClickHandler(e);
    }
  };
  const mergedStyle = [
    side === 'left' ? leftRotate : null,
    css`
      top: 1.5px;
      fill: ${color === 'dark' ? '#b8bfc4' : '#808991'};
    `,
  ];
  return (
    <button
      type="button"
      onClick={handleClick}
      css={[
        css`
          background: ${color === 'dark' ? '#384252' : 'white'};
          width: 40px;
          height: 40px;
          border-radius: 40px;
          box-shadow: 0 0.8px 3px rgba(0, 0, 0, 0.33);
        `,
        clearOutline,
        defaultOpacity,
        wrapperStyle,
      ]}
      className={className}
    >
      { arrowType === 'bold' ? <ArrowBoldV css={mergedStyle} /> : <ArrowV css={mergedStyle} />}
      <span className="a11y" aria-label={label}>
        {label}
      </span>
    </button>
  );
};

export default Arrow;
