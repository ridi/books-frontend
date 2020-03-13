import React, { useCallback, useContext, useRef } from 'react';
import styled from '@emotion/styled';
import QuickMenuShape from 'src/svgs/QuickMenuShape.svg';
import { css } from '@emotion/core';
import { scrollBarHidden } from 'src/styles';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import Arrow, { arrowTransition } from 'src/components/Carousel/Arrow';
import { useScrollSlider } from 'src/hooks/useScrollSlider';
import { QuickMenu } from 'src/types/sections';
import { DeviceTypeContext } from 'src/components/Context/DeviceType';
import { useEventTracker } from 'src/hooks/useEventTracker';
import { SendEventType } from 'src/constants/eventTracking';

const labelCSS = theme => css`
  font-size: 13px;
  line-height: 1.23;
  color: ${theme.quickMenu.label};
  min-width: 76px;
  text-align: center;
  word-break: keep-all;
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

const MenuItemWrapper = styled.div`
  ${orBelow(
    BreakPoint.LG,
    css`
      max-width: 50px;
    `,
  )};
  a {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

interface QuickMenuListProps {
  items: QuickMenu[];
}

function Item({ menu }) {
  const [tracker] = useEventTracker();
  const sendQuickMenuClickEvent = useCallback(() => {
    tracker.sendEvent(SendEventType.QuickMenu, {
      action: window.location.href,
      label: menu.url,
    });
  }, [tracker]);
  return (
    <MenuItem>
      <MenuItemWrapper>
        <a href={menu.url} aria-label={menu.name}>
          <div
            css={css`
              position: relative;
              height: 44px;
              width: 100%;
              margin-bottom: 8px;
              display: flex;
              justify-content: center;
              align-items: center;
            `}>
            <QuickMenuShape
              css={css`
                flex: none;
                height: 44px;
                width: 44px;
                top: 0;
                z-index: 1;
                fill: ${menu.bg_color};
              `}
            />
            <img
              css={css`
                top: 0;
                transform: translate(-50%, 0);
                left: 50%;
                position: absolute;
                width: 44px;
                height: 44px;
                z-index: 2;
              `}
              alt={menu.name}
              src={menu.icon}
            />
          </div>
          <span css={labelCSS}>{menu.name}</span>
        </a>
      </MenuItemWrapper>
    </MenuItem>
  );
}
const MemoizedQuickMenuItem: React.FC<{ menu: QuickMenu }> = React.memo(Item);

export const QuickMenuList: React.FC<QuickMenuListProps> = props => {
  const ref = useRef<HTMLUListElement>(null);
  const [moveLeft, moveRight, isOnTheLeft, isOnTheRight] = useScrollSlider(ref, true);
  const deviceType = useContext(DeviceTypeContext);
  return (
    <section
      css={css`
        position: relative;
      `}>
      <h2 className={'a11y'} aria-label={'퀵 메뉴'}>
        퀵 메뉴
      </h2>
      <MenuList ref={ref}>
        {props.items.map((menu, index) => (
          <MemoizedQuickMenuItem key={index} menu={menu} />
        ))}
      </MenuList>
      {!['mobile', 'tablet'].includes(deviceType) && (
        <form
          css={css`
            height: 0;
            @media (hover: none) {
              display: none;
            }
          `}>
          <Arrow
            label={'이전 퀵 메뉴'}
            side={'left'}
            onClickHandler={moveLeft}
            wrapperStyle={[
              css`
                z-index: 2;
                position: absolute;
                left: 5px;
                top: 30px;
                transition: opacity 0.2s;
              `,
              !isOnTheLeft && arrowTransition,
            ]}
          />
          <Arrow
            label={'다음 퀵 메뉴'}
            side={'right'}
            onClickHandler={moveRight}
            wrapperStyle={[
              css`
                z-index: 2;
                position: absolute;
                right: 5px;
                top: 30px;
                transition: opacity 0.2s;
              `,
              !isOnTheRight && arrowTransition,
            ]}
          />
        </form>
      )}
    </section>
  );
};
