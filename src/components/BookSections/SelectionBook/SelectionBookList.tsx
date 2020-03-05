import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { displayNoneForTouchDevice, flexRowStart, scrollBarHidden } from 'src/styles';
import {
  SelectionBookItem,
} from 'src/components/BookSections/SelectionBook/SelectionBook';
import { css } from '@emotion/core';
import { between, BreakPoint, orBelow } from 'src/utils/mediaQuery';
import Arrow, { arrowTransition } from 'src/components/Carousel/Arrow';
import { getArrowVerticalCenterPosition } from 'src/components/Carousel';
import { useScrollSlider } from 'src/hooks/useScrollSlider';
import { DisplayType, MdBook } from 'src/types/sections';
import { DeviceTypeContext } from 'src/components/Context/DeviceType';
import { useExcludeRecommendation } from 'src/hooks/useExcludeRecommedation';

export const listCSS = css`
  padding-top: 7px;
  padding-left: 7px;
  box-sizing: content-box;
  overflow: auto;
  overflow-y: hidden;
  ${orBelow(
    BreakPoint.LG,
    css`
      margin-left: -5px;
      //margin-right: 6px;
    `,
  )}
`;

export const itemCSS = css`
  display: flex;
  flex: none;
  flex-direction: column;
  :first-of-type {
    padding-left: 20px;
  }
  margin-right: 20px;
  :last-of-type {
    padding-right: 20px;
  }
  box-sizing: content-box;

  ${orBelow(
    BreakPoint.MD,
    css`
      margin-right: 12px;
      :last-of-type {
        padding-right: 24px;
      }
      :first-of-type {
        padding-left: 16px;
      }
    `,
  )};
  ${between(
    834,
    999,
    css`
      margin-right: 20px;
    `,
  )};
  align-items: flex-start;
`;

export const loadingItemCSS = css`
  display: flex;
  flex-direction: row;
  :first-of-type {
    padding-left: 18px;
  }
  margin-right: 20px;
  :last-of-type {
    padding-right: 19px;
  }
  box-sizing: content-box;

  ${orBelow(
    BreakPoint.MD,
    css`
      margin-right: 12px;
      :last-of-type {
        padding-right: 24px;
      }
      :first-of-type {
        padding-left: 13px;
      }
    `,
  )};
  ${between(
    834,
    999,
    css`
      :first-of-type {
        padding-left: 17px;
      }
      margin-right: 20px;
    `,
  )};
  align-items: flex-start;
`;

interface SelectionBookListProps {
  items: MdBook[];
  isAIRecommendation: boolean;
  type: DisplayType;
  genre: string;
  slug: string;
}

const SelectionBookList: React.FC<SelectionBookListProps> = React.memo((props) => {
  const ref = useRef<HTMLUListElement>(null);
  const [moveLeft, moveRight, isOnTheLeft, isOnTheRight] = useScrollSlider(ref);
  const { genre, type, slug } = props;
  const { isMobile } = useContext(DeviceTypeContext);
  const [requestExclude, requestCancel] = useExcludeRecommendation();
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    window.setImmediate(() => setMounted(true));
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <div
      css={css`
        margin-top: 6px;
        position: relative;
      `}
    >
      <ul ref={ref} css={[flexRowStart, scrollBarHidden, listCSS]}>
        {props.items
          .filter((item) => item.detail)
          .map((item, index) => (
            <li key={index} css={itemCSS}>
              <SelectionBookItem
                order={index}
                slug={slug}
                genre={genre}
                type={type}
                isAIRecommendation={props.isAIRecommendation}
                aiRecommendationCallback={{
                  exclude: requestExclude,
                  excludeCancel: requestCancel,
                }}
                excluded={item.excluded ?? false}
                book={item}
                width={100}
              />
            </li>
          ))}
      </ul>
      {!isMobile && (
        <form
          css={[
            css`
              height: 0;
            `,
            displayNoneForTouchDevice,
          ]}
        >
          <Arrow
            label="이전"
            side="left"
            onClickHandler={moveLeft}
            wrapperStyle={[
              css`
                position: absolute;
                left: 5px;
                transition: opacity 0.2s;
                top: ${getArrowVerticalCenterPosition()};
              `,
              !isOnTheLeft && arrowTransition,
            ]}
          />

          <Arrow
            label="다음"
            side="right"
            onClickHandler={moveRight}
            wrapperStyle={[
              css`
                position: absolute;
                right: 5px;
                transition: opacity 0.2s;
                top: ${getArrowVerticalCenterPosition()};
              `,
              !isOnTheRight && arrowTransition,
            ]}
          />
        </form>
      )}
    </div>
  );
});

export default SelectionBookList;
