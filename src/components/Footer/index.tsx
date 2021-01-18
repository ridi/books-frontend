import { css } from '@emotion/core';
import React from 'react';
import { BusinessInformation } from 'src/components/Footer/BusinessInformation';
import { FooterMenu } from 'src/components/Footer/FooterMenu';
import * as styles from './styles';


const {
  FlexBox, StyledAnchor, FooterWrapper,
  MiscWrapper, Copyright, MiscMenuLabel,
} = styles;

const Footer = () => (
  <section id="new_footer" css={styles.sectionStyle}>
    <FooterWrapper>
      <FlexBox
        css={css`
          transition: height 0.3s ease-in-out;
        `}
      >
        <ul css={styles.contactListCSS}>
          <li>
            <StyledAnchor
              href="https://help.ridibooks.com/hc/ko"
              target="_blank"
              rel="noopener"
            >
              <span css={styles.serviceCenter}>고객센터</span>
            </StyledAnchor>
          </li>
          <li>
            <StyledAnchor
              href="https://help.ridibooks.com/hc/ko/sections/360002578234"
              target="_blank"
              rel="noopener"
            >
              <span css={styles.serviceCenter}>공지사항</span>
            </StyledAnchor>
          </li>
        </ul>
        <FooterMenu />
      </FlexBox>
      <BusinessInformation />
      <MiscWrapper>
        <Copyright className="museo">© RIDI Corp.</Copyright>
        <ul css={styles.menuListCSS}>
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
