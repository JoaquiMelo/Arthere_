import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@/providers/theme-provider';

import type { Palette } from '@/providers/theme-provider';

export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (palette: Palette) => T,
) {
  const { palette } = useTheme();
  return useMemo(() => StyleSheet.create(factory(palette)), [palette, factory]);
}
