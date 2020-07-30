import { css } from '@emotion/core';
import { defaultTheme, darkTheme } from 'src/styles/themes';

export const darkScheme = '@media (prefers-color-scheme: dark)';

export const inappStyles = css`
  * { -webkit-tap-highlight-color: rgba(255,255,255,0); }
  html {
    font-family: ridi-roboto, Apple SD Gothic Neo, "돋움", Dotum, Helvetica Neue, arial, sans-serif;
    background-color: ${defaultTheme.backgroundColor};
    ${darkScheme} {
      background-color: ${darkTheme.backgroundColor};
    }
  }
`;
