import React, {
  useState, useCallback, useEffect, useRef,
} from 'react';
import Head from 'next/head';
import { ConnectedInitializeProps } from 'src/types/common';
import { GenreTab } from 'src/components/Tabs';
import titleGenerator, { genreKeys } from 'src/utils/titleGenerator';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { checkPage, Section } from 'src/types/sections';
import HomeSectionRenderer from 'src/components/Section/HomeSectionRenderer';
import pRetry from 'p-retry';
import { keyToArray } from 'src/utils/common';
import { NotFoundError } from 'src/utils/error';
import axios, { CancelToken } from 'src/utils/axios';
import { booksActions } from 'src/services/books';
import sentry from 'src/utils/sentry';
import { categoryActions } from 'src/services/category';
import { NextPage } from 'next';
import useAccount from 'src/hooks/useAccount';
import * as tracker from 'src/utils/event-tracker';
import * as braze from 'src/utils/event-tracker-braze';
import * as ga4 from 'src/utils/event-tracker-ga4';
import { css } from '@emotion/core';

import Cookies from 'universal-cookie';
import cookieKeys from 'src/constants/cookies';
import { legacyCookieMap } from 'src/components/GNB/HomeLink';

export interface HomeProps {
  branches: Section[];
  lazyLoadBIds?: string[];
  genre: string;
  ga4debug?: string;
}

const fetchHomeSections = async (genre = 'general', params = {}, options = {}) => {
  const result = await pRetry(
    () => axios.get(`/pages/home-${genre}/`, {
      baseURL: process.env.NEXT_STATIC_STORE_API,
      withCredentials: true,
      params,
      ...options,
    }),
    {
      retries: 2,
      minTimeout: 2000,
    },
  );
  return checkPage(result.data);
};

const usePrevious = <T extends {}>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const Home: NextPage<HomeProps> = (props) => {
  const loggedUser = useAccount();
  const dispatch = useDispatch();
  const route = useRouter();

  const { lazyLoadBIds, genre = 'general' } = props;
  const previousGenre = usePrevious(genre);
  const [branches, setBranches] = useState(props.branches || []);

  useEffect(() => {
    const cookies = new Cookies();
    const cookie = cookies.get(cookieKeys.main_genre);
    if (process.env.USE_CSR && genre === 'general' && cookie) {
      route.replace('/[genre]', `/${legacyCookieMap[cookie] ?? cookie}`);
    }
  }, []);

  useEffect(() => {
    const source = CancelToken.source();
    if (!branches.length || (previousGenre && previousGenre !== props.genre)) {
      setBranches([]);
      fetchHomeSections(props.genre, {}, {
        cancelToken: source.token,
      }).then((result) => {
        const { branches: data = [] } = result;
        setBranches(data);
        const bIds = keyToArray(data, 'b_id');
        dispatch({ type: booksActions.insertBookIds.type, payload: { bIds } });
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
    const selectBIds = keyToArray(
      branches.filter((section) => section.extra?.use_select_api),
      'b_id',
    );
    dispatch({ type: booksActions.checkSelectBook.type, payload: selectBIds });
  }, [branches]);

  const setPageView = useCallback(() => {
    try {
      tracker.sendPageView(window.location.href, document.referrer);
    } catch (error) {
      sentry.captureException(error);
    }
  }, []);

  const setBrazePageView = useCallback(() => {
    braze.sendPageView('open_genre_home_wt');
  }, []);

  const setBrazeUserId = useCallback(() => {
    if (loggedUser) {
      braze.setUserId(loggedUser.idx.toString());
    }
  }, [loggedUser]);

  useEffect(() => {
    braze.initialize();

    setBrazeUserId();

    if (window.location.pathname.startsWith('/webtoon')) {
      setBrazePageView();
    }
  }, [setBrazePageView, setBrazeUserId]);

  useEffect(() => {
    setPageView();
  }, [genre, loggedUser, setPageView]);

  useEffect(() => {
    ga4.initialize();
  }, []);


  useEffect(() => {
    if (lazyLoadBIds) {
      dispatch({ type: booksActions.insertBookIds.type, payload: { bIds: lazyLoadBIds } });
    }
  }, [lazyLoadBIds]);
  return (
    <>
      <Head>
        <title>{`${titleGenerator(genre)} - 리디북스`}</title>
      </Head>
      <GenreTab currentGenre={genre} />
      {branches && branches.map((section, index) => (
        <React.Fragment key={section.slug}>
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
  } = ctx;
  const isServer = Boolean(ctx.req);

  const genre = (query.genre || 'general').toString();
  if (!genreKeys.includes(genre)) {
    throw new NotFoundError(genre);
  }

  if (isServer && res) {
    if (res.statusCode !== 302) {
      const result = await fetchHomeSections(genre.toString());

      // 상대적으로 뒤에 나오는 섹션의 bId를 걸러냄
      const lazyLoadBIds: string[] = [];
      const preLoadBIds: string[] = [];
      result.branches.forEach((branch) => {
        if (/(md-selection|bestseller|recommended-new-book|today-new-book|new-serial-book|wait-free|recommended-book)/g.test(branch.slug)) {
          lazyLoadBIds.push(...keyToArray(branch, 'b_id'));
        } else {
          preLoadBIds.push(...keyToArray(branch, 'b_id'));
        }
      });
      store.dispatch({ type: booksActions.insertBookIds.type, payload: { bIds: preLoadBIds } });
      const categoryIds = keyToArray(result.branches, 'category_id');
      store.dispatch({
        type: categoryActions.insertCategoryIds.type,
        payload: categoryIds,
      });
      return {
        genre: genre.toString(),
        store,
        lazyLoadBIds,
        ...query,
        ...result,
      };
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
