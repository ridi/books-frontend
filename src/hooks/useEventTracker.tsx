import { DeviceType, Tracker } from '@ridi/event-tracker';
import {
  FB_KEYS, GA_KEY, GTM_KEY, SendEventType,
} from 'src/constants/eventTracking';
import { useEffect } from 'react';
import sentry from 'src/utils/sentry';
import { getDeviceType } from 'src/hooks/useDeviceType';
import { localStorage } from 'src/utils/storages';

import useAccount from './useAccount';

const deviceType = getDeviceType() === 'mobile' ? DeviceType.Mobile : DeviceType.PC;

export const createTracker = (userId: string | null) => {
  if (typeof window !== 'undefined') {
    return new Tracker({
      // @ts-ignore
      userId: userId || null,
      // Todo device 판단  User-Agent ?
      deviceType,
      beaconOptions: {
        use: true,
        beaconSrc: process.env.NEXT_STATIC_BEACON_URL,
      },
      // eslint-disable-next-line no-process-env
      debug:
        !process.env.IS_PRODUCTION
        && JSON.parse(localStorage.getItem('event-tracker/debug') || 'true'),
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
      development: !process.env.IS_PRODUCTION,
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
  const loggedUser = useAccount();
  useEffect(() => {
    try {
      tracker.set({
        userId: loggedUser?.id || null,
        deviceType,
      });
    } catch (error) {
      sentry.captureException(error);
    }
  }, [loggedUser]);
  return [tracker];
};

// Todo refactor
export const sendClickEvent = (
  eventTracker: Tracker,
  item: any,
  section: any,
  order?: number,
) => {
  eventTracker.sendEvent(SendEventType.Click, {
    section: `${deviceType}.${section}`,
    items: [{ id: item.b_id || item.id, idx: order, ts: new Date().getTime() }],
  });
};

export const sendDisplayEvent = (options: {
  slug: string;
  id: string;
  order: number;
}) => {
  const { slug, id, order } = options;
  tracker.sendEvent(SendEventType.Display, {
    section: `${deviceType}.${slug}`,
    items: [
      {
        id,
        idx: order,
        ts: Date.now(),
      },
    ],
  });
};
