import { css } from '@emotion/core';
import fonts from './fonts';

export const inheritFont = css`
  color: inherit;
  letter-spacing: inherit;
  font-family: inherit;
`;

export const resetAppearance = css`
  appearance: none;
  background: none;
  box-shadow: none;
  border: 0;
`;

export const resetSpacing = css`
  margin: 0;
  padding: 0;
`;

export const a11y = css`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  border: 0;
  clip: rect(0, 0, 0, 0);
`;

export const clearOutline = css`
  :focus {
    outline: none;
  }
  :active {
    outline: none;
  }
`;

export const fontFamily = [
  'ridi-roboto',
  'Apple SD Gothic Neo',
  '"돋움"',
  'Dotum',
  'Helvetica Neue',
  'arial',
  'sans-serif',
].join(', ');

export const fontFamilyWithNanum = [
  'ridi-roboto',
  'Apple SD Gothic Neo',
  '"나눔고딕"',
  'Nanum Gothic',
  '"돋움"',
  'Dotum',
  'Helvetica Neue',
  'arial',
  'sans-serif',
].join(', ');

export const resetFont = css`
  color: black;
  font-family: ${fontFamily};
  font-weight: 400;
  letter-spacing: -0.03em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export const resetStyles = css`
  html {
    ${css([resetSpacing, resetFont])};
    -webkit-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    font-size: 14px;

    &.wf-nanumgothic-n4-active.wf-nanumgothic-n7-active {
      font-family: ${fontFamilyWithNanum};
    }
  }
  body {
    ${css([resetSpacing])};
    overflow-x: hidden;
  }
  hr {
    ${css([resetSpacing])};
  }
  p {
    ${css([resetSpacing])};
  }
  button {
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    ${css([inheritFont, resetAppearance, resetSpacing])};
    * {
      position: relative;
      top: 0;
      left: 0;
    }
  }
  input {
    ${inheritFont};
    ${resetAppearance};
    ${resetSpacing};

    &::-ms-clear {
      display: none;
    }
    &::-webkit-search-cancel-button {
      display: none;
    }
    &:focus {
      outline: none;
    }
  }
  ul {
    list-style-type: none;
    ${css([resetSpacing])};
  }
  li {
    line-height: initial;
  }

  * {
    .a11y {
      ${css([a11y])};
    }
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  a {
    ${inheritFont};
    &:link,
    &:visited {
      text-decoration: none;
      .new_gnb &,
      #new_footer & {
        color: white;
      }
    }
    cursor: pointer;
  }

  ${fonts};
  #__next {
    overflow-y: hidden;
    overflow-x: hidden;
  }

  h1,
  h2,
  h3,
  h4,
  button,
  input,
  p,
  span {
    letter-spacing: -0.03em;
  }
`;
export const partialResetStyles = css`
  html {
    ${css([resetSpacing, resetFont])};
    -webkit-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    font-size: 14px;
    font-family: ${fontFamilyWithNanum};
  }
  body {
    ${css([resetSpacing])};
  }
  hr {
    ${css([resetSpacing])};
  }
  p {
    ${css([resetSpacing])};
  }
  button {
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    ${css([inheritFont, resetAppearance, resetSpacing])};
    * {
      position: relative;
      top: 0;
      left: 0;
    }
  }
  input {
    ${inheritFont};
    ${resetAppearance};
    ${resetSpacing};

    &::-ms-clear {
      display: none;
    }
    &::-webkit-search-cancel-button {
      display: none;
    }
    &:focus {
      outline: none;
    }
  }
  ul {
    list-style-type: none;
    ${css([resetSpacing])};
  }
  li {
    line-height: initial;
  }

  #new_footer {
    * {
      .a11y {
        ${css([a11y])};
      }
      box-sizing: border-box;
    }
  }
  #__next__footer {
    * {
      .a11y {
        ${css([a11y])};
      }
      box-sizing: border-box;
    }
  }

  a {
    ${inheritFont};
    &:link,
    &:visited {
      text-decoration: none;
      .new_gnb &,
      #new_footer & {
        color: white;
      }
    }
    cursor: pointer;
  }

  #__next {
    overflow-y: hidden;
    overflow-x: hidden;

    * {
      .a11y {
        ${css([a11y])};
      }
      //margin: 0;
      //padding: 0;
      box-sizing: border-box;
    }
  }

  h1,
  h2,
  h3,
  h4,
  button,
  input,
  p,
  span {
    letter-spacing: -0.03em;
  }
`;
