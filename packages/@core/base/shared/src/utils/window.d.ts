interface OpenWindowOptions {
  noopener?: boolean;
  noreferrer?: boolean;
  target?: '_blank' | '_parent' | '_self' | '_top' | string;
}
declare function openWindow(url: string, options?: OpenWindowOptions): void;
declare function openRouteInNewWindow(path: string): void;
export { openRouteInNewWindow, openWindow };
