import * as React from 'react';
import { InstantSearch } from 'src/components/Search';
import {
  act,
  render,
  cleanup,
  fireEvent,
  getAllByText,
  getByPlaceholderText,
  RenderResult,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// @ts-ignore
import labels from 'src/labels/instantSearch.json';
import { ThemeProvider } from 'emotion-theming';
import { defaultTheme } from 'src/styles';
import localStorageKeys from 'src/constants/localStorage';
import { safeJSONParse } from '../../../utils/common';

import axios from 'axios';
import fixtureABC from './abc.fixture.json';
afterEach(cleanup);

// axiosMock.get.mockResolvedValue();
const renderComponent = async (isPartials) => {
  let result: RenderResult;
  await act(async () => {
    result = render(
      <ThemeProvider theme={defaultTheme}>
        <InstantSearch searchKeyword={''} isPartials={isPartials}/>
      </ThemeProvider>,
    );
  });
  return result!;
};

describe('test instant search', () => {
  it('should be render input', async () => {
    const { container } = await renderComponent(false);
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    expect(inputNode).not.toBe(null);
  });

  it('should be render history list', async () => {
    localStorage.setItem(
      localStorageKeys.instantSearchHistory,
      JSON.stringify(['history_1', 'history_2']),
    );
    const { container } = await renderComponent(false);
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    await act(async () => {
      fireEvent.focus(inputNode, {});
    });
    const historyNode = getAllByText(container, labels.turnOffSearchHistory);
    expect(historyNode).not.toBe(null);
    const historyItems = container.getElementsByTagName('li');
    expect(historyItems.length).toBeGreaterThan(1);
    const item = getAllByText(container, 'history_1');
    expect(item).not.toBe(null);
  });

  it('should be move item by keyboard control', async () => {
    localStorage.setItem(
      localStorageKeys.instantSearchHistory,
      JSON.stringify(['history_1', 'history_2']),
    );
    const { container } = await renderComponent(false);
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    await act(async () => {
      fireEvent.click(inputNode, {});
      fireEvent.keyDown(inputNode, {
        key: 'Down',
        keyCode: 40,
        code: 40,
        charCode: 40,
        which: 40,
      });
      fireEvent.keyDown(inputNode, {
        key: 'Down',
        keyCode: 40,
        code: 40,
        charCode: 40,
        which: 40,
      });
      fireEvent.keyDown(inputNode, {
        key: 'Up',
        keyCode: 38,
        code: 38,
        charCode: 38,
        which: 38,
      });
    });
    expect(document.activeElement).not.toBe(null);
    await act(async () => {
      fireEvent.keyDown(document.activeElement!, {
        key: 'Enter',
        keyCode: 13,
        code: 13,
        charCode: 13,
        which: 13,
      });
    });
    expect(window.location.href).not.toBe('');
  });

  it('should not be render search history', async () => {
    localStorage.setItem(
      localStorageKeys.instantSearchHistory,
      'maybe error be with you',
    );
    const { container } = await renderComponent(false);
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    await act(async () => {
      fireEvent.click(inputNode, {});
    });
    const historyItems = container.getElementsByTagName('li');
    expect(historyItems.length).toBe(0);
  });

  it('should render search result', async () => {
    jest.useFakeTimers();
    (axios as any).__setHandler((method: string, url: string) => {
      return {
        data: fixtureABC,
      };
    });
    let { container } = await renderComponent(false);
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    await act(async () => {
      fireEvent.focus(inputNode);
      fireEvent.change(inputNode, { target: { value: 'ABC' } });
      jest.runAllTimers();
    });
    jest.useRealTimers();
    expect(
      container.querySelector('[data-author-id="90615"] span:nth-child(1)')?.textContent,
    ).toBe('ABC디이');
  });

  it('should not be render search result', async () => {
    jest.useFakeTimers();
    const { container } = await renderComponent(false);
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    await act(async () => {
      fireEvent.change(inputNode, { target: { value: '가나' } });
      jest.runAllTimers();
    });
    jest.useRealTimers();
    expect(inputNode.value).toBe('가나');
  });

  it('can be add search history', async () => {
    const { container } = await renderComponent(false);
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    const searchForm = container.getElementsByTagName('form');
    expect(searchForm).not.toBe(null);

    await act(async () => {
      fireEvent.submit(searchForm[0]);
      fireEvent.change(inputNode, { target: { value: 'ABC' } });
      fireEvent.submit(searchForm[0]);
    });

    const history = safeJSONParse(
      localStorage.getItem(localStorageKeys.instantSearchHistory),
      [],
    );
    expect(history).not.toBe([]);
  });

  it('should be remove all search history.', async () => {
    localStorage.setItem(
      localStorageKeys.instantSearchHistory,
      JSON.stringify(['history_1']),
    );
    const { container } = await renderComponent(false);
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    await act(async () => {
      fireEvent.focus(inputNode, {});
    });
    const historyClearNode = getAllByText(container, labels.clearSearchHistory);
    expect(historyClearNode).not.toBe(null);
    await act(async () => {
      fireEvent.click(historyClearNode[0], {});
    });
    const history = safeJSONParse(
      localStorage.getItem(localStorageKeys.instantSearchHistory),
      '',
    );

    expect(history.length).toBe(0);
  });
  it('should be toggle search history', async () => {
    localStorage.setItem(
      localStorageKeys.instantSearchHistory,
      JSON.stringify(['history_1']),
    );
    const { container } = await renderComponent(false);
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    await act(async () => {
      fireEvent.focus(inputNode, {});
    });
    const historyToggleNode = getAllByText(container, labels.turnOffSearchHistory);
    expect(historyToggleNode).not.toBe(null);
    await act(async () => {
      fireEvent.click(historyToggleNode[0], {});
    });
    const historyOption = safeJSONParse(
      localStorage.getItem(localStorageKeys.instantSearchHistoryOption),
      'defaultValue',
    );
    expect(historyOption).toBe(false);
    getAllByText(container, labels.turnOffStatus);

    const historyToggleOnNode = getAllByText(container, labels.turnOnSearchHistory);
    expect(historyToggleOnNode).not.toBe(null);
    await act(async () => {
      fireEvent.click(historyToggleOnNode[0], {});
    });
    const historyOnOption = safeJSONParse(
      localStorage.getItem(localStorageKeys.instantSearchHistoryOption),
      'defaultValue',
    );
    expect(historyOnOption).toBe(true);
  });

  it('should be remove search history item', async () => {
    localStorage.setItem(
      localStorageKeys.instantSearchHistory,
      JSON.stringify(['history_1', 'history_2']),
    );
    const { container } = await renderComponent(false);
    const inputNode = getByPlaceholderText(container, labels.searchPlaceHolder);
    await act(async () => {
      fireEvent.focus(inputNode, {});
    });
    const removeHistoryNode: HTMLElement[] = getAllByText(
      container,
      labels.removeHistory,
    );

    await act(async () => {
      fireEvent.click(removeHistoryNode[0].parentElement!, {});
    });

    const history = safeJSONParse(
      localStorage.getItem(localStorageKeys.instantSearchHistory),
      [],
    );
    expect(history.length).toBe(1);
  });
});
