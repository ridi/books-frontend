import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { RIDITheme } from 'src/styles';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';

export const sectionStyle = (theme: RIDITheme) => css`
  width: 100%;
  color: ${theme.footerTextColor};
  hr {
    display: none;
  }
  background: ${theme.secondaryColor};
`;

export const FooterWrapper = styled.footer`
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 16px;
  transition: all 0.3s;
  max-height: 700px;
`;

export const FlexBox = styled.div`
  display: flex;
  align-items: start;
  justify-content: unset;
  ${orBelow(
    BreakPoint.LG,
    `
      flex-direction: column;
      justify-content: flex-start;
      align-items: unset;
    `,
  )};
`;

export const StyledAnchor = styled.a`
  word-break: keep-all;
  :hover {
    opacity: 0.7;
  }
`;

export const contactListCSS = (theme: RIDITheme) => css`
  //min-width: 192px;
  display: flex;
  align-items: center;
  li {
    word-break: keep-all;
    span {
      word-break: keep-all;
      white-space: nowrap;
    }
    :not(:last-of-type) {
      ::after {
        position: relative;
        font-size: 11px;
        content: ' ';
        top: -3px;
        margin: 0 10px;
        border-left: 1px solid ${theme.verticalRuleColor};
      }
    }
  }
  margin-right: 80px;

  ${orBelow(
    BreakPoint.LG,
    'margin-bottom: 28px;',
  )}
`;

export const serviceNumber = css`
  word-break: keep-all;
  font-size: 20px;
  font-weight: bold;
  color: white;
`;

export const serviceCenter = css`
  ${serviceNumber};
  line-height: 1;
  word-break: keep-all;
`;

export const FooterMenuWrapper = styled.ul`
  display: flex;
  padding-top: 6px;
  margin-bottom: 48px;
  ${orBelow(
    BreakPoint.LG,
    `
      margin-bottom: 24px;
      transition: all 0.3s;
      max-height: 230px;
    `,
  )};
`;

export const FooterMenuSection = styled.ul`
  position: relative;
  & {
    margin-right: 16px;
  }
  li {
    width: 140px;
    :not(:last-of-type) {
      margin-bottom: 16px;
    }
  }
`;
export const FooterMenuLabel = styled.span`
  font-size: 14px;
`;

export const hiddenMenu = css`
  ${orBelow(
    BreakPoint.LG,
    'display: none;',
  )};
`;

export const MiscWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  ${orBelow(
    BreakPoint.LG,
    `
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
    `,
  )}
  li {
    flex-shrink: 0;
  }
`;

export const Copyright = styled.p`
  width: 83px;
  height: 17px;
  font-size: 14px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  color: #7e8992;
  margin-right: 24px;
  ${orBelow(
    BreakPoint.LG,
    'margin-bottom: 16px;',
  )};
`;

export const menuListCSS = (theme: RIDITheme) => css`
  display: flex;
  li {
    :not(:last-of-type) {
      ::after {
        position: relative;
        font-size: 10px;
        content: '|';
        top: -0.3px;
        color: ${theme.verticalRuleColor};
        margin: 0 5.5px;
      }
    }
  }
`;

export const MiscMenuLabel = styled.span`
  width: 41px;
  height: 20px;
  font-size: 11px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.82;
  color: #7e8992;
`;

export const paperIcon = css`
  fill: white;
`;
