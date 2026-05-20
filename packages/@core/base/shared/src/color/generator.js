import { getColors } from 'theme-colors';
import { convertToHslCssVar, TinyColor } from './convert';
function generatorColorVariables(colorItems) {
  const colorVariables = {};
  colorItems.forEach(({ alias, color, name }) => {
    if (color) {
      const colorsMap = getColors(new TinyColor(color).toHexString());
      let mainColor = colorsMap['500'];
      const colorKeys = Object.keys(colorsMap);
      colorKeys.forEach((key) => {
        const colorValue = colorsMap[key];
        if (colorValue) {
          const hslColor = convertToHslCssVar(colorValue);
          colorVariables[`--${name}-${key}`] = hslColor;
          if (alias) {
            colorVariables[`--${alias}-${key}`] = hslColor;
          }
          if (key === '500') {
            mainColor = hslColor;
          }
        }
      });
      if (alias && mainColor) {
        colorVariables[`--${alias}`] = mainColor;
      }
    }
  });
  return colorVariables;
}
export { generatorColorVariables };
