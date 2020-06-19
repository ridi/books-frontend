import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import React from 'react';

import { RIDITheme } from 'src/styles';
import { orBelow, BreakPoint } from 'src/utils/mediaQuery';

const WrapperForm = styled.form<{ focused?: boolean }>`
  flex: 1;
  max-width: 340px;
  order: 2;
  z-index: 10;
  ${(props) => orBelow(BreakPoint.LG, `
    flex: none;
    width: 100%;
    max-width: 100%;
    order: 3;
    ${props.focused && `
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
    `}
  `)}
`;

const SearchBoxWrapper = styled.div<{ focused?: boolean }, RIDITheme>`
  ${(props) => props.focused && orBelow(BreakPoint.LG, `
    padding: 6px;
    background-color: ${props.theme.primaryColor};
  `)}
`;

const SearchBoxShape = styled.div`
  background: white;
  border-radius: 3px;

  display: flex;
  align-items: center;
`;

const SearchBox = styled.input`
  flex: 1;
  padding: 10px 0;
  font-size: 16px;
`;

export default function InstantSearch() {
  const router = useRouter();
  const [keyword, setKeyword] = React.useState(String(router.query.q || ''));
  const [isFocused, setFocused] = React.useState(false);
  const handleKeywordChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);
  const handleFocus = React.useCallback(() => setFocused(true), []);
  const handleBlur = React.useCallback(() => setFocused(false), []);
  return (
    <WrapperForm focused={isFocused} onFocus={handleFocus} onBlur={handleBlur}>
      <SearchBoxWrapper focused={isFocused}>
        <SearchBoxShape>
          <SearchBox onChange={handleKeywordChange} value={keyword} />
        </SearchBoxShape>
      </SearchBoxWrapper>
    </WrapperForm>
  );
}
