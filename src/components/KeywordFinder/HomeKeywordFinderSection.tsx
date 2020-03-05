import { css } from '@emotion/core';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import React, { useContext, useRef } from 'react';
import ArrowV from 'src/svgs/ArrowV.svg';
import { displayNoneForTouchDevice, scrollBarHidden } from 'src/styles';
import Arrow, { arrowTransition } from 'src/components/Carousel/Arrow';
import { useScrollSlider } from 'src/hooks/useScrollSlider';
import { DeviceTypeContext } from 'src/components/Context/DeviceType';
import 'url-search-params-polyfill';
import styled from '@emotion/styled';

interface Keyword {
  genre: string;
  set_id: number;
  tag_id: number;
  name: string;
}

interface StaticKeywords {
  [key: string]: Keyword[];
}

const popularKeywords: StaticKeywords = {
  'bl-serial': [
    {
      genre: 'bl',
      set_id: 15,
      tag_id: 3051,
      name: '연재중',
    },
    {
      genre: 'bl',
      set_id: 15,
      tag_id: 3052,
      name: '연재완결',
    },
    {
      genre: 'bl',
      set_id: 15,
      tag_id: 2391,
      name: '시리어스물',
    },
    {
      genre: 'bl',
      set_id: 15,
      tag_id: 2388,
      name: '현대물',
    },
    {
      genre: 'bl',
      set_id: 15,
      tag_id: 2402,
      name: '집착공',
    },
    {
      genre: 'bl',
      set_id: 15,
      tag_id: 2425,
      name: '연하공',
    },
    {
      genre: 'bl',
      set_id: 15,
      tag_id: 2912,
      name: '능력수',
    },
    {
      genre: 'bl',
      set_id: 15,
      tag_id: 2412,
      name: '판타지물',
    },
    {
      genre: 'bl',
      set_id: 15,
      tag_id: 2825,
      name: '정치/사회/재벌',
    },
    {
      genre: 'bl',
      set_id: 15,
      tag_id: 2874,
      name: '존댓말공',
    },
  ],
  bl: [
    {
      genre: 'bl',
      set_id: 15,
      tag_id: 2402,
      name: '집착공',
    },
    {
      genre: 'bl',
      set_id: 17,
      tag_id: 2462,
      name: '하드BL',
    },
    {
      genre: 'bl',
      set_id: 15,
      tag_id: 2400,
      name: '후회공',
    },
    {
      genre: 'bl',
      set_id: 17,
      tag_id: 2460,
      name: '일본BL',
    },
    {
      genre: 'bl',
      set_id: 15,
      tag_id: 2403,
      name: '무심수',
    },
    {
      genre: 'bl',
      set_id: 17,
      tag_id: 2445,
      name: '다정공',
    },
    {
      genre: 'bl',
      set_id: 17,
      tag_id: 2459,
      name: '한국BL',
    },
    {
      genre: 'bl',
      set_id: 15,
      tag_id: 2399,
      name: '강공',
    },
    {
      genre: 'bl',
      set_id: 15,
      tag_id: 2397,
      name: '황제공',
    },
  ],
  comics: [
    {
      genre: 'comic',
      set_id: 20,
      tag_id: 188,
      name: '러브코믹',
    },
    {
      genre: 'comic',
      set_id: 20,
      tag_id: 2972,
      name: '츤데레',
    },
    {
      genre: 'comic',
      set_id: 16,
      tag_id: 516,
      name: '오피스물',
    },
    {
      genre: 'comic',
      set_id: 16,
      tag_id: 555,
      name: '달달물',
    },
    {
      genre: 'comic',
      set_id: 20,
      tag_id: 1374,
      name: '순정만화',
    },
    {
      genre: 'comic',
      set_id: 16,
      tag_id: 562,
      name: '일본성인',
    },
  ],
  'fantasy-serial': [
    {
      genre: 'fantasy',
      set_id: 18,
      tag_id: 92,
      name: '현대판타지',
    },
    {
      genre: 'fantasy',
      set_id: 18,
      tag_id: 95,
      name: '먼치킨',
    },
    {
      genre: 'fantasy',
      set_id: 18,
      tag_id: 98,
      name: '환생물',
    },
    {
      genre: 'fantasy',
      set_id: 18,
      tag_id: 96,
      name: '차원이동물',
    },
    {
      genre: 'fantasy',
      set_id: 18,
      tag_id: 88,
      name: '게임판타지',
    },
    {
      genre: 'fantasy',
      set_id: 18,
      tag_id: 99,
      name: '성장물',
    },
    {
      genre: 'fantasy',
      set_id: 18,
      tag_id: 94,
      name: '신무협',
    },
    {
      genre: 'fantasy',
      set_id: 18,
      tag_id: 89,
      name: '대체역사',
    },
  ],
  fantasy: [
    {
      genre: 'fantasy',
      set_id: 18,
      tag_id: 92,
      name: '현대판타지',
    },
    {
      genre: 'fantasy',
      set_id: 18,
      tag_id: 95,
      name: '먼치킨',
    },
    {
      genre: 'fantasy',
      set_id: 18,
      tag_id: 98,
      name: '환생물',
    },
    {
      genre: 'fantasy',
      set_id: 18,
      tag_id: 96,
      name: '차원이동물',
    },
    {
      genre: 'fantasy',
      set_id: 18,
      tag_id: 88,
      name: '게임판타지',
    },
    {
      genre: 'fantasy',
      set_id: 18,
      tag_id: 99,
      name: '성장물',
    },
    {
      genre: 'fantasy',
      set_id: 18,
      tag_id: 94,
      name: '신무협',
    },
    {
      genre: 'fantasy',
      set_id: 18,
      tag_id: 89,
      name: '대체역사',
    },
  ],
  'romance-serial': [
    {
      genre: 'romance_serial',
      set_id: 1,
      tag_id: 3113,
      name: '연재중',
    },
    {
      genre: 'romance_serial',
      set_id: 1,
      tag_id: 3114,
      name: '연재완결',
    },
    {
      genre: 'romance_serial',
      set_id: 1,
      tag_id: 2609,
      name: '판타지물',
    },
    {
      genre: 'romance_serial',
      set_id: 1,
      tag_id: 1,
      name: '현대물',
    },
    {
      genre: 'romance_serial',
      set_id: 1,
      tag_id: 2637,
      name: '소유욕/독점욕/질투',
    },
    {
      genre: 'romance_serial',
      set_id: 1,
      tag_id: 150,
      name: '고수위',
    },
    {
      genre: 'romance_serial',
      set_id: 1,
      tag_id: 52,
      name: '후회남',
    },
    {
      genre: 'romance_serial',
      set_id: 1,
      tag_id: 36,
      name: '친구>연인',
    },
  ],
  romance: [
    {
      genre: 'romance',
      set_id: 1,
      tag_id: 2609,
      name: '판타지물',
    },
    {
      genre: 'romance',
      set_id: 1,
      tag_id: 2637,
      name: '소유욕/독점욕/질투',
    },
    {
      genre: 'romance',
      set_id: 1,
      tag_id: 2700,
      name: '리뷰100개이상',
    },
    {
      genre: 'romance',
      set_id: 1,
      tag_id: 2699,
      name: '평점4점이상',
    },
    {
      genre: 'romance',
      set_id: 1,
      tag_id: 58,
      name: '절륜남',
    },
    {
      genre: 'romance',
      set_id: 1,
      tag_id: 650,
      name: '달달물',
    },
    {
      genre: 'romance',
      set_id: 1,
      tag_id: 36,
      name: '친구>연인',
    },
    {
      genre: 'romance',
      set_id: 1,
      tag_id: 52,
      name: '후회남',
    },
  ],
};

const Section = styled.section`
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  box-sizing: border-box;
  padding-bottom: 24px;
  padding-top: 24px;
  ${orBelow(
    999,
    css`
      padding-bottom: 16px;
      padding-top: 16px;
    `,
  )}
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
  padding-left: 24px;
  ${orBelow(
    BreakPoint.LG,
    css`
      padding-left: 16px;
    `,
  )};
`;

const Keyword = styled.li`
  height: 31px;
  flex: none;
  :not(:last-of-type) {
    margin-right: 6px;
  }
  :last-of-type {
    padding-right: 24px;
  }
  :first-of-type {
    padding-left: 24px;
  }
  ${orBelow(
    BreakPoint.LG,
    css`
      :last-of-type {
        padding-right: 16px;
      }
      :first-of-type {
        padding-left: 16px;
      }
    `,
  )};
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
`;

const arrowWrapperStyle = css`
  z-index: 2;
  position: absolute;
  transition: opacity 0.2s;
  top: 40px;
`;

const List = styled.ul`
  display: flex;
  overflow-x: auto;
  ${scrollBarHidden};
  -webkit-overflow-scrolling: touch;
`;

interface HomeKeywordFinderSectionProps {
  genre: string;
}

const HomeKeywordFinderSection: React.FC<HomeKeywordFinderSectionProps> = (props) => {
  const { genre } = props;
  const genreKeywords = popularKeywords[genre];
  const parentGenre = genre !== 'comics' ? genre.replace('-serial', '') : 'comic';
  const ref = useRef<HTMLUListElement>(null);
  const [moveLeft, moveRight, isOnTheLeft, isOnTheRight] = useScrollSlider(ref, true);
  const { isMobile } = useContext(DeviceTypeContext);
  const genreSearchParam = new URLSearchParams();
  if (['bl', 'fantasy', 'romance'].includes(parentGenre)) {
    genreSearchParam.append('from', genre);
  }

  return (
    <Section>
      <SectionTitle aria-label="키워드 파인더로 이동">
        <a
          href={`/keyword-finder/${parentGenre}?${genreSearchParam.toString()}`}
          aria-label="키워드 파인더"
        >
          <span>키워드로 검색하기</span>
          <ArrowV
            css={css`
              margin-left: 7.8px;
            `}
          />
        </a>
      </SectionTitle>
      <List ref={ref}>
        {genreKeywords.map((keyword, index) => {
          const keywordSetAndTagSearchParam = new URLSearchParams(genreSearchParam);
          keywordSetAndTagSearchParam.append('set_id', keyword.set_id.toString());
          keywordSetAndTagSearchParam.append('tag_ids[]', keyword.tag_id.toString());
          return (
            <Keyword key={index}>
              <KeywordAnchor
                href={`/keyword-finder/${parentGenre}?${keywordSetAndTagSearchParam.toString()}`}
                aria-label={keyword.name}
              >
                #
                {keyword.name}
              </KeywordAnchor>
            </Keyword>
          );
        })}
      </List>
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
            label="이전 키워드 보기"
            side="left"
            onClickHandler={moveLeft}
            wrapperStyle={[
              arrowWrapperStyle,
              css`
                left: 5px;
              `,
              !isOnTheLeft && arrowTransition,
            ]}
          />

          <Arrow
            label="다음 키워드 보기"
            side="right"
            onClickHandler={moveRight}
            wrapperStyle={[
              arrowWrapperStyle,
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

export default HomeKeywordFinderSection;
