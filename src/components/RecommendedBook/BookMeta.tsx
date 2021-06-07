import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import BookMetaBase from 'src/components/BookMeta/BookMeta';
import AtSelectIcon from 'src/svgs/Book1.svg';
import { useIsAvailableSelect } from 'src/hooks/useBookDetailSelector';
import { slateGray40, slateGray60 } from '@ridi/colors';

const AvailableOnSelectContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: bold;
  color: #22b8cf;
`;

const bookTitleStyle = css`
  font-size: 14px;
  color: white;
`;

const selectIconStyle = css`
  width: 14px;
  height: 12px;
  margin-right: 6px;
  fill: #22b8cf;
`;

interface BookMetaProps {
  bId: string;
  showSelect?: boolean;
  theme: string;
  href?: string;
}

function BookMeta(props: BookMetaProps) {
  const { theme, bId, href } = props;
  const isAvailableSelect = useIsAvailableSelect(bId);
  return (
    <BookMetaBase bId={bId} bookTitleStyle={bookTitleStyle} authorColor={theme === 'dark' ? slateGray40 : slateGray60} href={href}>
      {isAvailableSelect && (
        <AvailableOnSelectContainer
          role="img"
          aria-label="리디셀렉트 이용 가능 도서"
        >
          <AtSelectIcon css={selectIconStyle} />
          리디셀렉트
        </AvailableOnSelectContainer>
      )}
    </BookMetaBase>
  );
}

export default React.memo(BookMeta);
