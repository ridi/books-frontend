import { DeviceType, Tracker } from '@ridi/event-tracker';
import {
  FB_KEYS, GA_KEY, GTM_KEY, SendEventType,
} from 'src/constants/eventTracking';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/config';
import sentry from 'src/utils/sentry';
import { getDeviceType } from 'src/utils/common';
const { captureException } = sentry();

export const createTracker = (userId: string | null) => {
  if (typeof window !== 'undefined') {
    const device = getDeviceType();
    return new Tracker({
      // @ts-ignore
      userId: userId || null,
      // Todo device 판단  User-Agent ?
      deviceType: ['mobile', 'tablet'].includes(device)
        ? DeviceType.Mobile
        : DeviceType.PC,
      beaconOptions: {
        use: true,
        beaconSrc: publicRuntimeConfig.BEACON_URL,
      },
      // eslint-disable-next-line no-process-env
      debug: process.env.NODE_ENV !== 'production',
      gaOptions: {
        trackingId: GA_KEY,
        fields: {
          campaignName: 'HOME_RENEWAL',
        },
      },
      pixelOptions: {
        pixelId: FB_KEYS,
      },
      tagManagerOptions: {
        trackingId: GTM_KEY,
      },
      // eslint-disable-next-line no-process-env
      development: process.env.NODE_ENV !== 'production',
    });
  }
  return null;
};

const tracker = createTracker(null);
if (tracker) {
  tracker.initialize();
}

export const useEventTracker = () => {
  if (tracker) {
    createTracker(null);
  }
  const { loggedUser } = useSelector((state: RootState) => state.account);
  useEffect(() => {
    const device = getDeviceType();
    try {
      tracker.set({
        userId: loggedUser?.id || null,
        deviceType: ['mobile', 'tablet'].includes(device)
          ? DeviceType.Mobile
          : DeviceType.PC,
      });
    } catch (error) {
      captureException(error);
    }
  }, [loggedUser]);
  return [tracker];
};

// Todo refactor
export const sendClickEvent = (eventTracker, item, section, order) => {
  const device = getDeviceType();
  const deviceType = ['mobile', 'tablet'].includes(device) ? 'Mobile' : 'Pc';
  eventTracker.sendEvent(SendEventType.Click, {
    section: `${deviceType}.${section}`,
    items: [{ id: item.b_id || item.id, idx: order, ts: new Date().getTime() }],
  });
};

export const useSendDisplayEvent = slug => {
  const device = getDeviceType();
  const deviceType = ['mobile', 'tablet'].includes(device) ? 'Mobile' : 'Pc';
  return useCallback(
    (intersectionItems: IntersectionObserverEntry[]) => {
      const trackingItems = { section: `${deviceType}.${slug}`, items: [] };
      intersectionItems.forEach(item => {
        const bId = item.target.getAttribute('data-book-id');
        const order = item.target.getAttribute('data-order');
        trackingItems.items.push({
          id: bId,
          idx: order,
          ts: Date.now(),
        });
      });
      if (trackingItems.items.length > 0) {
        tracker.sendEvent(SendEventType.Display, trackingItems);
      }
    },
    [deviceType, slug],
  );
};
