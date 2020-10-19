import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import * as labels from 'src/labels/common.json';
import GNBCategory from 'src/svgs/GNB_Category.svg';
import { css } from '@emotion/core';
import { clearOutline } from 'src/styles';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import Router, { useRouter } from 'next/router';
import cookieKeys from 'src/constants/cookies';
import Cookies from 'universal-cookie';

import { safeJSONParse } from 'src/utils/common';
import { localStorage } from 'src/utils/storages';
import Link from 'next/link';
import {
  dodgerBlue60,
  slateGray10,
  slateGray20,
  slateGray50,
  slateGray60,
  slateGray80,
} from '@ridi/colors';

const GenreTabWrapper = styled.ul`
  max-width: 1000px;
  margin: 0 auto;
  background: white;
`;

const Ruler = styled.hr`
  position: absolute;
  width: 100vw;
  border: 0 none;
  left: 0;
  height: 1px;
  background-color: ${slateGray10};
`;

const resetPadding = orBelow(
  999,
  `
    padding: 0;
  `,
);

const GenreList = styled.ul`
  display: flex;
  flex-direction: row;
  height: 48px;
  align-items: center;
  ${orBelow(BreakPoint.LG, 'height: 44px;')}
  li {
    outline: none;
    a {
      display: inline-block;
      padding: 0 22px;
      ${resetPadding};
      font-size: 16px;
      font-weight: 500;
      line-height: 48px;
      height: 100%;
      width: 100%;
      ${clearOutline};
      ${orBelow(BreakPoint.LG, 'line-height: 44px;')}
      button {
        outline: none;
      }
    }
    height: 100%;
    text-align: center;
    color: ${slateGray80};
    cursor: pointer;
    :first-of-type {
      line-height: 56px;
      margin-right: 0;
      a {
        padding: 0 20px;
        ${resetPadding};
      }
    }
    margin-right: 10px;
  }
  ${orBelow(
    999,
    `
      justify-content: space-around;
      li {
        flex-grow: 1;
        padding: 0;
        margin: 0;
        :first-of-type {
          padding: 0;
        }
      }
    `,
  )};
`;

const GenreListItem = styled.li<{ isCategory: boolean }>`
  :hover {
    ${(props) => props.isCategory
      && css`
        opacity: 0.7;
      `};
  }
`;

const GNBCategoryIcon = styled(GNBCategory)<{ isCategory: boolean }>`
  position: relative;
  top: 2px;
  width: 24px;
  height: 24px;
  fill: ${slateGray60};
  ${(props) => props.isCategory
    && css`
      fill: ${dodgerBlue60};
    `};
`;

const SubServicesList = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 48px;
  font-size: 16px;
  color: ${slateGray50};
  ${orBelow(BreakPoint.LG, 'height: 44px;')}
  li {
    height: 100%;
    line-height: 50px;
    ${orBelow(BreakPoint.LG, 'line-height: 44px;')}
    button {
      font-size: 16px;
      ${clearOutline};
    }
    a {
      font-size: 16px;
      ${clearOutline};
      display: inline-block;
      height: 100%;
    }
    span {
      display: inline-block;
      cursor: pointer;
      height: 100%;
    }
    :not(:last-of-type) {
      ::after {
        position: relative;
        content: '|';
        font-size: 13px;
        margin: 0 16px;
        color: ${slateGray20};
        ${orBelow(330, 'margin: 0 12px;')}
      }
    }
  }
`;

const activeLabelCSS = css`
  :hover {
    opacity: 1;
    color: ${dodgerBlue60};
  }
  @media (hover: hover) {
    :hover {
      opacity: 1;
    }
  }
  @media (hover: none) {
    :hover {
      opacity: 1;
    }
  }
`;

const genreLabelCSS = css`
  :hover {
    opacity: 0.7;
  }
`;

const ActiveText = styled.span`
  color: ${dodgerBlue60};
  font-weight: bold;
  :hover {
    opacity: 1;
  }
`;

const GenreTabDivider = styled.hr`
  border: 0;
  height: 1px;
  display: block !important;
  background: #e6e8eb;
`;

// Fixme
const legacyCookieMap: {[index: string]: string} = {
  general: '',
  comics: 'comic',
  'romance-serial': 'romance_serial',
  'fantasy-serial': 'fantasy_serial',
  'bl-serial': 'bl_serial',
};

const routeChangeCompleteHandler = () => {
  if (Router.router) {
    const { pathname, query } = Router.router;
    if (pathname === '/[genre]') {
      const genre = query.genre?.toString();
      const cookies = new Cookies();
      cookies.set(
        cookieKeys.main_genre,
        legacyCookieMap[genre] ?? genre,
        {
          path: '/',
          sameSite: 'lax',
        },
      );
    }
  }
};

type Genres = 'general' | 'romance' | 'fantasy' | 'comics' | 'bl';
const genres: Map<Genres, {
  name: string;
  path: string;
  activePaths: RegExp;
  subGenres?: Array<{ name: string; path: string; activePaths: RegExp }>;
}> = new Map([
  ['general', {
    name: '일반',
    path: '/',
    activePaths: /^(\/general)?\/?$/,
  }],
  ['romance', {
    name: '로맨스',
    path: '/romance',
    activePaths: /^\/romance(-serial)?\/?$/,
    subGenreKey: 'romance',
    subGenres: [
      { name: 'e북', path: '/romance', activePaths: /^\/romance\/?$/ },
      { name: '웹소설', path: '/romance-serial', activePaths: /^\/romance-serial\/?$/ },
    ],
  }],
  ['fantasy', {
    name: '판타지',
    path: '/fantasy',
    activePaths: /^\/fantasy(-serial)?\/?$/,
    subGenres: [
      { name: 'e북', path: '/fantasy', activePaths: /^\/fantasy\/?$/ },
      { name: '웹소설', path: '/fantasy-serial', activePaths: /^\/fantasy-serial\/?$/ },
    ],
  }],
  ['comics', {
    name: '만화',
    path: '/comics',
    activePaths: /^\/(comics|webtoon)\/?$/,
    subGenres: [
      { name: 'e북', path: '/comics', activePaths: /^\/comics\/?$/ },
      { name: '웹툰', path: '/webtoon', activePaths: /^\/webtoon\/?$/ },
    ],
  }],
  ['bl', {
    name: 'BL',
    path: '/bl-novel',
    activePaths: /^\/bl(-webtoon|-novel|-webnovel|-serial|-comics)?\/?$/,
    subGenres: [
      { name: '소설 e북', path: '/bl-novel', activePaths: /^\/bl-novel\/?$/ },
      { name: '웹소설', path: '/bl-webnovel', activePaths: /^\/bl-webnovel\/?$/ },
      { name: '만화 e북', path: '/bl-comics', activePaths: /^\/bl-comics\/?$/ },
      { name: '웹툰', path: '/bl-webtoon', activePaths: /^\/bl-webtoon\/?$/ },
    ],
  }],
]);

interface TabItemProps {
  label: string;
  href: string;
  isActive: boolean;
}

const TabItem: React.FC<TabItemProps> = (props) => {
  const { href, isActive, label } = props;
  const cookies = new Cookies();
  const handleAnchorClick = () => {
    if (href === '/') {
      cookies.set('main_genre', '', { path: '/', sameSite: 'lax' });
    }
  };

  return (
    <li css={isActive ? activeLabelCSS : genreLabelCSS}>
      {!process.env.USE_CSR ? (
        <a
          aria-label={label}
          href={href}
          onClick={handleAnchorClick}
        >
          {isActive ? <ActiveText>{label}</ActiveText> : <span>{label}</span>}
        </a>
      ) : (
        <Link
          href={href === '/' ? { pathname: '/[genre]', query: { genre: 'general' } } : '/[genre]'}
          as={href}
        >
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <a
            aria-label={label}
            onClick={handleAnchorClick}
          >
            {isActive ? <ActiveText>{label}</ActiveText> : <span>{label}</span>}
          </a>
        </Link>
      )}
    </li>
  );
};

interface GenreTabProps {
  currentGenre: string;
  isPartials?: boolean;
  hasBookId?: boolean;
  bookPath?: string;
}

const GenreTab: React.FC<GenreTabProps> = React.memo((props) => {
  const { currentGenre } = props;
  const currentGenreKey = currentGenre !== 'webtoon' ? currentGenre.split('-')[0] as Genres : 'comics';
  const subGenreData = genres.get(currentGenreKey)?.subGenres;

  const router = useRouter();
  const [subServices, setSubServices] = useState({
    romance: '/romance',
    fantasy: '/fantasy',
    comics: '/comics',
    bl: '/bl-novel',
  });

  const subServicesValidator = (saved: typeof subServices) => (Object.keys(subServices) as Array<keyof typeof subServices>)
    .reduce((acc, genre) => ({
      [genre]: genres.get(genre)?.activePaths.test(saved[genre]) ? saved[genre] : genres.get(genre)?.path,
      ...acc,
    }), {} as typeof subServices);

  useEffect(() => {
    const latestSubService = safeJSONParse(
      localStorage.getItem('latest_sub_service'),
      subServices,
    );
    if (router.pathname === '/[genre]' && currentGenreKey !== 'general') {
      const updatedSubService = {
        ...latestSubService,
        [currentGenreKey]: router.asPath,
      };
      setSubServices(subServicesValidator(updatedSubService));
      localStorage.setItem('latest_sub_service', JSON.stringify(updatedSubService));
    } else {
      setSubServices(subServicesValidator(latestSubService));
    }
  }, [router.asPath]);

  useEffect(() => {
    Router.events.on('routeChangeComplete', routeChangeCompleteHandler);
    if (process.env.USE_CSR && router.query.genre !== 'general') {
      routeChangeCompleteHandler();
    }
    return () => {
      Router.events.off('routeChangeComplete', routeChangeCompleteHandler);
    };
  }, []);

  return (
    <>
      <GenreTabWrapper>
        <li>
          <GenreList>
            <GenreListItem isCategory={currentGenre === 'category'}>
              <a href="/category/list" aria-label="카테고리 목록">
                <GNBCategoryIcon isCategory={currentGenre === 'category'} />
                <span className="a11y">{labels.category}</span>
              </a>
            </GenreListItem>
            {Array.from(genres.entries()).map(([key, genre]) => (
              <TabItem
                key={genre.path}
                href={genre.subGenres ? subServices[key as Exclude<Genres, 'general'>] : genre.path}
                isActive={genre.activePaths.test(`/${currentGenre}`)}
                label={genre.name}
              />
            ))}
          </GenreList>
        </li>
        <li>
          <Ruler />
        </li>
        {subGenreData ? (
          <li>
            <SubServicesList>
              {subGenreData.map((service) => (
                <TabItem
                  key={service.path}
                  href={service.path}
                  isActive={service.activePaths.test(`/${currentGenre}`)}
                  label={service.name}
                />
              ))}
            </SubServicesList>
          </li>
        ) : (
          <div
            css={[
              !props.isPartials
                && css`
                  margin-bottom: 20px;
                `,
            ]}
          />
        )}
      </GenreTabWrapper>
      {props.isPartials && <GenreTabDivider />}
    </>
  );
});

export default GenreTab;
