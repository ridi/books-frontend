import React from 'react';
import styled from '@emotion/styled';

import { dodgerBlue40, slateGray20, slateGray60 } from '@ridi/colors';
import { CHECK_ICON_URL } from 'src/constants/icons';
import { useSearchQueries } from 'src/hooks/useSearchQueries';
import { defaultHoverStyle } from 'src/styles';

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
  display: inline-flex;
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
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.05);
  ${defaultHoverStyle}
`;

export function Checkbox(props: {
  isChecked: boolean;
  name: string;
  label: string;
  toggleHandler?: (value: boolean) => void;
}) {
  const {
    isChecked, name, label, toggleHandler,
  } = props;

  const { updateQuery } = useSearchQueries();

  const clickHandler = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    toggleHandler?.(e.target?.checked);
    updateQuery({ [name]: e.target?.checked });
  }, [updateQuery]);

  return (
    <Label>
      <Input
        onChange={clickHandler}
        id={name}
        type="checkbox"
        name={name}
        checked={isChecked}
      />
      {label}
    </Label>
  );
}
