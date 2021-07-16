import React from 'react';
import Cookies from 'universal-cookie';

const COOKIE_KEY = '_optimize_info';
const DELIMITERS = {
  EXPERIMENT: ';',
  VARIANT: '.',
};

interface Experiment {
  experimentKey: string;
  variantIdx: number;
}
interface OptimizeContextType {
  experiments?: Map<string, Experiment>;
}

const initialValues = {};

const Optimize = React.createContext<OptimizeContextType>(initialValues);

type ProviderProps = Partial<typeof initialValues> & { children?: React.ReactNode };

export function getExperiments() {
  const experiments = new Map();

  if (typeof window !== 'undefined') {
    const cookies = new Cookies(document.cookie);
    (cookies.get(COOKIE_KEY)?.split(DELIMITERS.EXPERIMENT) || []).forEach((experimentKey: string) => {
      const [experimentId, variantIdx] = experimentKey.split(DELIMITERS.VARIANT);

      experiments.set(experimentId, {
        experimentKey,
        variantIdx: Number(variantIdx),
      });
    });
  }

  return experiments;
}

export function OptimizeProvider({ children, ...props }: ProviderProps) {
  return React.createElement(
    Optimize.Provider,
    {
      value: {
        ...initialValues,
        ...props,
        experiments: getExperiments(),
      },
    },
    children,
  );
}

export default function useOptimize(): OptimizeContextType {
  return React.useContext(Optimize);
}
