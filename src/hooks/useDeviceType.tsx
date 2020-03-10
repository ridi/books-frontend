import React, { useContext, useEffect, useState } from 'react';
import { getDeviceType } from 'src/utils/common';

interface Context {
  deviceType: string;
  isMobile: boolean;
}

export const DeviceTypeContext = React.createContext<Context>({
  deviceType: 'mobile',
  isMobile: true,
});

export const DeviceTypeProvider: React.FC = (props) => {
  const [deviceType, setDeviceType] = useState('mobile');
  useEffect(() => {
    const device = ['mobile', 'tablet'].includes(getDeviceType()) ? 'mobile' : 'pc';
    setDeviceType(device);
  }, []);
  return (
    <DeviceTypeContext.Provider value={{ deviceType, isMobile: deviceType === 'mobile' }}>{props.children}</DeviceTypeContext.Provider>
  );
};

export const useDeviceType = () => useContext(DeviceTypeContext);