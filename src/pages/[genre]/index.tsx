import React, { useCallback, useEffect } from 'react';
import Head from 'next/head';
import { ConnectedInitializeProps } from 'src/types/common';
import { GenreTab } from 'src/components/Tabs';
import cookieKeys, { DEFAULT_COOKIE_EXPIRES } from 'src/constants/cookies';
import Router from 'next/router';
import * as Cookies from 'js-cookie';
import titleGenerator from 'src/utils/titleGenerator';
import { useSelector } from 'react-redux';

import { Page, Section } from 'src/types/sections';
import { HomeSectionRenderer } from 'src/components/Section/HomeSectionRenderer';
import pRetry from 'p-retry';
import { keyToArray } from 'src/utils/common';
import axios from 'src/utils/axios';
import { booksActions } from 'src/services/books';
import { Request } from 'express';
import { ServerResponse } from 'http';
import sentry from 'src/utils/sentry';
import { categoryActions } from 'src/services/category';
import { NextPage } from 'next';
import { useEventTracker } from 'src/hooks/useEventTracker';
import { RootState } from 'src/store/config';
import useIsSelectFetch from 'src/hooks/useIsSelectFetch';
import { css } from '@emotion/core';

import { DeviceTypeProvider } from 'src/hooks/useDeviceType';

const { captureException } = sentry();

export interface HomeProps {
  branches: Section[];
  genre: string;
}

const createHomeSlug = (genre: string) => {
  if (!genre || genre === 'general') {
    return 'home-general';
  }
  return `home-${genre}`;
};

const fetchHomeSections = async (genre: string, req?: Request, params = {}) => {
  const result = await pRetry(
    () => axios.get<Page>(`${process.env.NEXT_PUBLIC_STORE_API}/pages/${createHomeSlug(genre)}/`, {
      withCredentials: true,
      params,
    }),
    {
      retries: 2,
      minTimeout: 2000,
    },
  );
  return result.data;
};

// Lambda 에서 올바르게 동작할까. 공유되지 않을까?
// legacy genre 로 쿠키 값 설정
const setCookie = (genre: string) => {
  let convertedLegacyGenre = '';
  if (genre === 'comics') {
    convertedLegacyGenre = 'comic';
  } else if (genre.includes('-')) {
    convertedLegacyGenre = genre.replace('-', '_');
  } else if (genre === 'general') {
    convertedLegacyGenre = '';
  } else {
    convertedLegacyGenre = genre;
  }

  Cookies.set(cookieKeys.main_genre, convertedLegacyGenre, {
    expires: DEFAULT_COOKIE_EXPIRES,
    sameSite: 'lax',
  });
};

export const Home: NextPage<HomeProps> = (props) => {
  const { loggedUser } = useSelector((state: RootState) => state.account);
  const bIds = keyToArray(
    props.branches.filter((section) => section.extra.use_select_api),
    'b_id',
  );
  const [tracker] = useEventTracker();

  const setPageView = useCallback(() => {
    if (tracker) {
      try {
        tracker.sendPageView(window.location.href, document.referrer);
      } catch (error) {
        captureException(error);
      }
    }
  }, [tracker]);

  useIsSelectFetch(bIds);
  useEffect(() => {
    setCookie(props.genre);
    setPageView();
  }, [props.genre, loggedUser, props.branches, setPageView]);
  const { genre } = props;
  const currentGenre = genre || 'general';
  return (
    <>
      <Head>
        <title>{`${titleGenerator(currentGenre)} - 리디북스`}</title>
      </Head>
      <GenreTab currentGenre={currentGenre} />
      <DeviceTypeProvider>
        {props.branches
          && props.branches.map((section, index) => (
            <React.Fragment key={index}>
              <HomeSectionRenderer section={section} order={index} genre={currentGenre} />
            </React.Fragment>
          ))}
        <div
          css={css`
            margin-bottom: 24px;
          `}
        />
      </DeviceTypeProvider>
    </>
  );
};

Home.getInitialProps = async (ctx: ConnectedInitializeProps) => {
  const {
    query, res, req, store,
  } = ctx;

  const { genre = 'general' } = query;
  if (!['general', 'romance', 'romance-serial', 'fantasy', 'fantasy-serial', 'comics', 'bl', 'bl-serial'].includes(genre as string)) {
    throw new Error('Not Found');
  }

  if (req && res) {
    if (res.statusCode !== 302) {
      try {
        // store.dispatch({ type: booksActions.setFetching.type, payload: true });
        const result = await fetchHomeSections(
          // @ts-ignore
          genre,
          req,
        );
        const bIds = keyToArray(result.branches, 'b_id');
        store.dispatch({ type: booksActions.insertBookIds.type, payload: bIds });
        const categoryIds = keyToArray(result.branches, 'category_id');
        store.dispatch({
          type: categoryActions.insertCategoryIds.type,
          payload: categoryIds,
        });
        return {
          genre,
          store,
          ...query,
          ...result,
        };
      } catch (error) {
        console.log(error);
        captureException(error, ctx);
        // redirect(req, res, '/error');
      }
    }
  } else {
    // Client Side
    try {
      const result = await fetchHomeSections(
        // @ts-ignore
        genre || 'general',
        null,
        // Hack
        // 사파리 BFCache 디스크에서 캐시 된 데이터가 그대로 사용되는데 끄걸 회피하기 위해 Query Param 에 초를 삽입하는 꼼수
        // 30초 단위로 잘라 보냄
        { sec: Math.floor(Date.now() / 30000) },
      );
      const bIds = keyToArray(result.branches, 'b_id');
      store.dispatch({ type: booksActions.insertBookIds.type, payload: bIds });
      const categoryIds = keyToArray(result.branches, 'category_id');
      store.dispatch({
        type: categoryActions.insertCategoryIds.type,
        payload: categoryIds,
      });
      const selectBIds = keyToArray(
        result.branches.filter((section) => section.extra.use_select_api),
        'b_id',
      );
      store.dispatch({ type: booksActions.checkSelectBook.type, payload: selectBIds });
      return {
        genre,
        store,
        ...query,
        ...result,
      };
    } catch (error) {
      captureException(error, ctx);
      Router.push('/error');
    }
  }
  return {
    genre,
    store,
    branches: [],
    ...query,
  };
};

export default Home;
