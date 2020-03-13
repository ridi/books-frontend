import React, { useContext, useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';

interface Context {
  deviceType: string;
  isMobile: boolean;
}

export const DeviceTypeContext = React.createContext<Context>({
  deviceType: 'mobile',
  isMobile: true,
});

export const getDeviceType = () => {
  const { type } = new UAParser().getDevice();
  return ['mobile', 'tablet'].includes(type) ? 'mobile' : 'pc';
};

export const DeviceTypeProvider: React.FC = (props) => {
  const [deviceType, setDeviceType] = useState<ReturnType<typeof getDeviceType>>('mobile');
  useEffect(() => {
    setDeviceType(getDeviceType());
  }, []);
  return (
    <DeviceTypeContext.Provider value={{ deviceType, isMobile: deviceType === 'mobile' }}>
      {props.children}
    </DeviceTypeContext.Provider>
  );
};

export const useDeviceType = () => useContext(DeviceTypeContext);
