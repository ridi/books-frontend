import styled from '@emotion/styled';
import React from 'react';

import { EventBannerItem } from 'src/components/EventBanner/index';
import { useViewportIntersectionOnce } from 'src/hooks/useViewportIntersection';
import * as tracker from 'src/utils/event-tracker';
import { between, BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { EventBanner } from 'src/types/sections';

const List = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  ${orBelow(
    BreakPoint.MD,
    `
      flex-wrap: wrap;
    `,
  )};
  ${between(
    BreakPoint.MD + 1,
    BreakPoint.LG,
    `
      padding-left: 20px;
      padding-right: 20px;
    `,
  )};
`;

interface EventBannerListProps {
  items: EventBanner[];
  genre: string;
  slug: string;
}

const EventBannerList: React.FunctionComponent<EventBannerListProps> = (props) => {
  const { items, slug } = props;
  const [showImage, setShowImage] = React.useState(false);
  const sendDisplayEvent = React.useCallback(() => {
    setShowImage(true);
    items.forEach((item, index) => {
      tracker.sendDisplayEvent({
        slug,
        id: String(item.id),
        order: index,
      });
    });
  }, [items, slug]);
  const ref = useViewportIntersectionOnce<HTMLUListElement>(sendDisplayEvent);
  return (
    <List ref={ref}>
      {items.slice(0, 4).map((item, index) => (
        <EventBannerItem key={index}>
          <a
            href={item.url}
            onClick={tracker.sendClickEvent.bind(null, item.id, slug, index)}
          >
            <img
              width="100%"
              height="100%"
              src={showImage ? item.image_url : undefined}
              alt={item.title}
            />
          </a>
        </EventBannerItem>
      ))}
    </List>
  );
};

export default EventBannerList;
