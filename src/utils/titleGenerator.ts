// temporary use

const genres: {[index: string]: string} = {
  fantasy: '판타지 단행본',
  'fantasy-serial': '판타지 연재',
  bl: 'BL 소설 단행본',
  'bl-serial': 'BL 연재',
  'bl-novel-serial': 'BL 웹소설',
  'bl-webtoon-serial': 'BL 웹툰',
  'bl-comics': 'BL 만화 단행본',
  romance: '로맨스 단행본',
  'romance-serial': '로맨스 연재',
  comics: '만화',
  general: '일반도서',
};

export default (genre: string) => {
  if (genre === '' || genre === 'comics') {
    return genres[genre];
  }
  return `${genres[genre]}`;
};
