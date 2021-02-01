import * as R from 'runtypes';
import Sentry from 'src/utils/sentry';

function makeSectionData<Type extends string, Item extends R.Runtype>(type: Type, rItem: Item) {
  return R.Record({
    type: R.Literal(type),
    items: R.Array(rItem),
  });
}

export const RBookRating = R.Record({
  total_rating_count: R.Number,
  buyer_rating_count: R.Number,
  buyer_rating_score: R.Number,
});

export const RBookBase = R.Record({
  type: R.Literal('book'),
  b_id: R.String,
}).And(
  R.Partial({
    order: R.Number,
    rank: R.Number,
    rating: RBookRating,
  }),
);

export const RBookWithOrder = RBookBase.And(
  R.Record({
    order: R.Number,
  }),
);

export const RBookWithRank = RBookBase.And(
  R.Record({
    rank: R.Number,
  }),
);

export const RBookWithRating = RBookBase.And(
  R.Record({
    rating: RBookRating,
  }),
);

export const RBookWithRankAndRating = RBookBase.And(
  R.Record({
    rank: R.Number,
    rating: RBookRating,
  }),
);

export const RBookItem = R.Union(
  RBookBase,
  RBookWithOrder,
  RBookWithRank,
  RBookWithRating,
  RBookWithRankAndRating,
);

export const RQuickMenuItem = R.Record({
  id: R.Number,
  name: R.String,
  url: R.String,
  icon: R.String,
  bg_color: R.String,
  order: R.Number,
});
export const RQuickMenu = makeSectionData('HomeQuickMenu', RQuickMenuItem);

export const RCarouselBannerItem = R.Record({
  id: R.Number,
  title: R.String,
  main_image_url: R.String,
  landing_url: R.String,
  order: R.Number,
  is_badge_available: R.Boolean,
  badge: R.Union(R.Null, R.Literal('END_IN_3DAY'), R.Literal('END_TODAY')),
});
export const RCarouselBanner = makeSectionData('HomeCarouselBanner', RCarouselBannerItem);

export const REventBannerItem = R.Record({
  id: R.Number,
  title: R.String,
  order: R.Number,
  image_url: R.String,
  url: R.String,
});
export const REventBanner = makeSectionData('HomeEventBanner', REventBannerItem);
export const REventBannerTop = makeSectionData('HomeEventBannerTop', REventBannerItem);
export const REventBannerMiddle = makeSectionData('HomeEventBannerMiddle', REventBannerItem);
export const REventBannerBottom = makeSectionData('HomeEventBannerBottom', REventBannerItem);

export const RMdSelectionItem = R.Record({
  id: R.Number,
  title: R.String,
  order: R.Number,
  books: R.Array(RBookWithRating),
});
export const RMdSelection = makeSectionData('HomeMdSelection', RMdSelectionItem);

export const RRecommendedBook = makeSectionData('RecommendedBook', RBookWithOrder);

export const RBestSeller = makeSectionData('BestSeller', RBookWithRankAndRating).And(
  R.Record({
    extra: R.Partial({
      detail_link: R.String,
    }),
    item_metadata: R.Record({
      period: R.String,
    }),
  }),
);

export const RReadingBooksRanking = makeSectionData('ReadingBooksRanking', RBookBase);

export const RHotRelease = makeSectionData('HotRelease', RBookWithOrder).And(
  R.Record({
    extra: R.Partial({
      use_select_api: R.Boolean,
    }),
  }),
);

export const RNewSerialBook = makeSectionData('NewSerialBook', RBookBase).And(
  R.Record({
    extra: R.Partial({
      detail_link: R.String,
    }),
  }),
);

export const RTodayNewBook = makeSectionData('TodayNewBook', RBookBase).And(
  R.Record({
    extra: R.Partial({
      detail_link: R.String,
    }),
  }),
);

export const RTodayRecommendationItem = RBookWithOrder.And(
  R.Record({
    sentence: R.String,
  }),
);
export const RTodayRecommendation = makeSectionData('TodayRecommendation', RTodayRecommendationItem);

export const RUserPreferredBestsellerItem = R.Record({
  category_id: R.Number,
  books: R.Array(RBookWithRank),
});
export const RUserPreferredBestseller = makeSectionData('UserPreferredBestseller', RUserPreferredBestsellerItem).And(
  R.Record({
    extra: R.Partial({
      is_placeholder: R.Literal(true),
    }),
  }),
);

export const RWaitFree = makeSectionData('WaitFree', RBookWithOrder).And(
  R.Record({
    extra: R.Partial({
      detail_link: R.String,
    }),
  }),
);

export const RAiRecommendationItem = RBookBase;

export const RAiRecommendation = makeSectionData('AiRecommendation', RAiRecommendationItem).And(
  R.Record({
    extra: R.Partial({
      detail_link: R.String,
      is_placeholder: R.Literal(true),
    }),
  }),
);

export const RKeywordFinder = makeSectionData('KeywordFinder', R.Never).And(
  R.Record({
    extra: R.Partial({
      is_placeholder: R.Literal(true),
    }),
  }),
);

export const RRecommendedNewBook = makeSectionData('RecommendedNewBook', RBookWithOrder);

export const RSectionData = R.Union(
  RQuickMenu,
  RCarouselBanner,
  REventBanner,
  RMdSelection,
  RRecommendedBook,
  RBestSeller,
  RReadingBooksRanking,
  RHotRelease,
  RNewSerialBook,
  RTodayNewBook,
  RTodayRecommendation,
  RUserPreferredBestseller,
  RWaitFree,
  RAiRecommendation,
  RKeywordFinder,
  RRecommendedNewBook,
);

export const RSection = R.Record({
  slug: R.String,
  title: R.String,
}).And(
  R.Partial({
    total: R.Number,
    next: R.String.Or(R.Null),
    previous: R.String.Or(R.Null),
    extra: R.Partial({
      use_select_api: R.Boolean,
      is_placeholder: R.Boolean,
      detail_link: R.String,
    }),
  }),
).And(RSectionData);

export const RPage = R.Record({
  slug: R.String,
  type: R.Union(R.Literal('Page')),
  title: R.String,
  branches: R.Array(RSection),
});

type BookBase = R.Static<typeof RBookBase>;
type BookWithOrder = R.Static<typeof RBookWithOrder>;

export type BookItem = R.Static<typeof RBookItem>;
export type BookWithRank = R.Static<typeof RBookWithRank>;
export type BookWithRating = R.Static<typeof RBookWithRating>;
export type BookWithRankAndRating = R.Static<typeof RBookWithRankAndRating>;
export type StarRating = R.Static<typeof RBookRating>;
export type QuickMenu = R.Static<typeof RQuickMenuItem>;
export type CarouselBanner = R.Static<typeof RCarouselBannerItem>;
export type TopBanner = CarouselBanner;
export type EventBanner = R.Static<typeof REventBannerItem>;
export type MdSelection = R.Static<typeof RMdSelectionItem>;
export type RecommendedBook = BookWithOrder;
export type BestSeller = BookWithRankAndRating;
export type ReadingBooksRanking = BookBase;
export type ReadingRanking = ReadingBooksRanking;
export type HotRelease = BookWithOrder;
export type NewSerialBook = BookBase;
export type TodayNewBook = BookBase;
export type TodayRecommendation = R.Static<typeof RTodayRecommendationItem>;
export type UserPreferredBestseller = R.Static<typeof RUserPreferredBestsellerItem>;
export type WaitFree = BookWithOrder;
export type AiRecommendation = R.Static<typeof RAiRecommendationItem>;
export type AIRecommendationBook = AiRecommendation;
export type RecommendedNewBook = BookWithOrder;
export type Section = R.Static<typeof RSection>;
export type SectionExtra = Section['extra'];
export type Page = R.Static<typeof RPage>;
export type DisplayType = Section['type'];

export function checkPage(data: any): Page {
  try {
    return RPage.check(data);
  } catch (e) {
    // FIXME add additional info
    Sentry.captureException(e);
    return data as Page;
  }
}
