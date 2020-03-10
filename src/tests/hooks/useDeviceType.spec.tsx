import { render, cleanup } from '@testing-library/react';
import React from 'react';

import { DeviceTypeProvider, useDeviceType } from 'src/hooks/useDeviceType';

describe('useDeviceType', () => {
  function TestComponent() {
    const { isMobile } = useDeviceType();
    return (
      isMobile ? <div>Mobile</div> : <div>PC</div>
    );
  }

  describe('mobile', () => {
    let spy: jest.SpyInstance;

    beforeAll(() => {
      spy = jest.spyOn(window.navigator, 'userAgent', 'get')
      .mockReturnValue(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) ' +
        'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
      );
    });
  
    afterAll(() => {	
      spy.mockRestore();	
    });

    afterEach(cleanup);    

    test('should be render to mobile component', async() => {
      const { container } = render(
        <DeviceTypeProvider>
          <TestComponent />
        </DeviceTypeProvider>
      )
      const items = container.querySelector('div');
      expect(items.textContent).toBe('Mobile');
    });  
  });
});
