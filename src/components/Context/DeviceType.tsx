import React, { useEffect, useState } from 'react';
import { getDeviceType } from 'src/utils/common';

export const DeviceTypeContext = React.createContext({
  deviceType: null,
  isMobile: false,
});

export const DeviceType: React.FC = (props) => {
  const [deviceType, setDeviceType] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const device = ['mobile', 'tablet'].includes(getDeviceType()) ? 'mobile' : 'pc';
    setDeviceType(device);
    setIsMobile(device === 'mobile');
  }, []);
  return (
    <DeviceTypeContext.Provider value={{ deviceType, isMobile }}>{props.children}</DeviceTypeContext.Provider>
  );
};
