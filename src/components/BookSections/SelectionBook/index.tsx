import React from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';

import { SectionTitle, SectionTitleLink } from 'src/components/BookSections/SectionTitle';
import useIsTablet from 'src/hooks/useIsTablet';
import { RootState } from 'src/store/config';
import { SectionExtra } from 'src/types/sections';
import { orBelow } from 'src/utils/mediaQuery';
import { useViewportIntersectionOnce } from 'src/hooks/useViewportIntersection';
import { sendViewItemList } from 'src/utils/event-tracker-ga4';

import SelectionBookCarousel from './SelectionBookCarousel';
import SelectionBookList from './SelectionBookList';
import { SelectionBookListProps } from './types';

const SectionWrapper = styled.section`
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 0;
  -webkit-overflow-scrolling: touch;

  ${orBelow(999, 'padding: 16px 0;')}
`;

interface SelectionBookOwnProps {
  title: string;
  categoryId?: number;
  extra?: SectionExtra;
  selectionId?: number;
}

type SelectionBookProps = SelectionBookOwnProps & SelectionBookListProps;

const SelectionBook: React.FunctionComponent<SelectionBookProps> = (props) => {
  const {
    genre, type, items, slug, title, extra, selectionId, categoryId,
  } = props;
  const genreName = useSelector((state: RootState) => (categoryId
    ? state.categories.items?.[categoryId]?.genre_v2 : null));

  // Hack
  const isWebtoon = genreName === 'comic_serial';
  const isTablet = useIsTablet();
  const listProps = {
    genre,
    slug,
    type,
    items: items as any,
  };

  let sectionHref = extra?.detail_link;
  if (!sectionHref && type === 'HomeMdSelection') {
    sectionHref = `/selection/${selectionId}`;
  }

  const ref = useViewportIntersectionOnce<HTMLUListElement>(() => {
    sendViewItemList(items, {
      item_list_id: slug,
    });
  });
  return (
    <SectionWrapper ref={ref}>
      <SectionTitle>
        <SectionTitleLink title={`${isWebtoon ? '[웹툰] ' : ''}${title}`} href={sectionHref} />
      </SectionTitle>
      <div>
        {isTablet ? (
          <SelectionBookList {...listProps} />
        ) : (
          <SelectionBookCarousel {...listProps} />
        )}
      </div>
    </SectionWrapper>
  );
};

export default React.memo(SelectionBook);
