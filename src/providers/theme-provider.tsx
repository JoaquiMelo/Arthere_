import React, { createContext, useContext, useMemo, useState } from 'react';
import { colors as baseColors } from '@/shared/theme/colors';

export type PaletteName = 'Arthere' | 'Oceano' | 'Ameixa';
const palettes = {
  Arthere: baseColors,
  Oceano: { ...baseColors, background:'#F1F8FA', surface:'#DCEFF3', surfaceStrong:'#BBDDE4', primary:'#087F8C', primaryDark:'#05636D', secondary:'#B8D5DA', accent:'#F2C14E', orange:'#087F8C', danger:'#D64545', text:'#123B42', muted:'#52747A', border:'#B5D3D8', white:'#FFFFFF' },
  Ameixa: { ...baseColors, background:'#FBF5FA', surface:'#F0DDEB', surfaceStrong:'#E2C0D8', primary:'#8A3D72', primaryDark:'#6E2E5A', secondary:'#D8C7D4', accent:'#E4B84A', orange:'#A34A7F', danger:'#C83D58', text:'#42213A', muted:'#79586F', border:'#D8B8CD', white:'#FFFFFF' },
} as const;
type ThemeContextType = { paletteName: PaletteName; palette: typeof palettes.Arthere; setPalette:(name:PaletteName)=>void };
const ThemeContext=createContext<ThemeContextType>({} as ThemeContextType);
export function ThemeProvider({children}:{children:React.ReactNode}){const [paletteName,setPaletteName]=useState<PaletteName>('Arthere');const palette=useMemo(()=>palettes[paletteName],[paletteName]);return <ThemeContext.Provider value={{paletteName,palette,setPalette:setPaletteName}}>{children}</ThemeContext.Provider>}
export const useTheme=()=>useContext(ThemeContext);
export { palettes };
