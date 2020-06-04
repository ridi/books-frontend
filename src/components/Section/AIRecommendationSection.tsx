import { AIRecommendationBook, SectionExtra } from 'src/types/sections';
import SelectionBook from 'src/components/BookSections/SelectionBook';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios, { CancelToken, OAuthRequestType } from 'src/utils/axios';
import sentry from 'src/utils/sentry';
import { booksActions } from 'src/services/books';
import { useRouter } from 'next/router';
import useAccount from 'src/hooks/useAccount';

import * as BookApi from 'src/types/book';
import { newGenreNameToOldGenreName } from 'src/utils/common';

interface AiRecommendationSectionProps {
  genre: string;
  type: 'AiRecommendation';
  extra: SectionExtra;
  slug: string;
}

const AiRecommendationSection: React.FC<AiRecommendationSectionProps> = (props) => {
  const loggedUser = useAccount();
  const dispatch = useDispatch();
  const {
    type, extra, slug,
  } = props;
  const [aiItems, setSections] = useState<AIRecommendationBook[] | null>(null);
  const [isRequestError, setIsRequestError] = useState(false);

  const router = useRouter();
  const genre = (router.query.genre as string) || 'general';

  const convertedGenreName = newGenreNameToOldGenreName[genre];
  useEffect(() => {
    const source = CancelToken.source();
    const requestAiRecommendationItems = async () => {
      try {
        // Todo 현재는 single로 받아 1개의 섹션만 표시하는데 곧 3~4개 섹션이 표시될 수 있음
        const requestUrl = `/store/personalized-sections/single?genre=${convertedGenreName}`;
        const result = await axios.get(requestUrl, {
          baseURL: process.env.NEXT_STATIC_AI_RECOMMENDATION_API,
          withCredentials: true,
          custom: { authorizationRequestType: OAuthRequestType.CHECK },
          timeout: 8000,
          cancelToken: source.token,
        });
        if (result.status < 400 && result.status >= 200) {
          // Todo 추천 API 결과에서 bId 만 올 예정 그 때 다시 변경 배포
          setSections(result.data.books.map((item: BookApi.Book) => ({ b_id: item.id })));
          const bIds = result.data.books.map((book: BookApi.Book) => book.id);
          dispatch({ type: booksActions.insertBookIds.type, payload: { bIds } });
          setIsRequestError(false);
        } else {
          setIsRequestError(true);
        }
      } catch (error) {
        setIsRequestError(true);
        // 추천할 도서가 없으면 404 반환함 에러가 아님
        if (error?.response?.status !== 404) {
          sentry.captureException(error);
        }
      }
    };

    if (!aiItems && loggedUser && !isRequestError) {
      if (
        [
          'bl',
          'bl-serial',
          'fantasy',
          'fantasy-serial',
          'comics',
          'romance',
          'romance-serial',
          'general',
        ].includes(genre)
      ) {
        requestAiRecommendationItems();
      }
    }

    return source.cancel;
  }, [dispatch, genre, router, aiItems, loggedUser, isRequestError]);

  if (!loggedUser || !aiItems || aiItems.length < 1) {
    return null;
  }
  // https://app.asana.com/0/1152363431499050/1153588050414697
  if (aiItems.length < 6) {
    return null;
  }
  if (isRequestError) {
    return null;
  }
  return (
    <SelectionBook
      items={aiItems || []}
      slug={`${slug}-ai-rcmd`}
      title={loggedUser ? `${loggedUser.id} 님을 위한 AI 추천` : 'AI 추천'}
      extra={extra}
      genre={genre}
      type={type}
    />
  );
};

export default AiRecommendationSection;
