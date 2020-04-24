import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React from 'react';
import PaperIcon from 'src/svgs/Paper.svg';
import NewIcon from 'src/svgs/New_1.svg';
import { RIDITheme } from 'src/styles';
import { BreakPoint, greaterThanOrEqualTo, orBelow } from 'src/utils/mediaQuery';
import * as colors from '@ridi/colors';

import ArrowV from 'src/svgs/ArrowV.svg';

const ridiMeta = {
  serviceCenterNumber: '1644-0331',
  address: '서울시 강남구 역삼동 702-28 어반벤치빌딩 10층(테헤란로 325)',
  info:
    '리디 (주) 대표 배기식 사업자등록번호 120-87-27435 통신판매업신고 제 2009-서울강남 35-02139호',
};

const sectionStyle = (theme: RIDITheme) => css`
  width: 100%;
  color: ${theme.footerTextColor};
  hr {
    display: none;
  }
  background: ${theme.secondaryColor};
`;

const FooterWrapper = styled.footer`
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 16px;
  transition: all 0.3s;
  max-height: 700px;
`;

const FlexBox = styled.div`
  display: flex;
  align-items: start;
  justify-content: unset;
  ${orBelow(
    BreakPoint.LG,
    `
      flex-direction: column;
      justify-content: flex-start;
      align-items: unset;
    `,
  )};
`;

const StyledAnchor = styled.a`
  word-break: keep-all;
  :hover {
    opacity: 0.7;
  }
`;

const contactListCSS = (theme: RIDITheme) => css`
  //min-width: 192px;
  display: flex;
  align-items: center;
  li {
    word-break: keep-all;
    span {
      word-break: keep-all;
      white-space: nowrap;
    }
    :not(:last-of-type) {
      ::after {
        position: relative;
        font-size: 11px;
        content: ' ';
        top: -3px;
        margin: 0 10px;
        border-left: 1px solid ${theme.verticalRuleColor};
      }
    }
  }
  margin-right: 80px;

  ${orBelow(
    BreakPoint.LG,
    'margin-bottom: 28px;',
  )}
`;

const serviceNumber = css`
  word-break: keep-all;
  font-size: 20px;
  font-weight: bold;
  color: white;
`;

const serviceCenter = css`
  ${serviceNumber};
  line-height: 1;
  word-break: keep-all;
`;

const FooterMenuWrapper = styled.ul`
  display: flex;
  padding-top: 6px;
  margin-bottom: 48px;
  ${orBelow(
    BreakPoint.LG,
    `
      margin-bottom: 24px;
      transition: all 0.3s;
      max-height: 230px;
    `,
  )};
`;

const FooterMenu = styled.ul`
  position: relative;
  & {
    margin-right: 16px;
  }
  li {
    width: 140px;
    :not(:last-of-type) {
      margin-bottom: 16px;
    }
  }
`;
const FooterMenuLabel = styled.span`
  font-size: 14px;
`;

const hiddenMenu = css`
  ${orBelow(
    BreakPoint.LG,
    'display: none;',
  )};
`;

const InformationWrapper = styled.address`
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
  ${orBelow(
    BreakPoint.LG,
    `
      flex-direction: column;
      margin-bottom: 16px;
    `,
  )};
`;

const address = css`
  display: block;
  font-size: 11px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.82;
  color: #7e8992;
`;

const MiscWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  ${orBelow(
    BreakPoint.LG,
    `
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
    `,
  )}
  li {
    flex-shrink: 0;
  }
`;

const Copyright = styled.p`
  width: 83px;
  height: 17px;
  font-size: 14px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  color: #7e8992;
  margin-right: 24px;
  ${orBelow(
    BreakPoint.LG,
    'margin-bottom: 16px;',
  )};
`;

const menuListCSS = (theme: RIDITheme) => css`
  display: flex;
  li {
    :not(:last-of-type) {
      ::after {
        position: relative;
        font-size: 10px;
        content: '|';
        top: -0.3px;
        color: ${theme.verticalRuleColor};
        margin: 0 5.5px;
      }
    }
  }
`;

const MiscMenuLabel = styled.span`
  width: 41px;
  height: 20px;
  font-size: 11px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.82;
  color: #7e8992;
`;

const paperIcon = css`
  fill: white;
`;

const Footer: React.FC<{}> = () => (
  <section id="new_footer" css={sectionStyle}>
    <FooterWrapper>
      <FlexBox
        css={css`
          transition: height 0.3s ease-in-out;
        `}
      >
        <ul css={contactListCSS}>
          <li>
            <StyledAnchor
              href="https://help.ridibooks.com/hc/ko"
              target="_blank"
              rel="noopener"
            >
              <span css={serviceCenter}>고객센터</span>
            </StyledAnchor>
          </li>
          <li>
            <StyledAnchor
              href="https://help.ridibooks.com/hc/ko/sections/360002578234"
              target="_blank"
              rel="noopener"
            >
              <span css={serviceCenter}>공지사항</span>
            </StyledAnchor>
          </li>
        </ul>
        <FooterMenuWrapper>
          <li>
            <FooterMenu>
              <li>
                <StyledAnchor
                  href="https://paper.ridibooks.com"
                  aria-label="리디 페이퍼"
                >
                  <PaperIcon css={paperIcon} />
                </StyledAnchor>
              </li>
              <li>
                <StyledAnchor href="https://ridibooks.com/support/partner-card">
                  <FooterMenuLabel>제휴카드</FooterMenuLabel>
                </StyledAnchor>
              </li>
              <li>
                <StyledAnchor href="https://ridibooks.com/support/app/download">
                  <FooterMenuLabel>뷰어 다운로드</FooterMenuLabel>
                </StyledAnchor>
              </li>
              <li>
                <StyledAnchor href="https://ridibooks.com/order/checkout/cash">
                  <FooterMenuLabel>리디캐시 충전</FooterMenuLabel>
                </StyledAnchor>
              </li>
            </FooterMenu>
          </li>
          <li css={hiddenMenu}>
            <FooterMenu>
              <li>
                <StyledAnchor
                  target="_blank"
                  rel="noopener"
                  href="https://help.ridibooks.com/hc/ko/articles/360046896553"
                >
                  <FooterMenuLabel>콘텐츠 제공 문의</FooterMenuLabel>
                </StyledAnchor>
              </li>
              <li>
                <StyledAnchor
                  href="https://cp.ridibooks.com"
                  target="_blank"
                  rel="noopener"
                >
                  <FooterMenuLabel>CP 사이트</FooterMenuLabel>
                </StyledAnchor>
              </li>
              <li>
                <StyledAnchor href="mailto:biz@ridi.com">
                  <FooterMenuLabel>사업 제휴 문의</FooterMenuLabel>
                </StyledAnchor>
              </li>
              <li>
                <StyledAnchor
                  href="https://help.ridibooks.com/hc/ko/articles/360026484174"
                  target="_blank"
                  rel="noopener"
                >
                  <FooterMenuLabel>페이퍼 대량구매 안내</FooterMenuLabel>
                </StyledAnchor>
              </li>
            </FooterMenu>
          </li>
          <li css={hiddenMenu}>
            <FooterMenu>
              <li>
                <StyledAnchor
                  href="https://www.facebook.com/ridibooks"
                  target="_blank"
                  rel="noopener"
                >
                  <FooterMenuLabel>페이스북</FooterMenuLabel>
                </StyledAnchor>
              </li>
              <li>
                <StyledAnchor
                  href="https://instagram.com/ridipaper/"
                  target="_blank"
                  rel="noopener"
                >
                  <FooterMenuLabel>인스타그램</FooterMenuLabel>
                </StyledAnchor>
              </li>
            </FooterMenu>
          </li>
          <li>
            <FooterMenu>
              <li
                css={css`
                  height: 15.5px;
                `}
              >
                <StyledAnchor
                  href="https://www.ridicorp.com/"
                  target="_blank"
                  rel="noopener"
                >
                  <FooterMenuLabel>회사 소개</FooterMenuLabel>
                </StyledAnchor>
              </li>
              <li
                css={css`
                  height: 17px;
                `}
              >
                <StyledAnchor
                  href="https://www.ridicorp.com/career/"
                  target="_blank"
                  rel="noopener"
                >
                  <FooterMenuLabel>인재 채용</FooterMenuLabel>
                  <NewIcon
                    css={css`
                      position: relative;
                      top: 2px;
                      margin-left: 6px;
                      fill: #509deb;
                      width: 14px;
                      height: 14px;
                    `}
                  />
                </StyledAnchor>
              </li>
              <li
                css={css`
                  position: relative;
                  left: 0.3px;
                  top: 1px;
                  display: block;
                  height: 100%;
                  transition: height 0.3s ease-in-out;
                  ${greaterThanOrEqualTo(
                  BreakPoint.LG + 1,
                  'display: none;',
                )};
                `}
              >
                <input
                  type="checkbox"
                  id="toggle"
                  name="toggle"
                  css={css`
                    &[type='checkbox'] {
                      height: 0;
                      width: 0;
                      visibility: hidden;
                    }
                    transition: all 0.3s ease-in-out;

                    font-size: 14px;
                    position: relative;
                    left: 1px;
                    display: flex;
                    align-items: center;
                    :hover {
                      opacity: 0.7;
                    }
                    &:checked + label {
                      & {
                        opacity: 0;
                      }
                      ul {
                        visibility: visible;
                      }
                    }
                    &:checked + label + ul {
                      opacity: 1;
                      visibility: visible;
                      height: 95px;
                    }
                  `}
                />
                <label
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
                  htmlFor="toggle"
                >
                  <span
                    css={css`
                      color: white;
                      font-size: 14px;
                    `}
                  >
                    더 보기
                  </span>
                  <ArrowV
                    css={css`
                      transform: scale(0.7) rotate(90deg);
                      fill: white;
                      margin-left: 2.5px;
                    `}
                  />
                </label>
                <FooterMenu
                  css={css`
                    left: 0;
                    top: -17px;
                    position: relative;
                    visibility: hidden;
                    transition: all 0.3s ease-in-out;
                    max-height: 140px;
                    height: 0;
                    opacity: 0;
                    a {
                      :hover {
                        opacity: 0.7;
                      }
                    }
                  `}
                >
                  <li>
                    <StyledAnchor
                      target="_blank"
                      rel="noopener"
                      href="https://help.ridibooks.com/hc/ko/articles/360046896553"
                    >
                      <FooterMenuLabel>콘텐츠 제공 문의</FooterMenuLabel>
                    </StyledAnchor>
                  </li>
                  <li>
                    <StyledAnchor
                      href="https://cp.ridibooks.com"
                      target="_blank"
                      rel="noopener"
                    >
                      <FooterMenuLabel>CP 사이트</FooterMenuLabel>
                    </StyledAnchor>
                  </li>
                  <li>
                    <a href="mailto:biz@ridi.com">
                      <FooterMenuLabel>사업 제휴 문의</FooterMenuLabel>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://help.ridibooks.com/hc/ko/articles/360026484174"
                      target="_blank"
                      rel="noopener"
                    >
                      <FooterMenuLabel>페이퍼 대량구매 안내</FooterMenuLabel>
                    </a>
                  </li>
                </FooterMenu>
              </li>
            </FooterMenu>
          </li>
        </FooterMenuWrapper>
      </FlexBox>

      <InformationWrapper>
        <span css={address}>{ridiMeta.address}</span>
        <span
          css={css`
            position: relative;
            line-height: 10px;
            height: 10px;
            top: 5px;
            margin: 0 6px 0 8px;
            border-left: 1px solid ${colors.slateGray70};
            ${orBelow(
            BreakPoint.LG,
            'display: none;',
          )};
          `}
        />
        <span css={address}>{ridiMeta.info}</span>
      </InformationWrapper>
      <MiscWrapper>
        <Copyright className="museo">© RIDI Corp.</Copyright>
        <ul css={menuListCSS}>
          <li>
            <StyledAnchor
              href="https://policy.ridi.com/legal/terms"
              target="_blank"
              rel="noopener"
            >
              <MiscMenuLabel>이용 약관</MiscMenuLabel>
            </StyledAnchor>
          </li>
          <li>
            <StyledAnchor
              href="https://policy.ridi.com/legal/privacy"
              target="_blank"
              rel="noopener"
            >
              <MiscMenuLabel
                css={css`
                  font-weight: bold;
                `}
              >
                개인 정보 처리 방침
              </MiscMenuLabel>
            </StyledAnchor>
          </li>
          <li>
            <StyledAnchor
              href="https://policy.ridi.com/legal/youth"
              target="_blank"
              rel="noopener"
            >
              <MiscMenuLabel>청소년 보호 정책</MiscMenuLabel>
            </StyledAnchor>
          </li>
          <li>
            <StyledAnchor
              href="http://ftc.go.kr/info/bizinfo/communicationList.jsp"
              target="_blank"
              rel="noopener"
            >
              <MiscMenuLabel>사업자 정보 확인</MiscMenuLabel>
            </StyledAnchor>
          </li>
        </ul>
      </MiscWrapper>
    </FooterWrapper>
  </section>
);

export default Footer;
