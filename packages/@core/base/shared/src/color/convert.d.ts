import { TinyColor } from '@ctrl/tinycolor';
declare function convertToHsl(color: string): string;
declare function convertToHslCssVar(color: string): string;
declare function convertToRgb(str: string): string;
declare function isValidColor(color?: string): boolean;
export {
  convertToHsl,
  convertToHslCssVar,
  convertToRgb,
  isValidColor,
  TinyColor,
};
