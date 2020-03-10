import React from 'react';
import { act, cleanup, render, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';

import TopBanner from 'src/components/TopBanner';
import { ViewportIntersectionProvider } from 'src/hooks/useViewportIntersection';
import { DeviceTypeProvider } from 'src/hooks/useDeviceType';

import makeStore from 'src/store/config';

const store = makeStore(
  {},
  { asPath: 'test', isServer: false },
);

const BANNERS = [
  {
    id: 1,
    title: '1',
    landing_url: '',
    main_image_url: '',
    is_badge_available: false,
  },
  {
    id: 2,
    title: '2',
    landing_url: '',
    main_image_url: '',
    is_badge_available: true,
    badge: 'END_IN_3DAY',
  },
  {
    id: 3,
    title: '3',
    landing_url: '',
    main_image_url: '',
    is_badge_available: true,
    badge: 'END_TODAY',
  },
];

function actRender(renderFunction: () => RenderResult) {
  let ret: RenderResult;
  act(() => {
    ret = renderFunction();
  });
  return ret;
}

afterAll(cleanup);

describe('TopBanner', () => {
  let originalIO: typeof IntersectionObserver;

  // simulate non-IO environment
  beforeAll(() => {
    originalIO = window.IntersectionObserver;
    window.IntersectionObserver = undefined;
  });

  afterAll(() => {
    window.IntersectionObserver = originalIO;
  });

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


    test('should hide arrows', () => {
      const { container } = actRender(() =>
        render(
          <Provider store={store}>
            <ViewportIntersectionProvider>
              <DeviceTypeProvider>
                <TopBanner banners={BANNERS} slug="test" />
              </DeviceTypeProvider>
            </ViewportIntersectionProvider>
          </Provider>
        )
      );
      expect(container.querySelector('button')).toBeNull();
    });
  });
});
