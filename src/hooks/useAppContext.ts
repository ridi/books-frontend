import React from 'react';

const initialValues = {
  isPartials: false,
  isInApp: false,
};

const AppContext = React.createContext(initialValues);

type ProviderProps = Partial<typeof initialValues> & { children?: React.ReactNode };

export function AppContextProvider({ children, ...props }: ProviderProps) {
  return React.createElement(
    AppContext.Provider,
    {
      value: {
        ...initialValues,
        ...props,
      },
    },
    children,
  );
}

export default function useAppContext() {
  return React.useContext(AppContext);
}
