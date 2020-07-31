import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { flexColumnStart, RIDITheme } from 'src/styles';
import ArrowLeft from 'src/svgs/ChevronRight.svg';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { Notification as NotificationItemScheme } from 'src/types/notification';
import * as tracker from 'src/utils/event-tracker';
import { useViewportIntersection } from 'src/hooks/useViewportIntersection';

const NotiItemWrapper = styled.a<{}, RIDITheme>`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  :link,
  :visited {
    color: black;
  }
  transition: color 0.1s;

  ::after {
    content: '';
    width: 100%;
    position: absolute;
    height: 1px;
    background: ${(props) => props.theme.dividerColor};
    opacity: ${(props) => props.theme.dividerOpacity};
    bottom: -14px;
    left: 0px;
  }
`;

const BookShadowStyle = css`
  ::after {
    display: block;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right,rgba(0,0,0,.2) 0,rgba(0,0,0,0) 5%,rgba(0,0,0,0) 95%,rgba(0,0,0,.2) 100% );
    border: solid 1px rgba(0,0,0,.1);
    content: '';
  };
`;

const NotiListItem = styled.li<{}, RIDITheme>`
  margin: 0px;
  padding: 14px 0px;
  &:last-child {
    border-bottom: none;
  }

  :hover {
    background: ${(props) => props.theme.hoverBackground};
  }

  ${orBelow(
    BreakPoint.LG,
    'padding: 14px 20px;',
  )};
  ${orBelow(
    BreakPoint.M,
    'padding: 14px 16px;',
  )};
`;

const ImageWrapper = styled.div<{ imageType: string }>`
  text-align: center;
  flex-shrink: 0;
  position: relative;
  align-self: flex-start;
  line-height: 0;
  ${(props) => props.imageType === 'book' && BookShadowStyle};
`;


const Dot = styled.div<{ imageType: string }>`
  position: absolute;
  width: 4px;
  height: 4px;
  left: -9px;
  top: ${(props) => (props.imageType === 'book' ? '36px' : '24px')};
  background: #1f8ce6;
  border-radius: 999px;
`;

const NotificationMeta = styled.div`
  ${flexColumnStart};
  margin-left: 16px;
  width: 100%;
`;

const NotificationTitle = styled.h3<{}, RIDITheme>`
  width: 100%;
  font-weight: normal;
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
  word-break: keep-all;
  margin-bottom: 3px;
  letter-spacing: -0.3px;
  > p {
    line-height: 1.53em;
  }
`;

const NotificationTime = styled.span`
  font-weight: normal;
  font-size: 14px;
  color: #808991;
  letter-spacing: -0.3px;
`;

const ArrowWrapper = styled.div`
  padding: 0 0 0 16px;
  margin-left: auto;
`;

const arrowStyle = css`
  height: 13px;
  width: 7px;
`;

interface NotificationItemProps {
  item: NotificationItemScheme;
  landingUrl: NotificationItemScheme['landingUrl'];
  createdAtTimeAgo: string;
  dot?: boolean;
  slug: string;
  order: number;
}

const NotificationItem: React.FunctionComponent<NotificationItemProps> = (props) => {
  const {
    item, createdAtTimeAgo, dot = false, slug, order,
  } = props;

  // 잘못된 deeplinkUrl 로 이동하지 않도록 하기 위한 임시 코드. 2020-08-10 revert 예정.
  const landingUrl = item.createdAt < 1594967400000 ? item.landingUrl : props.landingUrl;

  const handleVisibleRef = React.useRef<boolean>(false);
  const handleVisible = React.useCallback((visible) => {
    if (!handleVisibleRef.current && visible) {
      tracker.sendDisplayEvent({ slug, id: item.id, order });
      handleVisibleRef.current = true;
    }
  }, [slug, item.id, order]);

  const ref = useViewportIntersection<HTMLLIElement>(handleVisible);

  return (
    <NotiListItem ref={ref}>
      <NotiItemWrapper
        // eslint-disable-next-line react/jsx-no-bind
        onClick={tracker.sendClickEvent.bind(null, item, slug, order)}
        href={landingUrl}
      >
        <ImageWrapper
          className={slug}
          imageType={item.imageType}
          data-id={item.id}
          data-order={order}
        >
          <img
            alt={item.message}
            width="56px"
            src={item.imageUrl}
          />
          { dot && <Dot imageType={item.imageType} /> }
        </ImageWrapper>
        <NotificationMeta>
          <NotificationTitle dangerouslySetInnerHTML={{ __html: item.message }} />
          <NotificationTime>{createdAtTimeAgo}</NotificationTime>
        </NotificationMeta>
        <ArrowWrapper>
          <ArrowLeft css={arrowStyle} />
        </ArrowWrapper>
      </NotiItemWrapper>
    </NotiListItem>
  );
};

export default NotificationItem;
