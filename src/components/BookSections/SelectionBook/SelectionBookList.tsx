import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import ScrollContainer from 'src/components/ScrollContainer';
import { flexRowStart } from 'src/styles';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

import SelectionBookItem from './SelectionBookItem';
import { SelectionBookListProps } from './types';

const StyledScrollContainer = styled(ScrollContainer)`
  margin-top: 6px;
`;

const List = styled.ul`
  ${flexRowStart}

  margin-left: 13px; // 20px - 7px
  padding-top: 7px;
  padding-left: 7px;
  box-sizing: content-box;
  overflow: auto;
  overflow-y: hidden;

  ${orBelow(BreakPoint.MD, 'margin-left: 9px;')} // 16px - 7px
`;

const StyledBookItem = styled(SelectionBookItem)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  flex: none;
  margin-right: 20px;
  box-sizing: content-box;

  ${orBelow(BreakPoint.MD, 'margin-right: 12px;')};
`;

const arrowVerticalStyle = css`
  padding-top: 98px;
  ${orBelow(BreakPoint.LG, 'padding-top: 69px;')}
`;

const SelectionBookList: React.FunctionComponent<SelectionBookListProps> = React.memo((props) => {
  const { genre, type, slug } = props;
  return (
    <StyledScrollContainer arrowStyle={arrowVerticalStyle}>
      <List>
        {(props.items as any[])
          .map((item, index) => (
            <StyledBookItem
              key={index}
              order={index}
              slug={slug}
              genre={genre}
              type={type}
              book={item}
            />
          ))}
      </List>
    </StyledScrollContainer>
  );
});

export default SelectionBookList;
