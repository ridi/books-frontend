import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import { Global } from '@emotion/core';
import { inappStyles, defaultTheme } from 'src/styles';

const InAppThemeProvider: React.FC = ({ children }) => (
  <ThemeProvider theme={defaultTheme}>
    <Global styles={inappStyles} />
    {children}
  </ThemeProvider>
);

export default InAppThemeProvider;
