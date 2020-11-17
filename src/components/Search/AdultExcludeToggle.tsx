import React from 'react';
import styled from '@emotion/styled';
import Cookies from 'universal-cookie';

import { slateGray60 } from '@ridi/colors';
import Switch from 'src/components/Switch';
import { useSearchQueries } from 'src/hooks/useSearchQueries';

const AdultExcludeButton = styled.label`
  display: inline-flex;
  align-items: center;
  outline: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  color: ${slateGray60};
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.05);

  & > :not(:first-child) {
    margin-left: 4px;
  }
`;

const ScaledSmall = styled.div`
  transform: scale(0.85);
`;

export function AdultExcludeToggle(props: {
  adultExclude: boolean;
  toggleHandler?: (value: boolean) => void;
}) {
  const { adultExclude, toggleHandler } = props;
  const { updateQuery } = useSearchQueries();
  const toggle = React.useCallback((newValue: boolean) => {
    const cookieValue = newValue ? 'y' : 'n';
    const cookie = new Cookies();
    cookie.set(
      'adult_exclude',
      cookieValue,
      {
        path: '/',
        sameSite: 'lax',
      },
    );
    toggleHandler?.(newValue);
    updateQuery({ isAdultExclude: newValue });
  }, [updateQuery]);
  return (
    <AdultExcludeButton>
      <span>성인 제외</span>
      <ScaledSmall>
        <Switch checked={adultExclude} onChange={toggle} />
      </ScaledSmall>
    </AdultExcludeButton>
  );
}
