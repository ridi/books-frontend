import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { localStorage } from 'src/utils/storages';
import styled from '@emotion/styled';

const Badge = styled.div`
  width: 150px;
  background: #8c9dad;
  color: white;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 0;
  text-transform: uppercase;
  text-align: center;
  line-height: 14px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  z-index: 999;
  position: fixed;
  top: constant(safe-area-inset-top);
  top: env(safe-area-inset-top);
  left: 50%;
  transform: translateX(-50%);
  display: block;
`;

const getStageFromCookie = (): string => {
  const cookies = new Cookies();
  const stage = cookies.get('stage');
  switch (stage) {
    case 'prerelease':
      return 'pre-release';
    case 'staging':
      return stage;
    default:
      return '';
  }
};

const DisallowedHostsFilter: React.FC = () => {
  const [stage, setStage] = useState('');

  useEffect(() => {
    setStage(getStageFromCookie());
    const bypass = JSON.parse(localStorage.getItem('disallowed-hosts-filter/bypass') || 'false');
    if (!stage && window.location.host === 'books.ridibooks.com' && !bypass) {
      const url = new URL(window.location.href);
      url.host = 'ridibooks.com';
      window.location.replace(url.href);
    }
  }, []);

  return !stage ? null : (
    <Badge>{stage}</Badge>
  );
};

export default DisallowedHostsFilter;
