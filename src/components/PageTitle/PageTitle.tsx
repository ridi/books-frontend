import * as React from 'react';
import { css } from '@emotion/core';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

const pageTitleCSS = css`
  font-size: 21px;
  color: #303538;
  font-weight: 700;
  padding: 15px 0;
  ${orBelow(
    BreakPoint.LG,
    'padding: 15px 24px;',
  )};
  ${orBelow(
    BreakPoint.M,
    'padding: 15px 16px;',
  )};
`;

const mobileDisplayNone = css`
  ${orBelow(
    BreakPoint.LG,
    'display: none;',
  )};
`;

interface PageTitleProps {
  title: string;
  mobileHidden?: boolean;
}

const PageTitle: React.FunctionComponent<PageTitleProps> = ({ title, mobileHidden }) => (
  <h2
    css={css`
      ${pageTitleCSS};
      ${mobileHidden ? mobileDisplayNone : ''};
    `}
  >
    {title}
  </h2>
);

export default PageTitle;
