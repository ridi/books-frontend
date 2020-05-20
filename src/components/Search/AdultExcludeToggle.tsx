import React from 'react';
import styled from '@emotion/styled';
import Cookies from 'universal-cookie';

import { dodgerBlue40, slateGray20, slateGray60 } from '@ridi/colors';
import { useRouter } from 'next/router';
import { CHECK_ICON_URL } from 'src/constants/icons';

const Input = styled.input`
  width: 20px;
  height: 20px;
  border: 1px solid ${slateGray20};
  box-sizing: border-box;
  border-radius: 2px;
  background: white;
  margin-right: 6px;
  :checked {
    border: 0;
    background: ${dodgerBlue40} no-repeat center;
    background-image: url("${CHECK_ICON_URL}");
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  padding: 6px 4px 6px 6px;
  border-radius: 4px;
  &, * {
    cursor: pointer;
  }
  :active {
    background: rgba(0, 0, 0, 0.05);
  }

  font-weight: bold;
  font-size: 13px;
  color: ${slateGray60};
`;

function Toggle(props: {
  isChecked: boolean;
  name: string;
  label: string;
  toggleHandler: (isChecked: boolean) => void;
}) {
  const {
    isChecked, name, label, toggleHandler,
  } = props;

  const clickHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (toggleHandler) {
      toggleHandler(e.target.checked);
    }
  };
  return (
    <Label>
      <Input onChange={clickHandler} id={name} type="checkbox" name={name} checked={isChecked} />
      {label}
    </Label>
  );
}

export function AdultExcludeToggle(props: { adultExclude: boolean }) {
  const { adultExclude } = props;
  const router = useRouter();
  const searchParam = new URLSearchParams((router.query as Record<string, string>) || {});

  const toggle = (newValue: boolean) => {
    const value = newValue ? 'y' : 'n';
    searchParam.set('adult_exclude', value);
    searchParam.delete('is_login');
    const cookie = new Cookies();
    cookie.set('adult_exclude', value, {
      path: '/',
      sameSite: 'lax',
    });
    router.push(`/search?${searchParam.toString()}`);
  };
  return (
    <Toggle
      name="adult_exclude"
      label="성인 제외"
      toggleHandler={toggle}
      isChecked={adultExclude}
    />
  );
}
