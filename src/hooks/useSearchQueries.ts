import { useRouter } from 'next/router';
import React from 'react';
import Cookies from 'universal-cookie';

export interface Query {
  q: string;
  isAdultExclude: boolean;
  page: number;
  categoryId: string;
  order: string;
  isSerial: boolean;
  isRental: boolean;
  isRidiselect: boolean;
}

interface SearchQueriesHook {
  query: Query;
  updateQuery(newQuery: Partial<Query>): void;
  calculateUpdateQuery(newQuery: Partial<Query>): string;
}

function extractQuery(query: Record<string, string | string[]>): Query {
  const cookies = new Cookies();
  const cookieAdultExclude = cookies.get('adult_exclude');
  const {
    q = '',
    adult_exclude = cookieAdultExclude,
    page = '1',
    category_id = '0',
    order = 'score',
    serial = 'n',
    rental = 'n',
    ridi_select = 'n',
  } = query;
  return {
    q: String(q),
    isAdultExclude: adult_exclude === 'y',
    page: parseInt(String(page), 10) || 1,
    categoryId: String(category_id),
    order: String(order),
    isSerial: serial === 'y',
    isRental: rental === 'y',
    isRidiselect: ridi_select === 'y',
  };
}

export function useSearchQueries(): SearchQueriesHook {
  const router = useRouter();
  const [query, setQuery] = React.useState(() => extractQuery(router.query));
  const calculateUpdateQuery = React.useCallback((newQuery: Partial<Query>) => {
    const mergedQuery = { ...query, ...newQuery };
    const searchParams = new URLSearchParams({
      q: mergedQuery.q,
      page: String(mergedQuery.page),
      order: mergedQuery.order,
    });
    if (mergedQuery.categoryId !== '0') {
      searchParams.append('category_id', mergedQuery.categoryId);
    }
    if (mergedQuery.isAdultExclude) {
      searchParams.append('adult_exclude', 'y');
    } else {
      searchParams.append('adult_exclude', 'n');
    }
    if (mergedQuery.isSerial) {
      searchParams.append('serial', 'y');
    }
    if (mergedQuery.isRental) {
      searchParams.append('rental', 'y');
    }
    if (mergedQuery.isRidiselect) {
      searchParams.append('ridi_select', 'y');
    }
    return searchParams.toString();
  }, [query]);
  const updateQuery = React.useCallback((newQuery: Partial<Query>) => {
    const search = calculateUpdateQuery(newQuery);
    router.push(`${router.pathname}?${search}`);
  }, [router, calculateUpdateQuery]);
  const [first, setFirst] = React.useState(true);

  React.useEffect(() => {
    if (first) {
      setFirst(false);
      return;
    }
    setQuery(extractQuery(router.query));
  }, [router.asPath]);

  return {
    query,
    updateQuery,
    calculateUpdateQuery,
  };
}
