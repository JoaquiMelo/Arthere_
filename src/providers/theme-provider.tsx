import React, { createContext, useContext, useMemo, useState } from 'react';
import { colors as baseColors } from '@/shared/theme/colors';

export type PaletteName = 'Arthere' | 'Oceano' | 'Ameixa';

const palettes = {
  Arthere: baseColors,
  Oceano: {
    ...baseColors,
    background: '#F4FAFA',
    surface: '#D9EEF1',
    surfaceStrong: '#B9DFE5',
    primary: '#3F91A3',
    primaryDark: '#286F7E',
    secondary: '#A8C7CD',
    accent: '#F2CE99',
    orange: '#E17A56',
    danger: '#D95A48',
    text: '#21464D',
    muted: '#5F7F86',
    border: '#9ECBD2',
    white: '#FFFFFF',
    brandInk: '#19343B',
    brandPaper: '#F3F8F8',
    brandBlue: '#63B4C8',
    brandGreen: '#3E9B73',
    brandSand: '#F2D7A7',
    brandTerracotta: '#E58B68',
    brandCoral: '#E65D4B',
  },
  Ameixa: {
    ...baseColors,
    background: '#FBF7FA',
    surface: '#EFE2EB',
    surfaceStrong: '#DFC6D7',
    primary: '#8B567D',
    primaryDark: '#683A5D',
    secondary: '#C8AEBE',
    accent: '#F2CE99',
    orange: '#D88160',
    danger: '#D95A68',
    text: '#452D3F',
    muted: '#796274',
    border: '#D5BACC',
    white: '#FFFFFF',
    brandInk: '#322633',
    brandPaper: '#FAF5F8',
    brandBlue: '#8BC2D1',
    brandGreen: '#6AA66D',
    brandSand: '#ECCE9E',
    brandTerracotta: '#D18672',
    brandCoral: '#D85B74',
  },
} as const;

type ThemeContextType = {
  paletteName: PaletteName;
  palette: typeof palettes.Arthere;
  setPalette: (name: PaletteName) => void;
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [paletteName, setPaletteName] = useState<PaletteName>('Arthere');
  const palette = useMemo(() => palettes[paletteName], [paletteName]);

  return (
    <ThemeContext.Provider value={{ paletteName, palette, setPalette: setPaletteName }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
export { palettes };
