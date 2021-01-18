import { css } from '@emotion/core';
import React from 'react';
import ArrowV from 'src/svgs/ArrowV.svg';
import NewIcon from 'src/svgs/New_1.svg';
import PaperIcon from 'src/svgs/Paper.svg';
import { BreakPoint, greaterThanOrEqualTo } from 'src/utils/mediaQuery';
import * as styles from './styles';

const {
  StyledAnchor, FooterMenuWrapper, FooterMenuSection, FooterMenuLabel,
} = styles;

export const FooterMenu = () => (
  <FooterMenuWrapper>
    <li>
      <FooterMenuSection>
        <li>
          <StyledAnchor
            href="https://paper.ridibooks.com"
            aria-label="리디 페이퍼"
          >
            <PaperIcon css={styles.paperIcon} />
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
      </FooterMenuSection>
    </li>
    <li css={styles.hiddenMenu}>
      <FooterMenuSection>
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
            href="https://help.ridibooks.com/hc/ko/articles/360058140713-RIDI-Biz-%ED%98%91%EC%97%85-%EB%AC%B8%EC%9D%98"
            target="_blank"
            rel="noopener"
          >
            <FooterMenuLabel>페이퍼 대량구매 안내</FooterMenuLabel>
          </StyledAnchor>
        </li>
      </FooterMenuSection>
    </li>
    <li css={styles.hiddenMenu}>
      <FooterMenuSection>
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
      </FooterMenuSection>
    </li>
    <li>
      <FooterMenuSection>
        <li css={css`height: 15.5px;`}>
          <StyledAnchor
            href="https://www.ridicorp.com/"
            target="_blank"
            rel="noopener"
          >
            <FooterMenuLabel>회사 소개</FooterMenuLabel>
          </StyledAnchor>
        </li>
        <li css={css`height: 17px;`}>
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
          <FooterMenuSection
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
                href="https://help.ridibooks.com/hc/ko/articles/360058140713-RIDI-Biz-%ED%98%91%EC%97%85-%EB%AC%B8%EC%9D%98"
                target="_blank"
                rel="noopener"
              >
                <FooterMenuLabel>페이퍼 대량구매 안내</FooterMenuLabel>
              </a>
            </li>
          </FooterMenuSection>
        </li>
      </FooterMenuSection>
    </li>
  </FooterMenuWrapper>
);
