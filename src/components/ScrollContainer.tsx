import React from 'react';
import { css, Interpolation } from '@emotion/core';
import styled from '@emotion/styled';

import Arrow from 'src/components/Carousel/Arrow';
import { useDeviceType } from 'src/hooks/useDeviceType';
import { useScrollSlider } from 'src/hooks/useScrollSlider';
import { displayNoneForTouchDevice, scrollBarHidden } from 'src/styles';

const ControllerContainer = styled.div`
  position: relative;
`;

const SlidingContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  ${scrollBarHidden}
`;

const Marker = styled.div`
  flex: none;
  width: 0;
`;

const Content = styled.div`
  flex: 1;
`;

const SliderControllerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 4px;

  display: flex;
  justify-content: space-between;
  pointer-events: none;

  ${displayNoneForTouchDevice}
`;

const baseArrowStyle = css`
  transition: opacity 0.2s;
  pointer-events: auto;
`;

const arrowHiddenStyle = css`
  opacity: 0;
  pointer-events: none;
`;

const arrowCenterStyle = css`
  align-items: center;
`;

interface SliderControllerProps {
  theme?: 'white' | 'dark';
  leftArrowLabel?: string;
  rightArrowLabel?: string;
  showLeftArrow?: boolean;
  showRightArrow?: boolean;
  onLeftClick?(): void;
  onRightClick?(): void;
  className?: string;
}

function SliderController(props: SliderControllerProps) {
  const { isMobile } = useDeviceType();
  if (isMobile) {
    return null;
  }

  const {
    theme,
    leftArrowLabel,
    rightArrowLabel,
    showLeftArrow,
    showRightArrow,
    onLeftClick,
    onRightClick,
    className,
  } = props;
  return (
    <SliderControllerContainer className={className}>
      <Arrow
        onClickHandler={onLeftClick}
        label={leftArrowLabel}
        color={theme}
        side="left"
        wrapperStyle={[
          baseArrowStyle,
          !showLeftArrow && arrowHiddenStyle,
        ]}
      />
      <Arrow
        label={rightArrowLabel}
        onClickHandler={onRightClick}
        color={theme}
        side="right"
        wrapperStyle={[
          baseArrowStyle,
          !showRightArrow && arrowHiddenStyle,
        ]}
      />
    </SliderControllerContainer>
  );
}

interface Props {
  theme?: 'white' | 'dark';
  leftArrowLabel: string;
  rightArrowLabel: string;
  arrowStyle?: 'center' | Interpolation;
  className?: string;
  children?: React.ReactNode;
}

export default function ScrollContainer(props: Props) {
  const {
    theme,
    leftArrowLabel,
    rightArrowLabel,
    arrowStyle = 'center',
    className,
    children,
  } = props;
  const [ref, moveLeft, moveRight, isOnStart, isOnEnd, leftMarkerRef, rightMarkerRef] = useScrollSlider();
  return (
    <ControllerContainer className={className}>
      <SlidingContainer ref={ref as React.Ref<HTMLDivElement>}>
        <Marker ref={leftMarkerRef as React.Ref<HTMLDivElement>} />
        <Content>
          {children}
        </Content>
        <Marker ref={rightMarkerRef as React.Ref<HTMLDivElement>} />
      </SlidingContainer>
      <SliderController
        theme={theme}
        leftArrowLabel={leftArrowLabel}
        rightArrowLabel={rightArrowLabel}
        showLeftArrow={!isOnStart}
        showRightArrow={!isOnEnd}
        onLeftClick={moveLeft}
        onRightClick={moveRight}
        css={arrowStyle === 'center' ? arrowCenterStyle : arrowStyle}
      />
    </ControllerContainer>
  );
}

ScrollContainer.defaultProps = {
  leftArrowLabel: '이전',
  rightArrowLabel: '다음',
};
