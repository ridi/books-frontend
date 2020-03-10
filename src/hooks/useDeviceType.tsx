import React, { useContext } from 'react';

export const DeviceTypeContext = React.createContext({
  deviceType: 'mobile',
  isMobile: true,
});
export const useDeviceType = () => useContext(DeviceTypeContext);

export default DeviceTypeContext;
