export interface VisibleDomRect {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
}
export declare function getElementVisibleRect(
  element?: HTMLElement | null | undefined,
): VisibleDomRect;
export declare function getScrollbarWidth(): number;
export declare function needsScrollbar(): boolean;
export declare function triggerWindowResize(): void;
