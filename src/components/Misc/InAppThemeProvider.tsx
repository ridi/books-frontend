import React from 'react';
import Cookies from 'universal-cookie';
import { IncomingHttpHeaders } from 'http';
import { ThemeProvider } from 'emotion-theming';
import { Global, css } from '@emotion/core';
import { defaultTheme, darkTheme, RIDITheme } from 'src/styles';

const InAppStyle = (theme: RIDITheme) => css`
  * { -webkit-tap-highlight-color: rgba(255,255,255,0); }
  html {
    background-color: ${theme.backgroundColor};
  }
`;

export type Theme = 'dark' | '';
export const getAppTheme = ({ cookie }: IncomingHttpHeaders): Theme => {
  const cookies = new Cookies(cookie);
  const theme = cookies.get('ridi_app_theme');
  if (theme === 'dark') {
    return theme;
  }
  return '';
};
const InAppThemeProvider: React.FC<{ theme: Theme }> = ({ children, theme }) => (
  <ThemeProvider theme={theme === 'dark' ? darkTheme : defaultTheme}>
    <Global styles={InAppStyle} />
    {children}
  </ThemeProvider>
);

export default InAppThemeProvider;
