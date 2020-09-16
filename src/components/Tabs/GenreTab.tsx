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
    opacity: 1;
    ${(props) => props.isCategory
      && css`
        opacity: 0.7;
      `};
  }
`;

const iconCSS = css`
  position: relative;
  top: 2px;
  width: 24px;
  height: 24px;
  fill: ${slateGray60};
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

interface TabItemProps {
  label: string;
  activePath: RegExp;
  href: string;
}

const subGenres: {
  [genre: string]: Array<{ name: string; path: string; activePaths: RegExp }>;
} = {
  bl: [
    { name: '소설 e북', path: '/bl-novel', activePaths: /^\/bl-novel\/?$/ },
    { name: '웹소설', path: '/bl-webnovel', activePaths: /^\/bl-webnovel\/?$/ },
    { name: '만화 e북', path: '/bl-comics', activePaths: /^\/bl-comics\/?$/ },
    { name: '웹툰', path: '/bl-webtoon', activePaths: /^\/bl-webtoon\/?$/ },
  ],
  fantasy: [
    { name: '단행본', path: '/fantasy', activePaths: /^\/fantasy\/?$/ },
    { name: '연재', path: '/fantasy-serial', activePaths: /^\/fantasy-serial\/?$/ },
  ],
  romance: [
    { name: '단행본', path: '/romance', activePaths: /^\/romance\/?$/ },
    { name: '연재', path: '/romance-serial', activePaths: /^\/romance-serial\/?$/ },
  ],
};

const TabItem: React.FC<TabItemProps> = (props) => {
  const router = useRouter();
  const { href, activePath, label } = props;
  const [isActivePath, setIsActivePath] = useState(false);
  const cookies = new Cookies();
  const handleAnchorClick = () => {
    if (href === '/') {
      cookies.set('main_genre', '', { path: '/', sameSite: 'lax' });
    }
  };

  useEffect(() => {
    setIsActivePath(activePath.test(router.asPath));
  }, [activePath, router.asPath]);

  return (
    <li css={isActivePath ? activeLabelCSS : genreLabelCSS}>
      {!process.env.USE_CSR ? (
        <a
          aria-label={label}
          href={href}
          onClick={handleAnchorClick}
        >
          {isActivePath ? <ActiveText>{label}</ActiveText> : <span>{label}</span>}
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
            {isActivePath ? <ActiveText>{label}</ActiveText> : <span>{label}</span>}
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

interface SavedSubServices {
  romance: string;
  bl: string;
  fantasy: string;
}

const GenreTab: React.FC<GenreTabProps> = React.memo((props) => {
  const { currentGenre } = props;
  const subGenreData = subGenres[currentGenre.split('-')[0]];

  const router = useRouter();
  const [subServices, setSubServices] = useState<SavedSubServices>({
    romance: '/romance',
    fantasy: '/fantasy',
    bl: '/bl-novel',
  });
  const isCategoryList = router.asPath.startsWith('/category/list');

  const subServicesValidator = (saved: SavedSubServices) => ({
    romance: ['/romance', '/romance-serial'].includes(saved.romance) ? saved.romance : '/romance',
    fantasy: ['/fantasy', '/fantasy-serial'].includes(saved.fantasy) ? saved.fantasy : '/fantasy',
    bl: ['/bl-novel', '/bl-webnovel', '/bl-comics', '/bl-webtoon'].includes(saved.bl) ? saved.bl : '/bl-novel',
  });

  useEffect(() => {
    const latestSubService = safeJSONParse(
      localStorage.getItem('latest_sub_service'),
      subServices,
    );
    const genre = /romance|fantasy|bl/.exec(router.query.genre?.toString())?.[0];
    if (router.pathname === '/[genre]' && genre) {
      const updatedSubService = {
        ...latestSubService,
        [genre]: router.asPath,
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
            <GenreListItem isCategory={isCategoryList}>
              <a href="/category/list" aria-label="카테고리 목록">
                <GNBCategory
                  css={css`
                    ${iconCSS};
                    ${isCategoryList
                      && css`
                        fill: ${dodgerBlue60};
                      `};
                  `}
                />
                <span className="a11y">{labels.category}</span>
              </a>
            </GenreListItem>
            <TabItem activePath={/^\/?$/} label="일반" href="/" />
            <TabItem
              activePath={/^\/romance(-serial)?\/?$/}
              label="로맨스"
              href={subServices.romance || '/romance'}
            />
            <TabItem
              activePath={/^\/fantasy(-serial)?\/?$/}
              label="판타지"
              href={subServices.fantasy || '/fantasy'}
            />
            <TabItem activePath={/^\/comics\/?$/} label="만화" href="/comics" />
            <TabItem
              activePath={/^\/bl(-webtoon|-novel|-webnovel|-serial|-comics)?\/?$/}
              label="BL"
              href={subServices.bl || '/bl-novel'}
            />
          </GenreList>
        </li>
        <li>
          <Ruler />
        </li>
        {subGenreData ? (
          <li>
            <SubServicesList>
              {subGenreData.map((service, index) => (
                <TabItem
                  key={index}
                  href={service.path}
                  activePath={service.activePaths}
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
