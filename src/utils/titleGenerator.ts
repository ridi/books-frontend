// temporary use

const genres: {[index: string]: string} = {
  general: '일반도서',
  romance: '로맨스 e북',
  'romance-serial': '로맨스 웹소설',
  fantasy: '판타지 e북',
  'fantasy-serial': '판타지 웹소설',
  comics: '만화',
  webtoon: '웹툰',
  'bl-novel': 'BL 소설 e북',
  'bl-webnovel': 'BL 웹소설',
  'bl-comics': 'BL 만화 e북',
  'bl-webtoon': 'BL 웹툰',
};

export const genreKeys = Object.keys(genres);

export default (genre: string) => genres[genre] || '';
