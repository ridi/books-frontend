/**
 * 문자열의 첫 문자가 [Hangul Compatibility Jamo][chart] 영역에 속하는지
 * 확인합니다. 이 영역에 속하는 문자는 한글 자음 또는 모음이 혼자 존재합니다.
 *
 * [chart]: https://www.unicode.org/charts/PDF/U3130.pdf
 *
 * @param char 확인하고자 하는 문자열
 * @returns 포함 여부
 * @throws Error 문자열의 길이가 0인 경우
 */
export function isJamo(char: string): boolean {
  const code = char.codePointAt(0);
  if (code == null) {
    throw new Error('Can not get a character');
  }
  return code >= 0x3130 && code < 0x3190;
}
