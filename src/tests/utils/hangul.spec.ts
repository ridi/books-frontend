import { isJamo } from 'src/utils/hangul';

describe('isJamo', () => {
  it.each([
    '하',
    '김치',
    'Jeff Buckley',
    '미스터 초벌왕',
  ])('should return false', (str) => {
    expect(isJamo(str)).toBe(false);
  });
  it.each([
    'ㄱ',
    'ㅏ',
    'ㅢ',
    'ㅎ',
  ])('should return true', (str) => {
    expect(isJamo(str)).toBe(true);
  });
  it('should throw an error', () => {
    expect(() => isJamo('')).toThrowError();
  });
});
