import React, { useEffect, useState } from 'react';
import { getDeviceType } from 'src/utils/common';
import DeviceTypeContext from 'src/hooks/useDeviceType';

export const DeviceType: React.FC = (props) => {
  const [deviceType, setDeviceType] = useState('mobile');
  useEffect(() => {
    const device = ['mobile', 'tablet'].includes(getDeviceType()) ? 'mobile' : 'pc';
    setDeviceType(device);
  }, []);
  return (
    <DeviceTypeContext.Provider value={{ deviceType, isMobile: deviceType === 'mobile' }}>{props.children}</DeviceTypeContext.Provider>
  );
};
