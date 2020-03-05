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
    const device = getDeviceType();
    setDeviceType(device);
    setIsMobile(['mobile', 'tablet'].includes(device));
  }, []);
  return (
    <DeviceTypeContext.Provider value={{ deviceType, isMobile }}>{props.children}</DeviceTypeContext.Provider>
  );
};
