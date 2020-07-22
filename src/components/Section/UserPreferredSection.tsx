import { DisplayType, UserPreferredBestseller } from 'src/types/sections';
import SelectionBook from 'src/components/BookSections/SelectionBook';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store/config';
import axios from 'src/utils/axios';
import sentry from 'src/utils/sentry';
import { keyToArray } from 'src/utils/common';
import { booksActions } from 'src/services/books';
import { categoryActions } from 'src/services/category';
import { useRouter } from 'next/router';
import useAccount from 'src/hooks/useAccount';

interface UserPreferredSectionProps {
  items: UserPreferredBestseller[];
  genre: string;
  type: Exclude<DisplayType, 'AiRecommendation'>;
  slug: string;
}

// 이 영역은 사용자 정보를 바탕으로 제공되는데 사용자 정보가 늦게 로드되므로 Fetch 를 따로한다.
const UserPreferredSection: React.FC<UserPreferredSectionProps> = (props) => {
  const loggedUser = useAccount();
  const categoryState = useSelector((store: RootState) => store.categories);

  const dispatch = useDispatch();
  const router = useRouter();
  const { items, type, slug } = props;
  const [sections, setSections] = useState(items || []);
  const genre = (router.query.genre as string) || ('general' as string);
  useEffect(() => {
    const requestUserPreferredBestSeller = async () => {
      try {
        const requestUrl = `${process.env.NEXT_STATIC_STORE_API}/sections/home-${genre}-user-preferred-bestseller/`;
        const result = await axios.get(requestUrl, {
          withCredentials: true,
          timeout: 8000,
        });
        if (result.status === 200) {
          setSections(result.data.items);
          const bIds = keyToArray(result.data.items, 'b_id');
          dispatch({ type: booksActions.insertBookIds.type, payload: { bIds } });
          const categoryIds = keyToArray(result.data.items, 'category_id');
          dispatch({
            type: categoryActions.insertCategoryIds.type,
            payload: categoryIds,
          });
        }
      } catch (error) {
        sentry.captureException(error);
      }
    };

    if (sections.length === 0 && loggedUser && genre) {
      if (
        [
          'bl',
          'bl-serial',
          'bl-novel-serial',
          'bl-webtoon-serial',
          'bl-comics',
          'fantasy',
          'fantasy-serial',
          'comics',
          'romance',
          'romance-serial',
          'general',
        ].includes(genre)
      ) {
        requestUserPreferredBestSeller();
      }
    }
  }, [sections, router, loggedUser, genre]);
  return (
    <>
      {(sections).map((item, index) => {
        if (!item.books) {
          return null;
        }

        const categoryName = categoryState.items[item.category_id ?? 0]?.name
          ? `${categoryState.items[item.category_id ?? 0]?.name} 베스트셀러`
          : '베스트셀러';
        return (
          <SelectionBook
            slug={`${slug}-category-${item.category_id}`}
            items={item.books}
            title={categoryName}
            categoryId={item.category_id}
            genre={genre}
            extra={{
              detail_link: `/category/bestsellers/${item.category_id}`,
            }}
            key={index}
            type={type}
          />
        );
      })}
    </>
  );
};

export default UserPreferredSection;
