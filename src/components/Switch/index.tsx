import styled from '@emotion/styled';
import { dodgerBlue40, slateGray30 } from '@ridi/colors';
import React from 'react';

const Container = styled.div<{ checked?: boolean }>`
  width: 46px;
  height: 26px;
  padding: 2px;

  border-radius: 13px;
  cursor: pointer;

  transition: 0.2s;
  background: ${slateGray30};
  ${(props) => props.checked && `
    background: ${dodgerBlue40};
  `};
`;

const Input = styled.input`
  ${Container} > input& { // Specificity hack
    display: block;
    width: 22px;
    height: 22px;

    border: none;
    border-radius: 11px;
    background: white;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.25);
    cursor: pointer;

    appearance: none;
    &::-ms-check {
      display: none;
    }

    transition: 0.2s;
    &:checked {
      transform: translateX(20px);
    }
  }
`;

interface Props extends Omit<React.HTMLProps<HTMLInputElement>, 'type' | 'onChange'> {
  onChange?(checked: boolean): void;
}

export default function Switch(props: Props) {
  const { onChange, ...restProps } = props;
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  }, [onChange]);

  return (
    <Container checked={props.checked}>
      <Input {...restProps} type="checkbox" onChange={handleChange} />
    </Container>
  );
}
