import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { dodgerBlue50, slateGray20 } from '@ridi/colors';
import { ErrorProps } from 'next/error';
import React from 'react';

import Meta from 'src/components/Meta';
// import { NotFoundError } from 'src/utils/error';
import sentry from 'src/utils/sentry';
import NotFoundIcon from 'src/svgs/NotFound.svg';
import RidiLogo from 'src/svgs/RidiLogo_1.svg';
import { ConnectedInitializeProps } from 'src/types/common';

const Button = styled.button`
  display: inline-block;
  width: 140px;
  padding: 14px 0;
  margin: 0 4px;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  outline: 0;
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0 1px 1px 0 rgba(209, 213, 217, 0.3);
`;

const logoStyle = css`
  width: 84px;
  height: 13px;
  fill: ${dodgerBlue50};
`;

const detailStyle = css`
  margin-top: 50px;
  font-size: 10px;
  color: ${slateGray20};
  label {
    text-decoration: underline;
  }
  input, label + p {
    display: none;
  }
  input:checked + label + p {
    display: block;
  }
`;

export default function ErrorPage(props: ErrorProps & { err: Error }) {
  const { statusCode, err } = props;
  const code = statusCode >= 400 ? String(statusCode) : '';

  return (
    <>
      <Meta />
      <header css={css`border-bottom: 1px solid #cddce5;`}>
        <h1
          css={css`
            text-align: center;
            font-size: 13px;
            margin: 0;
          `}
        >
          <a
            css={css`
              display: inline-block;
              padding: 15px 14px 12px;
            `}
            href="/"
          >
            <RidiLogo css={logoStyle} />
          </a>
        </h1>
      </header>
      <div
        css={css`
          width: 100%;
          display: flex;
          padding: 60px 0;
          justify-content: center;
          flex-direction: column;
          align-items: center;
        `}
      >
        <NotFoundIcon />
        <h2
          css={css`
            margin: 8px 0;
            font-size: 60px;
            color: #303538;
          `}
        >
          {code}
        </h2>
        <p
          css={css`
            margin: 20px 0;
            font-size: 18px;
            line-height: 1.6em;
            text-align: center;
            color: #525a61;
          `}
        >
          {statusCode === 404 ? (
            <>
              <strong>요청하신 페이지가 없습니다.</strong>
              <br />
              입력하신 주소를 확인해 주세요.
            </>
          ) : (
            <>
              <strong>오류가 발생했습니다.</strong>
              <br />
              잠시 후 다시 시도해주세요.
            </>
          )}
        </p>
        <div css={css`margin: 40px 0;`}>
          <Button
            css={css`
              color: #808991;
              background: #fff;
              border: 1px solid #d1d5d9;
            `}
            onClick={() => window.history.back()}
          >
            이전페이지
          </Button>
          <Button
            css={css`
              color: #ffffff;
              background: #808991;
              border: 1px solid #798086;
            `}
          >
            <a href="/">
              홈으로 돌아가기
            </a>
          </Button>
        </div>

        {statusCode >= 500 && (
          <div css={detailStyle}>
            <input type="checkbox" id="detail" />
            <label htmlFor="detail">자세히 보기</label>
            <p>
              {JSON.stringify(err)}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

ErrorPage.getInitialProps = (context: ConnectedInitializeProps) => {
  const { res, err } = context;
  // if (err && !(err instanceof NotFoundError)) {
  if (err) {
    sentry.captureException(err, context);
    const statusCode = err.statusCode || res?.statusCode || 500;
    return { statusCode, err };
  }

  return { statusCode: 404 };
};
