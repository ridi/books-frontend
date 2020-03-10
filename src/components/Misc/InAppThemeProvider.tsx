import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { ThemeProvider } from 'emotion-theming';

import { defaultTheme, darkTheme } from 'src/styles';

export default ({ children }) => {
  const [theme, setTheme] = useState('');
  useEffect(() => {
    setTheme(Cookies.get('ridi_app_theme') || '');
  });

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : defaultTheme}>
      {children}
    </ThemeProvider>
  );
};
