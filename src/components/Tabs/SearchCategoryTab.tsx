import React, { useEffect, useRef } from 'react';
import * as SearchTypes from 'src/types/searchResults';
import styled from '@emotion/styled';
import {
  slateGray20,
  slateGray40,
  slateGray50,
  slateGray60,
  slateGray90,
} from '@ridi/colors';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { findNearestOverflowElement } from 'src/utils/common';

interface SearchCategoryProps {
  categories: SearchTypes.Aggregation[];
  currentCategoryId: number;
}

const CategoryList = styled.ul`
  display: flex;
  box-shadow: inset 0px -1px 0px ${slateGray20};
  height: 45px;
  ${orBelow(BreakPoint.MD, 'padding-left: 16px; padding-right: 16px;')};
`;

const CategoryItem = styled.li<{ active: boolean }>`
  flex: none;
  display: flex;
  justify-content: space-between;
  :not(:first-of-type) {
    margin-left: 10px;
  }
  cursor: pointer;
  ${(props) => (props.active && `box-shadow: inset 0px -3px 0px ${slateGray40};`)}
`;

const CategoryAnchor = styled.a`
  padding: 15px 4px;
  :active {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const CategoryName = styled.span<{ active: boolean }>`
  color: ${(props) => (props.active ? slateGray90 : slateGray60)};
  font-size: 14px;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
`;

const CategoryCount = styled(CategoryName)`
  opacity: 0.7;
  color: ${(props) => (props.active ? slateGray90 : slateGray50)};
`;

function Category(props: {
  currentCategoryId: number;
  category: SearchTypes.Aggregation;
  searchParam: URLSearchParams;
}) {
  const { currentCategoryId, category, searchParam } = props;
  const active = currentCategoryId === category.category_id;
  const copiedSearchParam = new URLSearchParams(searchParam);
  copiedSearchParam.set('category_id', category.category_id.toString());
  copiedSearchParam.delete('page');
  return (
    <CategoryItem active={active} data-is-active={active}>
      <Link
        href={`/search?${copiedSearchParam.toString()}`}
      >
        <CategoryAnchor id={category.category_id.toString()}>
          <CategoryName active={active}>{category.category_name}</CategoryName>
          {' '}
          <CategoryCount active={active}>
            (
            {category.doc_count.toLocaleString('ko-KR')}
            )
          </CategoryCount>
        </CategoryAnchor>
      </Link>
    </CategoryItem>
  );
}

function SearchCategoryTab(props: SearchCategoryProps) {
  const { currentCategoryId = 0, categories } = props;
  const ref = useRef<HTMLUListElement>(null);
  const router = useRouter();
  const searchParam = new URLSearchParams(router?.query as Record<string, string>);
  useEffect(() => {
    if (ref.current) {
      const activeItem = Array.from(ref.current.querySelectorAll('li')).find((item) => item.dataset.isActive === 'true');
      if (activeItem) {
        const { offsetLeft = 0 } = activeItem;
        const scrollableItem = findNearestOverflowElement(activeItem, 3);
        if (scrollableItem) {
          scrollableItem.scrollLeft = offsetLeft - (scrollableItem.clientWidth - activeItem.clientWidth) / 2;
        }
      }
    }
  }, [router.asPath]);

  return (
    <CategoryList ref={ref}>
      {categories.map((category) => (
        <Category
          key={category.category_id}
          currentCategoryId={currentCategoryId}
          category={category}
          searchParam={searchParam}
        />
      ))}
    </CategoryList>
  );
}

export default SearchCategoryTab;
