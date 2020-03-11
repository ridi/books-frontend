import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import * as labels from 'src/labels/common.json';
import GNBCategory from 'src/svgs/GNB_Category.svg';
import { css, SerializedStyles } from '@emotion/core';
import { clearOutline, RIDITheme } from 'src/styles';
import { orBelow } from 'src/utils/mediaQuery';
import { useRouter } from 'next/router';
import * as Cookies from 'js-cookie';
import { safeJSONParse } from 'src/utils/common';

const GenreTabWrapper = styled.ul`
  max-width: 1000px;
  margin: 0 auto;
  background: white;
`;

const rulerCSS = (theme) => css`
  position: absolute;
  width: 100vw;
  border: 0 none;
  left: 0;
  height: 1px;
  background-color: ${theme.divider2};
`;

const genreListPartialsCSS = (theme) => css`
  display: flex;
  flex-direction: row;
  height: 47px;
  align-items: center;
  li {
    a {
      display: inline-block;
      padding: 0 22px;
      ${orBelow(
    999,
    css`
          padding: 0;
        `,
  )};
      font-size: 16px;
      font-weight: 500;
      line-height: 47px;
      height: 100%;
      width: 100%;
      ${clearOutline};
    }
    height: 100%;
    text-align: center;
    color: ${theme.genreTab.normal};
    cursor: pointer;
    :first-of-type {
      line-height: 47px;
      position: relative;
      top: -2px;
      margin-right: 0;
      a {
        padding: 0 20px;
        ${orBelow(
    999,
    css`
            padding: 0;
          `,
  )};
      }
    }
    margin-right: 10px;
  }

  ${orBelow(
    999,
    css`
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

// Todo Refactor css
const genreListCSS = (theme) => css`
  display: flex;
  flex-direction: row;
  height: 47px;
  align-items: center;
  li {
    a {
      display: inline-block;
      padding: 0 22px;
      ${orBelow(
    999,
    css`
          padding: 0;
        `,
  )};
      font-size: 16px;
      font-weight: 500;
      line-height: 47px;
      height: 100%;
      width: 100%;
      ${clearOutline};
    }
    height: 100%;
    text-align: center;
    color: ${theme.genreTab.normal};
    cursor: pointer;
    :first-of-type {
      line-height: 56px;
      margin-right: 0;
      a {
        padding: 0 20px;
        ${orBelow(
    999,
    css`
            padding: 0;
          `,
  )};
      }
    }
    margin-right: 10px;
  }

  ${orBelow(
    999,
    css`
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

const iconCSS = (theme: RIDITheme) => css`
  position: relative;
  top: 2px;
  width: 24px;
  height: 24px;
  fill: ${theme.genreTab.icon};
`;

const subServicesListCSS = (theme) => css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 50px;
  font-size: 17px;
  color: ${theme.subServiceTab.normal};
  li {
    height: 100%;
    line-height: 50px;
    a {
      font-size: 17px;
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
        top: -3px;
        margin: 0 16px;
        color: ${theme.divider3};
      }
    }
  }
`;

const genreTab = (theme: RIDITheme) => css`
  color: ${theme.primaryColor};
  font-weight: bold;
  :hover {
    opacity: 1;
  }
`;
const subServiceTab = (theme: RIDITheme) => css`
  color: ${theme.primaryColor};
  font-weight: 600;
`;

// @ts-ignore
const normal = (theme: RIDITheme) => css``;

interface TabItemProps {
  label: string;
  activePath: RegExp;
  currentCSS: (theme: RIDITheme) => SerializedStyles;
  normalCSS: (theme: RIDITheme) => SerializedStyles;
  labelCSS: (theme: RIDITheme) => SerializedStyles;
  route?: string;
  isPartial?: boolean;
}

// @ts-ignore
const genreTabLabelCSS = (theme: RIDITheme) => css`
  :hover {
    opacity: 0.7;
  }
`;
// @ts-ignore
const subServiceTabLabelCSS = (theme: RIDITheme) => css`
  :hover {
    color: #303538;
  }
`;

const subGenres: { [genre: string]: Array<{ name: string; path: string; activePaths: RegExp }> } = {
  bl: [
    { name: '단행본', path: '/bl', activePaths: /^\/bl\/?$/ },
    { name: '연재', path: '/bl-serial', activePaths: /^\/bl-serial\/?$/ },
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
  const { route, activePath } = props;
  const [isActivePath, setIsActivePath] = useState(false);
  const cookieGenre = Cookies.get('main_genre') || '';

  useEffect(() => {
    setIsActivePath(activePath.test(router.asPath));
  }, [activePath, router.asPath]);

  return (
    <li
      css={(theme) => css`
        ${isActivePath
        ? css`
              :hover {
                opacity: 1;
                color: #1f8ce6;
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
            `
        : props.labelCSS(theme)};
      `}
    >
      <a
        aria-label={props.label}
        href={route}
        onClick={() => {
          if (route === '/' && cookieGenre) {
            Cookies.set('main_genre', '', { sameSite: 'lax' });
          }
        }}
      >
        <span css={isActivePath ? props.currentCSS : props.normalCSS}>{props.label}</span>
      </a>
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
  const { currentGenre, isPartials } = props;
  const subGenreData = subGenres[currentGenre.split('-')[0]];

  const router = useRouter();
  const [subServices, setSubServices] = useState<SavedSubServices>({
    romance: '/romance',
    fantasy: '/fantasy',
    bl: '/bl',
  });

  useEffect(() => {
    const latestSubService = safeJSONParse(localStorage.getItem('latest_sub_service'), subServices);
    setSubServices(latestSubService);

    const genre = /romance|fantasy|bl/.exec(router.asPath)?.[0];
    if (genre) {
      const updatedSubService = {
        ...latestSubService,
        [genre]: router.asPath,
      };
      setSubServices(updatedSubService);
      localStorage.setItem('latest_sub_service', JSON.stringify(updatedSubService));
    }
  }, [router.asPath]);

  return (
    <>
      <GenreTabWrapper>
        <li>
          <ul
            css={
              props.isPartials
                ? (theme) => genreListPartialsCSS(theme)
                : (theme) => genreListCSS(theme)
            }
          >
            <li
              css={css`
                outline: none;
                ${router.asPath.startsWith('/category/list')
                ? css`
                      :hover {
                        opacity: 1 !important;
                      }
                    `
                : css`
                      :hover {
                        opacity: 0.7;
                      }
                    `}
              `}
            >
              <a href="/category/list" aria-label="카테고리 목록">
                <button
                  css={css`
                    outline: none;
                  `}
                >
                  <GNBCategory
                    css={(theme: RIDITheme) => css`
                      ${iconCSS(theme)};
                      ${router.asPath.startsWith('/category/list')
                      ? css`
                            fill: ${theme.primaryColor};
                          `
                      : ''};
                    `}
                  />
                  <span className="a11y">{labels.category}</span>
                </button>
              </a>
            </li>
            <TabItem
              normalCSS={normal}
              currentCSS={genreTab}
              labelCSS={genreTabLabelCSS}
              activePath={/^\/?$/}
              label="일반"
              route="/"
              isPartial={isPartials}
            />
            <TabItem
              normalCSS={normal}
              currentCSS={genreTab}
              labelCSS={genreTabLabelCSS}
              activePath={/^\/romance(-serial)?\/?$/}
              label="로맨스"
              route={subServices.romance || '/romance'}
              isPartial={isPartials}
            />
            <TabItem
              normalCSS={normal}
              currentCSS={genreTab}
              labelCSS={genreTabLabelCSS}
              activePath={/^\/fantasy(-serial)?\/?$/}
              label="판타지"
              route={subServices.fantasy || '/fantasy'}
              isPartial={isPartials}
            />
            <TabItem
              normalCSS={normal}
              currentCSS={genreTab}
              labelCSS={genreTabLabelCSS}
              activePath={/^\/comics\/?$/}
              label="만화"
              route="/comics"
              isPartial={isPartials}
            />
            <TabItem
              normalCSS={normal}
              currentCSS={genreTab}
              labelCSS={genreTabLabelCSS}
              activePath={/^\/bl(-serial)?\/?$/}
              label="BL"
              route={subServices.bl || '/bl'}
              isPartial={isPartials}
            />
          </ul>
        </li>
        <li>
          <hr css={rulerCSS} />
        </li>
        {subGenreData ? (
          <li>
            <ul css={subServicesListCSS}>
              {subGenreData.map((service, index) => (
                <TabItem
                  key={index}
                  route={service.path}
                  normalCSS={normal}
                  currentCSS={subServiceTab}
                  labelCSS={subServiceTabLabelCSS}
                  activePath={service.activePaths}
                  label={service.name}
                  isPartial={isPartials}
                />
              ))}
            </ul>
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
      {props.isPartials && (
        <hr
          css={css`
            border: 0;
            height: 1px;
            display: block !important;
            background: #e6e8eb;
          `}
        />
      )}
    </>
  );
});

export default GenreTab;
