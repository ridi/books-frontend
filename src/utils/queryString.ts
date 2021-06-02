import qs from 'qs';

interface AppendQueryStringOptions {
  overwrite?: boolean;
}
export const appendQueryString = (href: string, data: Record<string, unknown>, options: AppendQueryStringOptions = {}) => {
  const [url, queryStr] = href.split('?');
  const value = (
    options.overwrite
      ? { ...(qs.parse(queryStr)), ...data }
      : { ...data, ...(qs.parse(queryStr)) }
  );
  return url + qs.stringify(value, { addQueryPrefix: true });
};
