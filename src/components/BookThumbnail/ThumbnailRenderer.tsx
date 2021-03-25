import React, { useState } from 'react';
import styled from '@emotion/styled';
import useAccount from 'src/hooks/useAccount';
import { useViewportIntersection } from 'src/hooks/useViewportIntersection';
import { sendDisplayEvent } from 'src/utils/event-tracker';

import coverAdult from 'src/assets/image/cover_adult.png';

export const IMG_RIDI_CDN_URL = 'https://img.ridicdn.net';

interface ThumbnailRendererProps {
  thumbnailId: string;
  imgSize: 'xxlarge' | 'xlarge' | 'large' | 'small' | 'medium';
  isIntersecting?: boolean;
  slug?: string;
  order?: number;
  className?: string;
  sizes: string;
  bookDecorators?: React.ReactNode;
  isAdultOnly: boolean;
  title: string;
}

const SIZE_PARAMS = [
  { width: 50, path: 'small#1' },
  { width: 90, path: 'small#1' },
  { width: 120, path: 'small?dpi=xhdpi#1' },
  { width: 165, path: 'large' },
  { width: 180, path: 'small?dpi=xxhdpi#1' },
  { width: 220, path: 'large?dpi=xhdpi#1' },
  { width: 225, path: 'xlarge' },
  { width: 300, path: 'xlarge?dpi=xhdpi#1' },
  { width: 330, path: 'large?dpi=xxhdpi#1' },
  { width: 450, path: 'xlarge?dpi=xxhdpi#1' },
  { width: 480, path: 'xxlarge' },
  { width: 640, path: 'xxlarge?dpi=xhdpi#1' },
  { width: 960, path: 'xxlarge?dpi=xxhdpi#1' },
];

const computeThumbnailUrl = (
  isAdultOnly: boolean,
  isIntersection: boolean,
  isVerifiedAdult: boolean | null,
  bId: string,
  imageSize?: string,
) => {
  if (!isIntersection) {
    return { src: undefined, srcset: undefined };
  }
  if (isAdultOnly && !isVerifiedAdult) {
    return { src: coverAdult, srcset: undefined };
  }
  const baseCoverUrl = new URL(`/cover/${bId}/`, IMG_RIDI_CDN_URL);
  const src = new URL(
    imageSize ? `${imageSize}?dpi=xhdpi#1` : 'large?dpi=xhdpi#1',
    baseCoverUrl,
  ).toString();
  const srcset = SIZE_PARAMS.map(({ width, path }) => (
    `${new URL(path, baseCoverUrl).toString()} ${width}w`
  )).join(', ');
  return { src, srcset };
};

const ThumbnailWrapper = styled.div`
  position: relative;
  line-height: 0;
  max-height: inherit;
  &::after {
    display: block;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      linear-gradient(to right,rgba(0, 0, 0, .2) 0,
        rgba(0, 0, 0, 0) 5%,
        rgba(0, 0, 0, 0) 95%,
        rgba(0, 0, 0, .2) 100%
      );
    border: solid 1px rgba(0, 0, 0, .1);
    content: '';
  },

  // https://rididev.slack.com/archives/CHSBJC7U1/p1589944102137700
  :hover::after, :active::after {
    background:
      linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)),
      linear-gradient(90deg, rgba(0, 0, 0, 0.15) 0, rgba(0, 0, 0, 0) 5%, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0.15) 100%);
  }
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.15);
`;

const Thumbnail = styled.img<{ active?: boolean }>`
  ${(props) => !props.active && `
    padding-bottom: 142%;
    height: 0;
    background-image: linear-gradient(147deg, #e6e8eb, #edeff2 55%, #e6e8eb);
  `}
`;
const ThumbnailNoImg = Thumbnail.withComponent('div');

const ThumbnailRenderer: React.FunctionComponent<ThumbnailRendererProps> = React.memo((props) => {
  const {
    thumbnailId, imgSize, sizes, children, slug, order, isAdultOnly, title,
  } = props;
  const loggedUser = useAccount();
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const handleVisible = React.useCallback((visible) => {
    if (!isVisible && visible) {
      setVisible(visible);
      sendDisplayEvent({ slug: slug || 'UNKNOWN_SLUG', id: thumbnailId, order: order || 0 });
    }
  }, [slug, thumbnailId, order, isVisible]);

  const ref = useViewportIntersection<HTMLDivElement>(handleVisible);
  const { src: imageUrl, srcset: imageUrlSet } = computeThumbnailUrl(
    isAdultOnly,
    isVisible,
    Boolean(loggedUser?.is_verified_adult),
    thumbnailId,
    imgSize,
  );
  const imageOnLoad = () => {
    setImageLoaded(true);
  };
  return (
    <ThumbnailWrapper ref={ref}>
      {isVisible ? (
        <Thumbnail
          active={isImageLoaded}
          className={props.className}
          src={imageUrl}
          srcSet={imageUrlSet}
          sizes={sizes}
          alt={title}
          onLoad={imageOnLoad}
        />
      ) : (
        <ThumbnailNoImg
          className={props.className}
          role="img"
          aria-label={title}
        />
      )}
      {children}
    </ThumbnailWrapper>
  );
});
export default ThumbnailRenderer;
