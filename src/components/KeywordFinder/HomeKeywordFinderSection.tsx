import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import ScrollContainer from 'src/components/ScrollContainer';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import ArrowV from 'src/svgs/ArrowV.svg';

const Section = styled.section`
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 24px;
  ${orBelow(BreakPoint.LG, 'padding: 16px;')}
`;

const SectionTitle = styled.h2`
  font-weight: normal;
  height: 21px;
  line-height: 21px;
  font-size: 19px;
  margin-bottom: 26px;
  a {
    color: black;
  }
`;

const List = styled.ul`
  display: flex;

  li + li {
    margin-left: 6px;
  }
`;

const Keyword = styled.li`
  height: 31px;
  flex: none;
`;

const KeywordAnchor = styled.a`
  border: 1px solid #b8bfc4;
  height: 30px;
  border-radius: 20px;
  display: block;
  font-size: 14px;
  line-height: 29px;
  font-weight: bold;
  color: #525a61;
  padding: 0 10px;

  &::before {
    display: inline;
    content: '#';
  }
`;

interface Keyword {
  id: number;
  name: string;
  tag_id: number;
  set_id: number;
}

interface HomeKeywordFinderSectionProps {
  genre: string;
  items: Keyword[];
}

const HomeKeywordFinderSection: React.FC<HomeKeywordFinderSectionProps> = (props) => {
  const { genre, items: keywords } = props;
  const parentGenre = genre === 'comics' ? 'comic' : genre.split('-')[0];
  const genreSearchParam = new URLSearchParams();
  if (['bl', 'fantasy', 'romance'].includes(parentGenre)) {
    genreSearchParam.append('from', genre);
  }

  return keywords && keywords.length ? (
    <Section>
      <SectionTitle aria-label="키워드 파인더로 이동">
        <a
          href={`/keyword-finder/${parentGenre}?${genreSearchParam.toString()}`}
          aria-label="키워드 파인더"
        >
          <span>키워드로 검색하기</span>
          <ArrowV css={css`margin-left: 7.8px;`} />
        </a>
      </SectionTitle>
      <ScrollContainer
        leftArrowLabel="이전 키워드 보기"
        rightArrowLabel="다음 키워드 보기"
      >
        <List>
          {keywords.map((keyword, index) => {
            const keywordSetAndTagSearchParam = new URLSearchParams(genreSearchParam);
            keywordSetAndTagSearchParam.append('set_id', keyword.set_id.toString());
            keywordSetAndTagSearchParam.append('tag_ids[]', keyword.tag_id.toString());
            return (
              <Keyword key={index}>
                <KeywordAnchor
                  href={`/keyword-finder/${parentGenre}?${keywordSetAndTagSearchParam.toString()}`}
                >
                  {keyword.name}
                </KeywordAnchor>
              </Keyword>
            );
          })}
        </List>
      </ScrollContainer>
    </Section>
  ) : null;
};

export default HomeKeywordFinderSection;
