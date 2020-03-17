import React, {
  useState, useCallback, useEffect, useRef,
} from 'react';
import Head from 'next/head';
import { ConnectedInitializeProps } from 'src/types/common';
import { GenreTab } from 'src/components/Tabs';
import cookieKeys, { DEFAULT_COOKIE_EXPIRES } from 'src/constants/cookies';
import * as Cookies from 'js-cookie';
import titleGenerator from 'src/utils/titleGenerator';
import { useDispatch, useSelector } from 'react-redux';

import { Page, Section } from 'src/types/sections';
import { HomeSectionRenderer } from 'src/components/Section/HomeSectionRenderer';
import pRetry from 'p-retry';
import { keyToArray } from 'src/utils/common';
import axios, { CancelToken } from 'src/utils/axios';
import { booksActions } from 'src/services/books';
import sentry from 'src/utils/sentry';
import { categoryActions } from 'src/services/category';
import { NextPage } from 'next';
import { useEventTracker } from 'src/hooks/useEventTracker';
import { RootState } from 'src/store/config';
import { css } from '@emotion/core';

const { captureException } = sentry();

export interface HomeProps {
  branches: Section[];
  genre: string;
}

const fetchHomeSections = async (genre = 'general', params = {}, options = {}) => {
  const result = await pRetry(
    () => axios.get<Page>(`/pages/home-${genre}/`, {
      baseURL: process.env.NEXT_PUBLIC_STORE_API,
      withCredentials: true,
      params,
      ...options,
    }),
    {
      retries: 2,
      minTimeout: 2000,
    },
  );
  return result.data;
};

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

const usePrevious = <T extends {}>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const Home: NextPage<HomeProps> = (props) => {
  const { loggedUser } = useSelector((state: RootState) => state.account);
  const dispatch = useDispatch();

  const { genre = 'general' } = props;
  const previousGenre = usePrevious(genre);
  const [branches, setBranches] = useState(props.branches || []);

  useEffect(() => {
    const source = CancelToken.source();
    if (!branches.length || (previousGenre && previousGenre !== props.genre)) {
      setBranches([]);
      // store.dispatch({ type: booksActions.setFetching.type, payload: true });
      fetchHomeSections(props.genre, {}, {
        cancelToken: source.token,
      }).then((result) => {
        const { branches: data = [] } = result;
        setBranches(data);
        const bIds = keyToArray(data, 'b_id');
        dispatch({ type: booksActions.insertBookIds.type, payload: bIds });
        const categoryIds = keyToArray(data, 'category_id');
        dispatch({
          type: categoryActions.insertCategoryIds.type,
          payload: categoryIds,
        });
      });
    }
    return source.cancel;
  }, [genre, dispatch]);

  useEffect(() => {
    if (branches?.length > 0) {
      const selectBIds = keyToArray(
        branches.filter((section) => section.extra.use_select_api),
        'b_id',
      );
      dispatch({ type: booksActions.checkSelectBook.type, payload: selectBIds });
    }
  }, [branches]);

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

  useEffect(() => {
    setCookie(props.genre);
    setPageView();
  }, [props.genre, loggedUser, setPageView]);

  return (
    <>
      <Head>
        <title>{`${titleGenerator(genre)} - 리디북스`}</title>
      </Head>
      <GenreTab currentGenre={genre} />
      {branches && branches.map((section, index) => (
        <React.Fragment key={index}>
          <HomeSectionRenderer section={section} order={index} genre={genre} />
        </React.Fragment>
      ))}
      <div
        css={css`
          margin-bottom: 24px;
        `}
      />
    </>
  );
};

Home.getInitialProps = async (ctx: ConnectedInitializeProps) => {
  const {
    query,
    res,
    store,
    isServer,
  } = ctx;

  const { genre = 'general' } = query;
  if (!['general', 'romance', 'romance-serial', 'fantasy', 'fantasy-serial', 'comics', 'bl', 'bl-serial'].includes(genre.toString())) {
    throw new Error('Not Found');
  }

  if (isServer) {
    if (res.statusCode !== 302) {
      try {
        // store.dispatch({ type: booksActions.setFetching.type, payload: true });
        const result = await fetchHomeSections(genre.toString());
        const bIds = keyToArray(result.branches, 'b_id');
        store.dispatch({ type: booksActions.insertBookIds.type, payload: bIds });
        const categoryIds = keyToArray(result.branches, 'category_id');
        store.dispatch({
          type: categoryActions.insertCategoryIds.type,
          payload: categoryIds,
        });

        return {
          genre: genre.toString(),
          store,
          ...query,
          ...result,
        };
      } catch (error) {
        captureException(error, ctx);
        throw new Error(error);
      }
    }
  }
  return {
    genre: genre.toString(),
    store,
    branches: [],
    ...query,
  };
};

export default Home;
