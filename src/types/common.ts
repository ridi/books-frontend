import { Store } from 'redux';
import { NextPageContext } from 'next';
import { Request } from 'express';

export interface ConnectedInitializeProps extends NextPageContext {
  store: Store;
  req?: Request;
  isServer: boolean;
}

export interface PublicRuntimeConfig {
  STATIC_CDN_URL: string;
  SEARCH_API: string;
}
