import React from 'react';
import styled from '@emotion/styled';

interface FreeBookRendererProps {
  freeBookCount?: number;
  unit: string;
}

const FreeBookBadge = styled.span`
  position: absolute;
  bottom: 0;
  right: 0;
  height: 26px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-right: 0;
  border-bottom: 0;
  opacity: 0.9;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 3px 0 0 0;
  padding: 7px 6px 5px 6px;
  color: white;
  font-weight: bold;
  font-size: 12px;
  z-index: 3;
  line-height: 12px;
`;

const FreeBookRenderer: React.FunctionComponent<FreeBookRendererProps> = (props) => {
  const { freeBookCount, unit } = props;
  if (freeBookCount && freeBookCount > 0) {
    return (
      <FreeBookBadge>
        {`${freeBookCount}${unit} 무료`}
      </FreeBookBadge>
    );
  }
  return null;
};

export default FreeBookRenderer;
