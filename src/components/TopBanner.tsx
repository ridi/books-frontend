import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

import Arrow from 'src/components/Carousel/Arrow';
import BigBannerCarousel from 'src/components/Carousel/BigBannerCarousel';
import { useEventTracker } from 'src/hooks/useEventTracker';
import { useViewportIntersection } from 'src/hooks/useViewportIntersection';
import { TopBanner } from 'src/types/sections';
import { useDeviceType } from 'src/hooks/useDeviceType';
import { SendEventType } from 'src/constants/eventTracking';


const DESKTOP_INACTIVE_SCALE = 0.965;
const ITEM_MARGIN = 10;

const IMAGE_WIDTH = 430;
const MD_IMAGE_WIDTH = 355;

const SLIDE_RADIUS = 1;
const SCROLL_DURATION = 5000;

const CarouselWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  @media (min-width: 375px) {
    max-width: ${MD_IMAGE_WIDTH + (MD_IMAGE_WIDTH + ITEM_MARGIN) * (SLIDE_RADIUS + 1) * 2}px;
  }

  @media (min-width: 1000px) {
    max-width: ${IMAGE_WIDTH + (IMAGE_WIDTH * DESKTOP_INACTIVE_SCALE + ITEM_MARGIN) * (SLIDE_RADIUS + 1) * 2}px;
  }
`;

const CarouselControllerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  pointer-events: none;
`;

const CarouselController = styled.div`
  position: relative;
  width: calc(100vw - ${ITEM_MARGIN * 2}px);
  height: calc(66.67vw - ${(ITEM_MARGIN * 4) / 3}px);

  @media (min-width: 375px) {
    width: ${MD_IMAGE_WIDTH}px;
    height: ${(MD_IMAGE_WIDTH * 2) / 3}px;
  }

  @media (min-width: 1000px) {
    width: ${IMAGE_WIDTH}px;
    height: ${(IMAGE_WIDTH * 2) / 3}px;
  }
`;

const SlideBadge = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 54px;
  height: 24px;

  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;

  font-size: 12px;
  line-height: 22px;
  text-align: center;
  color: white;
`;

const arrowStyle = css`
  opacity: 0.5;
  transition: opacity 0.1s;
  cursor: pointer;

  :hover, :focus {
    opacity: 1;
  }
  @media (hover: none) {
    :hover {
      opacity: 0.5;
    }
  }
`;

const BannerImageLink = styled.a`
  width: 100%;
  height: 100%;

  display: inline-block;
  outline: none;
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: 0 0;
`;

const CarouselItemContainer = styled.li<{ active?: boolean; invisible?: boolean }>`
  flex: none;
  position: relative;
  width: calc(100vw - ${ITEM_MARGIN * 2}px);
  height: calc(66.6667vw - ${(ITEM_MARGIN * 4) / 3}px);

  @media (min-width: 375px) {
    width: ${MD_IMAGE_WIDTH}px;
    height: ${(MD_IMAGE_WIDTH * 2) / 3}px;
  }

  @media (min-width: 1000px) {
    width: ${(props) => IMAGE_WIDTH * (props.active ? 1 : DESKTOP_INACTIVE_SCALE)}px;
    height: ${(props) => (IMAGE_WIDTH * 2 * (props.active ? 1 : DESKTOP_INACTIVE_SCALE)) / 3}px;
  }

  overflow: hidden;
  border-radius: 6px;
  line-height: 0;
  transition: width 0.2s, height 0.2s, box-shadow 0.2s, opacity 0.2s;
  opacity: ${(props) => (props.invisible ? 0 : 1)};

  &:focus-within {
    box-shadow: 0 0.8px 3px rgba(0, 0, 0, 0.33);
  }

  & ::before {
    display: block;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    transition: background-color 0.2s;
    background-color: rgba(26, 26, 26, ${(props) => (props.active ? 0 : 0.5)});

    ${(props) => !props.invisible && 'pointer-events: none;'}
  }
`;

const BannerBadge = styled.div`
  position: absolute;
  right: 12px;
  top: 12px;
  width: 44px;
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #e64937;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 22px;

  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: white;
  word-break: keep-all;
  line-height: 12px;
`;

const ArrowWrapper = styled.div`
  opacity: 0.7;
  margin: 0 20px;

  pointer-events: auto;
`;

const carouselHeight = css`
  height: calc(66.67vw - ${(ITEM_MARGIN * 4) / 3}px);

  @media (min-width: 375px) {
    height: ${(MD_IMAGE_WIDTH * 2) / 3}px;
  }

  @media (min-width: 1000px) {
    height: ${(IMAGE_WIDTH * 2) / 3}px;
  }
`;

function calcItemWidth(isDesktop: boolean, isTablet: boolean) {
  if (isDesktop) {
    return IMAGE_WIDTH;
  }
  if (isTablet) {
    return MD_IMAGE_WIDTH;
  }
  return null;
}

/**
 * 고리 형태의 리스트에서 idx가 [start, end] 사이에 있는지 확인합니다.
 *
 * @argument start - 시작점
 * @argument end - 끝점
 * @argument idx - 확인할 인덱스
 */
function checkWithinRingRange(start: number, end: number, idx: number): boolean {
  // start <= end일 때: [... len-1, 0 ... start ... end ... len-1, 0 ...]
  // idx가 start와 end 사이에 있는지 확인하면 됩니다.
  if (start <= end) {
    return start <= idx && idx <= end;
  }
  // end < start일 때: [... start ... len-1, 0, ... end ...]
  // idx가 start 이상이거나 end 이하인지 확인하면 됩니다.
  return idx <= end || start <= idx;
}

interface CarouselItemProps {
  banner: TopBanner;
  active: boolean;
  invisible: boolean;
  clickHandler: () => void;
}

function CarouselItem(props: CarouselItemProps) {
  const {
    banner, active, invisible, clickHandler,
  } = props;
  const [intersecting, setIntersecting] = React.useState(false);
  const ref = useViewportIntersection<HTMLLIElement>(setIntersecting);
  return (
    <CarouselItemContainer
      ref={ref}
      active={active}
      invisible={invisible}
    >
      <BannerImageLink
        onClick={clickHandler}
        href={banner.landing_url}
        tabIndex={active ? 0 : -1}
      >
        {(!invisible || intersecting) && (
          <BannerImage
            alt={banner.title}
            src={banner.main_image_url}
          />
        )}
        {banner.is_badge_available && banner.badge != null && (
          <BannerBadge>
            {banner.badge === 'END_TODAY' && '오늘 마감'}
            {banner.badge === 'END_IN_3DAY' && '마감 임박'}
          </BannerBadge>
        )}
      </BannerImageLink>
    </CarouselItemContainer>
  );
}

export interface TopBannerCarouselProps {
  banners: TopBanner[];
  slug: string;
}

export default function TopBannerCarousel(props: TopBannerCarouselProps) {
  const { banners, slug } = props;
  const len = banners.length;
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [touchDiff, setTouchDiff] = React.useState<number>();

  const handleLeftClick = React.useCallback(
    () => setCurrentIdx((idx) => (idx - 1 + len) % len),
    [len],
  );
  const handleRightClick = React.useCallback(
    () => setCurrentIdx((idx) => (idx + 1) % len),
    [len],
  );

  // 반응형 너비 조정
  const isDesktop = useMediaQuery({ minWidth: '1000px' });
  const isTablet = useMediaQuery({ minWidth: '375px' });
  const widthRef = React.useRef<number>();
  const [inactiveScale, setInactiveScale] = React.useState(1);
  React.useEffect(() => {
    function handleResize() {
      widthRef.current = undefined;
    }

    const newWidth = calcItemWidth(isDesktop, isTablet);
    if (newWidth == null) {
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }
    widthRef.current = newWidth;
  }, [isDesktop, isTablet]);
  React.useEffect(() => {
    setInactiveScale(isDesktop ? DESKTOP_INACTIVE_SCALE : 1);
  }, [isDesktop]);

  const { deviceType, isMobile } = useDeviceType();
  // 터치 핸들링
  const wrapperRef = React.useRef<HTMLDivElement>();
  const touchRef = React.useRef(null);

  const handleTouchStart = React.useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (touchRef.current != null) {
      return;
    }
    setTouchDiff(0);
    const touch = e.touches[0];
    touchRef.current = {
      id: touch.identifier,
      startX: touch.clientX,
      at: window.performance.now(),
    };
  }, []);

  // passive: false 때문에 useEffect
  React.useEffect(() => {
    function handleTouchMove(e: TouchEvent) {
      // e.preventDefault();
      if (touchRef.current == null) {
        return;
      }
      const touches = e.changedTouches;
      for (let i = 0; i < touches.length; i += 1) {
        const touch = touches[i];
        if (touch.identifier === touchRef.current.id) {
          const diff = touch.clientX - touchRef.current.startX;
          setTouchDiff(diff);
          break;
        }
      }
    }
    wrapperRef.current?.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => wrapperRef.current?.removeEventListener('touchmove', handleTouchMove);
  }, []);

  const handleTouchEnd = React.useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (touchRef.current == null) {
      return;
    }
    if (widthRef.current == null) {
      // cache invalidated
      widthRef.current = window.innerWidth - ITEM_MARGIN * 2;
    }
    const width = widthRef.current;
    const touches = e.changedTouches;
    for (let i = 0; i < touches.length; i += 1) {
      const touch = touches[i];
      if (touch.identifier === touchRef.current.id) {
        const diff = touch.clientX - touchRef.current.startX;
        const dTime = window.performance.now() - touchRef.current.at;
        const velocity = diff / dTime; // px/ms
        const vThreshold = ((width + ITEM_MARGIN) / 200) / 3;
        // threshold 처리
        if (diff > width / 3 || velocity > vThreshold) {
          setCurrentIdx((idx) => (idx - 1 + len) % len);
        }
        if (diff < -width / 3 || velocity < -vThreshold) {
          setCurrentIdx((idx) => (idx + 1) % len);
        }
        setTouchDiff(undefined);
        touchRef.current = null;
        break;
      }
    }
  }, []);

  const handleTouchCancel = React.useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (touchRef.current == null) {
      return;
    }
    const touches = e.changedTouches;
    for (let i = 0; i < touches.length; i += 1) {
      if (touches[i].identifier === touchRef.current.id) {
        setTouchDiff(undefined);
        touchRef.current = null;
        break;
      }
    }
  }, []);

  // 포커스 시 스크롤 안 되게 막는 부분
  const [focused, setFocused] = React.useState(false);
  const handleFocus = React.useCallback(() => setFocused(true), []);
  const handleBlur = React.useCallback(() => setFocused(false), []);

  React.useEffect(() => {
    if (touchDiff != null || focused) {
      return;
    }
    const handle = window.setTimeout(handleRightClick, SCROLL_DURATION);
    return () => window.clearTimeout(handle);
  }, [handleRightClick, currentIdx, touchDiff, focused]);

  // 트래킹
  const [tracker] = useEventTracker();
  const handleBannerClick = React.useCallback((banner: TopBanner) => {
    tracker.sendEvent(SendEventType.Click, {
      section: slug,
      items: [{ id: banner.id, idx: banner.list_order, ts: Date.now() }],
    });
  }, [tracker]);

  React.useEffect(() => {
    // FIXME: 이게 최선입니까?
    window.setImmediate(() => {
      const item = {
        id: banners[currentIdx].id,
        order: currentIdx,
        ts: new Date().getTime(),
      };
      tracker.sendEvent(SendEventType.Display, {
        section: `${deviceType}.${slug}`,
        items: [item],
      });
    });
  }, [banners, currentIdx]);

  return (
    <CarouselWrapper
      ref={wrapperRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <BigBannerCarousel
        totalItems={len}
        itemMargin={ITEM_MARGIN}
        inactiveScale={inactiveScale}
        currentIdx={currentIdx}
        touchDiff={touchDiff}
        css={carouselHeight}
      >
        {({ index, active, activeIndex }) => (
          <CarouselItem
            // eslint-disable-next-line react/jsx-no-bind
            clickHandler={handleBannerClick.bind(null, banners[index])}
            key={index}
            banner={banners[index]}
            active={active}
            invisible={!checkWithinRingRange(
              (activeIndex - SLIDE_RADIUS + len) % len,
              (activeIndex + SLIDE_RADIUS) % len,
              index,
            )}
          />
        )}
      </BigBannerCarousel>
      <CarouselControllerWrapper>
        <CarouselController>
          <SlideBadge>
            <strong>{currentIdx + 1}</strong>
            {` / ${len}`}
          </SlideBadge>
        </CarouselController>
      </CarouselControllerWrapper>
      {!isMobile && (
        <CarouselControllerWrapper>
          <ArrowWrapper>
            <Arrow
              side="left"
              onClickHandler={handleLeftClick}
              label="이전 배너 보기"
              css={arrowStyle}
            />
          </ArrowWrapper>
          <CarouselController />
          <ArrowWrapper>
            <Arrow
              onClickHandler={handleRightClick}
              side="right"
              label="다음 배너 보기"
              css={arrowStyle}
            />
          </ArrowWrapper>
        </CarouselControllerWrapper>
      )}
    </CarouselWrapper>
  );
}
