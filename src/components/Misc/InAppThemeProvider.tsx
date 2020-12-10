import React from 'react';
import Cookies from 'universal-cookie';
import { ThemeProvider } from 'emotion-theming';
import { Global, css } from '@emotion/core';
import { defaultTheme, darkTheme, RIDITheme } from 'src/styles';

const InAppStyle = (theme: RIDITheme) => css`
  * { -webkit-tap-highlight-color: rgba(255,255,255,0); }
  html {
    background-color: ${theme.backgroundColor};
    font-family: ridi-roboto, Apple SD Gothic Neo, "돋움", Dotum, Helvetica Neue, arial, sans-serif;
  }
`;

export type Theme = 'dark' | '';
export const getAppTheme = (cookies: Cookies): Theme => {
  const theme = cookies.get('ridi_app_theme');
  if (theme === 'dark') {
    return theme;
  }
  return '';
};
const InAppThemeProvider: React.FunctionComponent<{ theme: Theme }> = ({ children, theme }) => (
  <ThemeProvider theme={theme === 'dark' ? darkTheme : defaultTheme}>
    <Global styles={InAppStyle} />
    {children}
  </ThemeProvider>
);

export default InAppThemeProvider;
