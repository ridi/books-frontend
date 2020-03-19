import React, { useCallback, useRef } from 'react';
import styled from '@emotion/styled';
import QuickMenuShape from 'src/svgs/QuickMenuShape.svg';
import { css } from '@emotion/core';
import { scrollBarHidden } from 'src/styles';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import Arrow, { arrowTransition } from 'src/components/Carousel/Arrow';
import { useScrollSlider } from 'src/hooks/useScrollSlider';
import { QuickMenu } from 'src/types/sections';
import { useDeviceType } from 'src/hooks/useDeviceType';
import { useEventTracker } from 'src/hooks/useEventTracker';
import { SendEventType } from 'src/constants/eventTracking';

const QuickMenuLabel = styled.span`
  font-size: 13px;
  line-height: 1.23;
  color: #525a61;
  min-width: 76px;
  text-align: center;
  word-break: keep-all;
  margin-top: 8px;
  ${orBelow(
    BreakPoint.MD,
    css`
      min-width: 55px;
      width: 100%;
    `,
  )};
`;

const MenuList = styled.ul`
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 24px;
  padding-bottom: 24px;
  padding-left: 13px;
  padding-right: 13px;

  ${orBelow(
    BreakPoint.LG,
    css`
      padding-top: 16px;
      padding-bottom: 16px;
      padding-left: 3px;
      padding-right: 3px;
    `,
  )};

  overflow: auto;
  ${scrollBarHidden};
`;

const MenuItem = styled.li`
  display: inline-block;
  flex: none;
  :not(:last-of-type) {
    margin-right: 9px;
  }
  :first-of-type {
    padding-left: 10px;
  }
  :last-of-type {
    padding-right: 10px;
  }
`;

const MenuAnchor = styled.a`
  ${orBelow(
    BreakPoint.LG,
    css`
      max-width: 50px;
    `,
  )};
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
  flex: none;
`;

interface QuickMenuListProps {
  items: QuickMenu[];
}

const QuickMenuImage = styled.img`
  top: 0;
  transform: translate(-50%, 0);
  left: 50%;
  position: absolute;
  width: 44px;
  height: 44px;
  z-index: 2;
`;

const quickMenuShape = css`
  flex: none;
  height: 44px;
  width: 44px;
  top: 0;
  z-index: 1;
`;

function Item({ menu }) {
  const [tracker] = useEventTracker();
  const sendQuickMenuClickEvent = useCallback(() => {
    tracker.sendEvent(SendEventType.QuickMenu, {
      // https://app.asana.com/0/1166576097448534/1162603665774601
      category: SendEventType.QuickMenu,
      action: window.location.href,
      label: menu.url,
    });
  }, [tracker]);
  return (
    <MenuItem>
      <MenuAnchor
        onClick={sendQuickMenuClickEvent}
        href={menu.url}
        aria-label={menu.name}
      >
        <QuickMenuShape
          css={[
            quickMenuShape,
            css`
              fill: ${menu.bg_color};
            `,
          ]}
        />
        <QuickMenuImage alt={menu.name} src={menu.icon} />
        <QuickMenuLabel>{menu.name}</QuickMenuLabel>
      </MenuAnchor>
    </MenuItem>
  );
}
const MemoizedQuickMenuItem: React.FC<{ menu: QuickMenu }> = React.memo(Item);

const arrowWrapper = css`
  z-index: 2;
  position: absolute;
  top: 30px;
  transition: opacity 0.2s;
`;

const Section = styled.section`
  position: relative;
`;

export const QuickMenuList: React.FC<QuickMenuListProps> = (props) => {
  const ref = useRef<HTMLUListElement>(null);
  const [moveLeft, moveRight, isOnTheLeft, isOnTheRight] = useScrollSlider(ref, true);
  const { isMobile } = useDeviceType();
  return (
    <Section>
      <h2 className="a11y">퀵 메뉴</h2>
      <MenuList ref={ref}>
        {props.items.map((menu, index) => (
          <MemoizedQuickMenuItem key={index} menu={menu} />
        ))}
      </MenuList>
      {!isMobile && (
        <form
          css={css`
            height: 0;
            @media (hover: none) {
              display: none;
            }
          `}
        >
          <Arrow
            label="이전 퀵 메뉴"
            side="left"
            onClickHandler={moveLeft}
            wrapperStyle={[
              arrowWrapper,
              css`
                left: 5px;
              `,
              !isOnTheLeft && arrowTransition,
            ]}
          />
          <Arrow
            label="다음 퀵 메뉴"
            side="right"
            onClickHandler={moveRight}
            wrapperStyle={[
              arrowWrapper,
              css`
                right: 5px;
              `,
              !isOnTheRight && arrowTransition,
            ]}
          />
        </form>
      )}
    </Section>
  );
};
