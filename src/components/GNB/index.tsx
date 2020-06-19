import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { RIDITheme } from 'src/styles/themes';
import { Button } from 'src/components/Button';
import { InstantSearch } from 'src/components/Search';
import { MainTab } from 'src/components/Tabs';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { LoggedUser } from 'src/types/account';
import { useRouter } from 'next/router';
import HomeLink from 'src/components/GNB/HomeLink';
import DoublePointIcon from 'src/svgs/DoublePoint.svg';
import CashIcon from 'src/svgs/Cash.svg';
import pRetry from 'p-retry';
import axios, { CancelToken, wrapCatchCancel } from 'src/utils/axios';
import sentry from 'src/utils/sentry';
import { RIDIBOOKS_LOGO_URL, RIDISELECT_LOGO_URL } from 'src/constants/icons';
import useAccount from 'src/hooks/useAccount';

const GNBWrapper = styled.div<{}, RIDITheme>`
  width: 100%;
  background-color: ${(props: { theme: RIDITheme }) => props.theme.primaryColor};
`;

const Header = styled.header`
  max-width: 1000px;
  margin: 0 auto;
`;

const Navigation = styled.nav`
  box-sizing: border-box;
  padding: 16px 16px 24px 20px;
  display: flex;
  flex-direction: column;
  ${orBelow(
    BreakPoint.LG,
    'padding: 9px 10px;',
  )};
`;

const LogoWrapper = styled.ul`
  min-height: 30px;
  margin-right: -2.5px;
  flex: none;
  ${orBelow(
    BreakPoint.LG,
    `
      height: 30px;
      margin-right: 0;
    `,
  )};
  order: 1;
  margin-bottom: 0;
  display: inline-flex;
  li {
    display: inline-flex;
    align-items: center;

    ::after {
      position: relative;
      font-size: 14px;
      content: '|';
      color: white;
      opacity: 0.4;
      margin: 0 8.5px 0 10px;

      ${orBelow(BreakPoint.LG, 'margin: 0 6px 0 5px; font-size: 12px;')}
    }
    :last-of-type {
      ::after {
        content: '';
      }
    }
  }
`;

const RidibooksLogo = styled.img<{}, RIDITheme>`
  filter: ${(props) => props.theme.logoFilter};
  width: 103px;
  height: 16px;
  fill: white;
  :hover {
    opacity: 0.8;
  }
  ${orBelow(
    BreakPoint.LG,
    `
      width: 88px;
      height: 14px;
      :hover {
        opacity: 1;
      }
      :active {
        opacity: 0.7;
      }
    `,
  )};
`;

const RidiSelectLogo = styled.img<{}, RIDITheme>`
  filter: ${(props) => props.theme.logoFilter};
  fill: white;
  opacity: 0.6;
  width: 87.5px;
  height: 14px;

  ${orBelow(
    BreakPoint.LG,
    `
      width: 73px;
      height: 12px;
    `,
  )};
  :hover {
    opacity: 0.8;
  }
`;

const ButtonWrapper = styled.ul`
  margin-left: auto;
  display: flex;
  flex: none;
  order: 3;
  ${orBelow(
    BreakPoint.LG,
    `
      right: 10px;
      order: 2;
      position: absolute;
    `,
  )};

  li {
    :not(:last-of-type) {
      margin-right: 6px;

      ${orBelow(
    BreakPoint.LG,
    'margin-right: 3px;',
  )};
    }
  }
`;

const LogoSearchBoxArea = styled.div`
  display: flex;
  flex-direction: row;
  ${orBelow(BreakPoint.LG, 'flex-wrap: wrap;')}
`;

interface GNBButtonsProps {
  loggedUser: null | LoggedUser;
  isPartialsLogin?: 'true' | 'false';
  loginPath: string;
  signUpPath: string;
  cashOrderPath: string;
}
const GNBButtons: React.FC<GNBButtonsProps> = (props) => {
  const {
    loggedUser,
    isPartialsLogin,
    loginPath,
    signUpPath,
    cashOrderPath,
  } = props;

  const [eventStatus, setEventStatus] = useState<{
    double_point: boolean;
    fifteen_night: boolean;
  }>({
    double_point: false,
    fifteen_night: false,
  });

  const route = useRouter();
  useEffect(() => {
    const source = CancelToken.source();

    const requestRidiEventStatus = async () => {
      try {
        const cartUrl = `${process.env.NEXT_STATIC_LEGACY_STORE_API_HOST}/api/schedule/events`;
        const result = await pRetry(
          () => wrapCatchCancel(axios.get)(cartUrl, {
            withCredentials: true,
            cancelToken: source.token,
          }),
          {
            retries: 2,
          },
        );
        if (result.status === 200) {
          setEventStatus(result.data);
        }
      } catch (error) {
        if (error.message === 'Cancel') {
          return;
        }
        sentry.captureException(error);
      }
    };
    requestRidiEventStatus();

    return source.cancel;
  }, [route]);

  return (
    <>
      {/* isPartialsLogin Partials 뿐만 아니라 값이 있으면 그냥 로그인 표시 */}
      {loggedUser || isPartialsLogin === 'true' ? (
        // Todo add promotion buttons ex) calc date 123 충전
        <>
          <li>
            <a
              href={cashOrderPath.toString()}
              aria-label={
                eventStatus.double_point ? '리디 캐시 더블 포인트 충전' : '리디 캐시 충전'
              }
            >
              <Button
                wrapperCSS={
                  eventStatus.double_point
                  && css`border: 1px solid #ffde24;`
                }
                type="primary"
                label={(
                  <div
                    css={css`
                      line-height: 30px;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      color: white;
                      font-size: 13px;
                      font-weight: 700;
                    `}
                  >
                    <span
                      css={css`
                        margin-right: 2px;
                      `}
                    >
                      캐시
                      <span
                        css={css`${orBelow(330, 'display: none;')}`}
                      >
                        충전
                      </span>
                    </span>
                    {eventStatus.double_point ? <DoublePointIcon /> : <CashIcon />}
                  </div>
                )}
              />
            </a>
          </li>
          <li>
            <a href={process.env.NEXT_STATIC_LIBRARY_HOST} aria-label="내 서재 홈으로 이동">
              <Button type="primary" label="내 서재" />
            </a>
          </li>
        </>
      ) : (
        <>
          <li>
            <a href={signUpPath.toString()} aria-label="회원가입하기">
              <Button type="primary" label="회원가입" />
            </a>
          </li>
          <li>
            {/* Todo fix correct path by env */}
            <a href={loginPath.toString()} aria-label="로그인하기">
              <Button type="secondary" label="로그인" />
            </a>
          </li>
        </>
      )}
    </>
  );
};

interface GNBProps {
  type?: string;
  id?: string;
  login?: boolean;
  searchKeyword?: string;
  isPartials: boolean;
  pathname?: string;
  isLoginForPartials?: 'true' | 'false';
}

export const GNBContext = React.createContext<{
  origin?: string;
}>({});

export const GNB: React.FC<GNBProps> = React.memo((props: GNBProps) => {
  const loggedUser = useAccount();
  const route = useRouter();
  const { isPartials } = props;

  const initialLoginPath = `${process.env.NEXT_STATIC_ACCOUNT_HOST}/account/login`;
  const initialSignupPath = `${process.env.NEXT_STATIC_ACCOUNT_HOST}/account/signup`;
  const initialCashOrderPath = `${process.env.NEXT_STATIC_ACCOUNT_HOST}/order/checkout/cash`;

  const [loginPath, setLoginPath] = useState(initialLoginPath);
  const [signUpPath, setSignUpPath] = useState(initialSignupPath);
  const [cashOrderPath, setCashOrderPath] = useState(initialCashOrderPath);

  const [origin, setOrigin] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('return_url', new URL(route.asPath, location.href).toString() || location.href);

    setLoginPath(`${initialLoginPath}?${params.toString()}`);
    setSignUpPath(`${initialSignupPath}?${params.toString()}`);

    if (isPartials) {
      setOrigin(Array.isArray(route.query.origin) ? route.query.origin[0] : route.query.origin || '');
    }
  }, [route.asPath, route.query.origin]);

  return (
    <GNBWrapper className="new_gnb" id={props.id}>
      <GNBContext.Provider value={{ origin }}>
        <Header>
          <Navigation>
            <LogoSearchBoxArea>
              <LogoWrapper>
                <li>
                  <h1>
                    <HomeLink passHref>
                      <a aria-label="리디북스 홈으로 이동">
                        <RidibooksLogo src={RIDIBOOKS_LOGO_URL} alt="리디북스" />
                      </a>
                    </HomeLink>
                  </h1>
                </li>
                <li>
                  <a
                    href="https://select.ridibooks.com"
                    aria-label="리디셀렉트 홈으로 이동"
                  >
                    <RidiSelectLogo src={RIDISELECT_LOGO_URL} alt="리디셀렉트" />
                  </a>
                </li>
              </LogoWrapper>
              <ButtonWrapper>
                <GNBButtons
                  loggedUser={loggedUser}
                  isPartialsLogin={props.isLoginForPartials}
                  loginPath={loginPath}
                  signUpPath={signUpPath}
                  cashOrderPath={cashOrderPath}
                />
              </ButtonWrapper>
              <InstantSearch />
            </LogoSearchBoxArea>
          </Navigation>
          <MainTab loggedUserInfo={loggedUser} />
        </Header>
      </GNBContext.Provider>
    </GNBWrapper>
  );
});

export default GNB;
