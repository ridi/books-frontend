import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { RIDITheme } from 'src/styles/themes';
import { Button } from 'src/components/Button';
import { InstantSearch } from 'src/components/Search';
import { MainTab } from 'src/components/Tabs';
import RidiLogo from 'src/svgs/RidiLogo_1.svg';
import RidiSelectLogo from 'src/svgs/RidiSelectLogo_1.svg';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { accountActions } from 'src/services/accounts';
import { RootState } from 'src/store/config';
import { AccountState } from 'src/services/accounts/reducer';
import { LoggedUser } from 'src/types/account';
import { useRouter } from 'next/router';
import DoublePointIcon from 'src/svgs/DoublePoint.svg';
import CashIcon from 'src/svgs/Cash.svg';
import pRetry from 'p-retry';
import axios, { OAuthRequestType, wrapCatchCancel } from 'src/utils/axios';
import originalAxios from 'axios';
import sentry from 'src/utils/sentry';
const { captureException } = sentry();

const GNBWrapper = styled.div`
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
    css`
      padding: 9px 10px;
    `,
  )};
`;

const LogoWrapper = styled.ul`
  min-height: 30px;
  margin-right: -2.5px;
  flex: 0 0 auto;
  ${orBelow(
    BreakPoint.LG,
    css`
      height: 30px;
      margin-right: 0;
    `,
  )};
  order: 1;
  margin-bottom: 0;
  display: inline-flex;
  li {
    display: inline-flex;
    a {
      display: inline-flex;
      align-items: center;
    }

    ::after {
      position: relative;
      top: 7px;
      font-size: 14px;
      content: '|';
      color: white;
      opacity: 0.4;
      margin: 0 8.5px 0 10px;

      ${orBelow(
        BreakPoint.LG,
        css`
          margin: 0 6px 0 5px;
          top: 7px;
          font-size: 12px;
        `,
      )};
    }
    :last-of-type {
      ::after {
        content: '';
      }
    }
  }
`;

const ridiLogo = (theme: RIDITheme) => css`
  filter: ${theme.logoFilter};
  width: 103px;
  height: 16px;
  fill: white;
  :hover {
    opacity: 0.8;
  }
  ${orBelow(
    BreakPoint.LG,
    css`
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

const ridiSelectLogo = (theme: RIDITheme) => css`
  filter: ${theme.logoFilter};
  fill: white;
  opacity: 0.6;
  width: 87.5px;
  height: 14px;

  ${orBelow(
    BreakPoint.LG,
    css`
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
  flex: 0 0 auto;
  order: 3;
  ${orBelow(
    BreakPoint.LG,
    css`
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
        css`
          margin-right: 3px;
        `,
      )};
    }
  }
`;

const logoAndSearchBox = css`
  display: flex;
  flex-direction: row;
  ${orBelow(
    BreakPoint.LG,
    css`
      flex-wrap: wrap;
    `,
  )};
`;

interface GNBButtonsProps {
  loggedUser: null | LoggedUser;
  isPartialsLogin?: 'true' | 'false';
}
const GNBButtons: React.FC<GNBButtonsProps> = props => {
  const { loggedUser, isPartialsLogin } = props;
  const [eventStatus, setEventStatus] = useState<{
    double_point: boolean;
    fifteen_night: boolean;
  }>({
    double_point: false,
    fifteen_night: false,
  });

  const [cashOrderPath, setCashOrderPath] = useState('/');
  const [loginPath, setLoginPath] = useState('/');
  const [signUpPath, setSignUpPath] = useState('/');
  const route = useRouter();

  useEffect(() => {
    const tempLoginPath = new URL(
      '/account/login',
      publicRuntimeConfig.STORE_MASTER_HOST,
    );
    const tempSignUpPath = new URL(
      '/account/signup',
      publicRuntimeConfig.STORE_MASTER_HOST,
    );
    setCashOrderPath(
      new URL('/order/checkout/cash', publicRuntimeConfig.STORE_MASTER_HOST).toString(),
    );

    const returnUrl = new URL(route.asPath, publicRuntimeConfig.STORE_HOST);
    tempLoginPath.searchParams.append(
      'return_url',
      returnUrl.toString() || publicRuntimeConfig.STORE_HOST,
    );
    tempSignUpPath.searchParams.append(
      'return_url',
      returnUrl.toString() || publicRuntimeConfig.STORE_HOST,
    );

    setLoginPath(tempLoginPath.toString());
    setSignUpPath(tempSignUpPath.toString());
  }, [route.asPath]);

  useEffect(() => {
    const source = originalAxios.CancelToken.source();

    const requestRidiEventStatus = async () => {
      try {
        const cartUrl = new URL(
          '/api/schedule/events',
          publicRuntimeConfig.STORE_TEMP_API_HOST,
        );

        const result = await pRetry(
          () =>
            wrapCatchCancel(axios.get)(cartUrl.toString(), {
              withCredentials: true,
              custom: { authorizationRequestType: OAuthRequestType.CHECK },
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
        captureException(error);
      }
    };
    requestRidiEventStatus();

    return () => {
      source.cancel();
    };
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
              }>
              <Button
                wrapperCSS={
                  eventStatus.double_point &&
                  css`
                    border: 1px solid #ffde24;
                  `
                }
                type={'primary'}
                label={
                  <div
                    css={css`
                      line-height: 30px;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      color: white;
                      font-size: 13px;
                      font-weight: 700;
                    `}>
                    <span
                      css={css`
                        margin-right: 2px;
                      `}>
                      캐시
                      <span
                        css={orBelow(
                          330,
                          css`
                            display: none;
                          `,
                        )}>
                        충전
                      </span>
                    </span>
                    {eventStatus.double_point ? <DoublePointIcon /> : <CashIcon />}
                  </div>
                }
              />
            </a>
          </li>
          <li>
            <a href={publicRuntimeConfig.LIBRARY_HOST} aria-label={'내 서재 홈으로 이동'}>
              <Button type={'primary'} label={'내 서재'} />
            </a>
          </li>
        </>
      ) : (
        <>
          <li>
            <a href={signUpPath.toString()} aria-label={'회원가입하기'}>
              <Button type={'primary'} label={'회원가입'} />
            </a>
          </li>
          <li>
            {/* Todo fix correct path by env */}
            <a href={loginPath.toString()} aria-label={'로그인하기'}>
              <Button type={'secondary'} label={'로그인'} />
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
export const GNB: React.FC<GNBProps> = React.memo((props: GNBProps) => {
  const { loggedUser } = useSelector<RootState, AccountState>(state => state.account);
  const [path, setPath] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const cancelToken = originalAxios.CancelToken.source();
    dispatch({ type: accountActions.checkLogged.type, payload: cancelToken });
    setPath(window.location.href);
    return () => {
      cancelToken.cancel();
    };
  }, []);

  const loginPath = new URL('/account/login', publicRuntimeConfig.STORE_HOST);
  loginPath.searchParams.append('return_url', path || publicRuntimeConfig.BOOKS_HOST);

  const homePath = new URL('/', publicRuntimeConfig.STORE_HOST);
  return (
    // @ts-ignore
    <GNBWrapper className={'new_gnb'} id={props.id}>
      <Header>
        <Navigation>
          <div css={logoAndSearchBox}>
            <LogoWrapper>
              <li>
                <a
                  href={homePath.toString()}
                  aria-label={'리디북스 홈으로 이동'}
                  css={css`
                    display: flex;
                    align-items: center;
                  `}>
                  <RidiLogo css={ridiLogo} />
                  <span className="a11y">RIDIBOOKS</span>
                </a>
              </li>
              <li>
                <a
                  href="https://select.ridibooks.com"
                  aria-label={'리디셀렉트 홈으로 이동'}>
                  <RidiSelectLogo css={ridiSelectLogo} />
                  <span className="a11y">리디셀렉트</span>
                </a>
              </li>
            </LogoWrapper>
            <ButtonWrapper>
              <GNBButtons
                loggedUser={loggedUser}
                isPartialsLogin={props.isLoginForPartials}
              />
            </ButtonWrapper>
            <InstantSearch
              isPartials={props.isPartials}
              searchKeyword={props.searchKeyword || ''}
            />
          </div>
        </Navigation>
        <MainTab isPartials={props.isPartials} loggedUserInfo={loggedUser} />
      </Header>
    </GNBWrapper>
  );
});

export default GNB;
