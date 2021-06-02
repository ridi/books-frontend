import React from 'react';
import styled from '@emotion/styled';

import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import * as tracker from 'src/utils/event-tracker';

import { ThumbnailWrapper } from '../BookThumbnail/ThumbnailWrapper';
import ThumbnailWithBadge from './ThumbnailWithBadge';

const StyledThumbnailWithBadge = styled(ThumbnailWithBadge)`
  width: 100px;

  @media (min-width: 1000px) {
    width: 140px;
  }
`;

const PortraitBookWrapper = styled.li`
  display: flex;
  flex-direction: column;
  box-sizing: content-box;
  min-width: 140px;
  width: 140px;

  ${orBelow(
    BreakPoint.LG,
    `
      min-width: 100px;
      width: 100px;
    `,
  )}
`;

const StyledThumbnailWrapper = styled(ThumbnailWrapper)<{ disabled?: boolean }>`
  transition: opacity 0.2s;
  ${(props) => props.disabled && 'opacity: 0.2;'}
`;

interface Props {
  bId: string;
  index?: number;
  genre: string;
  slug: string;
  disabled?: boolean;
  onClick?(): void;
  className?: string;
  children?: React.ReactNode;
  href?: string;
}

const StyledAnchor = styled.a`
  display: inline-block;
`;

export default function PortraitBook(props: Props) {
  const {
    bId,
    index,
    genre,
    slug,
    disabled,
    onClick,
    className,
    children,
    href,
  } = props;

  return (
    <PortraitBookWrapper className={className}>
      <StyledAnchor href={href || `/books/${bId}`} onClick={onClick}>
        <StyledThumbnailWrapper disabled={disabled}>
          <StyledThumbnailWithBadge
            bId={bId}
            order={index}
            genre={genre}
            slug={slug}
            sizes="(max-width: 999px) 100px, 140px"
          />
        </StyledThumbnailWrapper>
      </StyledAnchor>
      {children}
    </PortraitBookWrapper>
  );
}
