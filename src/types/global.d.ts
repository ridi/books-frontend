import type appboy from '@braze/web-sdk';
type Appboy = typeof appboy;

declare global {
  interface Window {
    isPartials?: boolean;
    isExternalLink?: (url: string) => boolean;
    isLoginRequired?: (url: string) => boolean;
    appboy?: Appboy;
  }
}
