import type { CSSProperties } from 'vue';
import type { VisibleDomRect } from '@vben-core/shared/utils';
export declare function useLayoutContentStyle(): {
  contentElement: import('vue').Ref<
    HTMLDivElement | null,
    HTMLDivElement | null
  >;
  overlayStyle: import('vue').ComputedRef<CSSProperties>;
  visibleDomRect: import('vue').Ref<
    {
      bottom: number;
      height: number;
      left: number;
      right: number;
      top: number;
      width: number;
    } | null,
    | VisibleDomRect
    | {
        bottom: number;
        height: number;
        left: number;
        right: number;
        top: number;
        width: number;
      }
    | null
  >;
};
export declare function useLayoutHeaderStyle(): {
  getLayoutHeaderHeight: () => number;
  setLayoutHeaderHeight: (height: number) => void;
};
export declare function useLayoutFooterStyle(): {
  getLayoutFooterHeight: () => number;
  setLayoutFooterHeight: (height: number) => void;
};
