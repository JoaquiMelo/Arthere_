import React, { createContext, useContext, useMemo, useState } from 'react';
import { colors as baseColors } from '@/shared/theme/colors';

export type PaletteName = 'Arthere' | 'Oceano' | 'Ameixa';

const palettes = {
  // Inspirada diretamente no conceito visual enviado:
  // verde suave + azul claro + areia + terracota + coral.
  Arthere: baseColors,

  // Variação mais marítima, mas mantendo contraste quente para não ficar monocromática.
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
  },

  // Variação elegante com roxo/malva, equilibrada por areia e coral.
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
    <ThemeContext.Provider
      value={{ paletteName, palette, setPalette: setPaletteName }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
export { palettes };
