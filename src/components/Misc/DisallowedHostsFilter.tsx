import React, { useEffect } from 'react';
import { localStorage } from 'src/utils/storages';

const DisallowedHostsFilter: React.FC = () => {
  useEffect(() => {
    const bypass = JSON.parse(localStorage.getItem('disallowed-hosts-filter/bypass') || 'false');
    if (location.host === 'books.ridibooks.com' && !bypass) {
      const url = new URL(location.href);
      url.host = 'ridibooks.com';
      location.replace(url.href);
    }
  }, []);

  return <></>;
};

export default DisallowedHostsFilter;
