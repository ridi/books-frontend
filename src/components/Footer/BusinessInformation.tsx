import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { RIDITheme } from 'src/styles';
import ArrowV from 'src/svgs/ArrowV.svg';
import { BreakPoint, greaterThanOrEqualTo, orBelow } from 'src/utils/mediaQuery';

export const InformationWrapper = styled.div`
  margin-bottom: 12px;
  ${orBelow(
    BreakPoint.LG,
    `
      flex-direction: column;
      margin-bottom: 16px;
      align-items: flex-start;
      justify-content: center;
    `,
  )};
  li {
    flex-shrink: 0;
  }
`;

export const MiscMenuLabel = styled.span`
  width: 41px;
  height: 20px;
  font-size: 10px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.82;
  color: #7e8992;
`;

export const MiscMenuNewLabel = styled(MiscMenuLabel)`
  ${orBelow(
    BreakPoint.LG,
    'margin-bottom: 16px;',
  )};
`;

export const InformationMore = styled.div`
  display: block;
  position: relative;
  height: 17px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  font-size: 12px;
  line-height: 20px;
  color: #808991;
  margin-right: 24px;
  margin-bottom: 10px;
  ${orBelow(
    BreakPoint.LG,
    'margin-bottom: 16px;',
  )};
`;

export const InfoItem = styled.div`
  display: inline-block;
`;

const contentCSS = `
  position: relative;
  font-size: 10px;
  content: '|';
  top: -0.3px;
  margin: 0 5.5px;
`;

export const InfoList = styled.div`
  ${InfoItem} {
    display: inline-block;
    ::after, ::before {
      color: ${(props: { theme: RIDITheme }) => props.theme.verticalRuleColor};
    }

    ${orBelow(
    BreakPoint.LG,
    `
        :not(:nth-of-type(even)) {
          ::after {
            ${contentCSS}
          }
        }
      `,
  )};
    ${greaterThanOrEqualTo(BreakPoint.LG + 1, `
      :not(:nth-of-type(odd)) {
        ::before {
          ${contentCSS}
        }
      }
    `)};
`;

export const ListWrap = styled.div`
  display: inline-block;
  ${orBelow(
    BreakPoint.LG,
    'display: block;',
  )};
`;

export const BusinessInformation = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <InformationWrapper>
      <InformationMore
        css={css`
        display: flex;
        align-items: center;
        position: relative;
        transition: opacity 0.3s ease-in-out;
        cursor: pointer;
        :hover {
          opacity: 0.7;
        }
      `}
        onClick={() => setOpen(!isOpen)}
      >
        리디(주) 사업자 정보
        <ArrowV
          css={css`
            fill: #808991;
            transform: scale(0.5) rotate(${isOpen ? '270deg' : '90deg'});
            margin-left: 4px;
          `}
        />
      </InformationMore>
      {isOpen && (
        <>
          <InfoList>
            <ListWrap>
              <InfoItem><MiscMenuLabel>대표자 배기식</MiscMenuLabel></InfoItem>
              <InfoItem><MiscMenuLabel>사업자 등록번호 120-87-27435</MiscMenuLabel></InfoItem>
            </ListWrap>
            <InfoItem><MiscMenuNewLabel>통신판매업 신고번호 제 2009-서울강남 35-02139호</MiscMenuNewLabel></InfoItem>
          </InfoList>
          <InfoList>
            <ListWrap>
              <InfoItem><MiscMenuLabel>이메일 help@ridi.com</MiscMenuLabel></InfoItem>
              <InfoItem><MiscMenuLabel>대표전화 1644-0331</MiscMenuLabel></InfoItem>
            </ListWrap>
            <InfoItem><MiscMenuNewLabel>주소 서울시 강남구 역삼동 702-28 어반벤치빌딩 10층(테헤란로 325)</MiscMenuNewLabel></InfoItem>
          </InfoList>
        </>
      )}
    </InformationWrapper>
  );
};
