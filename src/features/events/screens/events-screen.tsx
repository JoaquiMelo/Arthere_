import { useTheme } from '@/providers/theme-provider';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MOCK_EVENTOS } from '../types/event';

export default function EventsScreen() {
  const [filtro, setFiltro] = useState<'TODOS' | 'PREMIUM'>('TODOS');
  const { palette } = useTheme();
  const eventos = useMemo(() => MOCK_EVENTOS.filter((e) => filtro === 'TODOS' || e.premium), [filtro]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={[styles.hero, { backgroundColor: palette.brandInk, borderColor: palette.brandPaper }]}>
          <View style={[styles.heroShapeBlue, { backgroundColor: palette.brandBlue }]} />
          <View style={[styles.heroShapeGreen, { backgroundColor: palette.brandGreen }]} />
          <View style={[styles.heroShapeOrange, { backgroundColor: palette.brandCoral }]} />
          <View style={styles.heroCopy}>
            <Text style={[styles.eyebrow, { color: palette.brandSand }]}>AGENDA REGIONAL</Text>
            <Text style={[styles.title, { color: palette.brandPaper }]}>RETRATO</Text>
            <Text style={[styles.title, { color: palette.brandPaper, marginTop: -8 }]}>EXPO</Text>
            <View style={[styles.titleLine, { backgroundColor: palette.brandCoral }]} />
            <Text style={[styles.subtitle, { color: palette.brandPaper }]}>
              Encontro e exposção de fotrografia em Santos
            </Text>
          </View>
        </View>

        <View style={styles.toolbar}>
          <Text style={[styles.sectionKicker, { color: palette.brandInk }]}>PRÓXIMOS EVENTOS</Text>
          <View style={styles.filters}>
            <TouchableOpacity
              style={[styles.filter, { borderColor: palette.brandInk, backgroundColor: palette.brandPaper }, filtro === 'TODOS' && { backgroundColor: palette.brandCoral, borderColor: palette.brandCoral }]}
              onPress={() => setFiltro('TODOS')}
            >
              <Text style={[styles.filterText, { color: palette.brandInk }, filtro === 'TODOS' && { color: palette.brandPaper }]}>Todos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filter, { borderColor: palette.brandInk, backgroundColor: palette.brandPaper }, filtro === 'PREMIUM' && { backgroundColor: palette.brandGreen, borderColor: palette.brandGreen }]}
              onPress={() => setFiltro('PREMIUM')}
            >
              <Ionicons name="star" size={14} color={filtro === 'PREMIUM' ? palette.brandPaper : palette.brandGreen} />
              <Text style={[styles.filterText, { color: palette.brandInk }, filtro === 'PREMIUM' && { color: palette.brandPaper }]}>Premium</Text>
            </TouchableOpacity>
          </View>
        </View>

        {eventos.map((e) => {
          const data = new Date(e.data + 'T12:00:00');
          const dia = data.getDate();
          const mes = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(data).replace('.', '').toUpperCase();
          const semana = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(data).replace('.', '').toUpperCase();

          return (
            <View key={e.id} style={[styles.cardWrap, { backgroundColor: palette.brandCoral }]}>
              <View style={[styles.card, { backgroundColor: palette.brandPaper, borderColor: palette.brandInk }]}>
                <View style={[styles.dateBox, { backgroundColor: e.premium ? palette.brandSand : palette.brandBlue, borderRightColor: palette.brandInk }]}>
                  <Text style={[styles.arrow, { color: palette.brandGreen }]}>↘</Text>
                  <Text style={[styles.day, { color: palette.brandInk }]}>{String(dia).padStart(2, '0')}</Text>
                  <Text style={[styles.weekday, { color: palette.brandInk }]}>{semana}</Text>
                  <Text style={[styles.month, { color: palette.brandInk }]}>{mes}</Text>
                </View>
                <View style={styles.body}>
                  <View style={styles.row}>
                    <Text style={[styles.category, { color: palette.brandCoral }]}>{e.categoria.toUpperCase()}</Text>
                    {e.premium && (
                      <View style={[styles.badge, { backgroundColor: palette.brandGreen }]}>
                        <Ionicons name="star" size={10} color={palette.brandPaper} />
                        <Text style={[styles.badgeText, { color: palette.brandPaper }]}>PREMIUM</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.eventTitle, { color: palette.brandInk }]}>{e.titulo}</Text>
                  <Text style={[styles.description, { color: palette.muted }]}>{e.descricao}</Text>
                  <View style={styles.info}>
                    <Ionicons name="location-outline" size={14} color={palette.brandTerracotta} />
                    <Text style={[styles.infoText, { color: palette.muted }]}>{e.local} · {e.cidade}</Text>
                  </View>
                  <View style={styles.info}>
                    <Ionicons name="time-outline" size={14} color={palette.brandTerracotta} />
                    <Text style={[styles.infoText, { color: palette.muted }]}>{e.horario} · {e.organizador}</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        {!eventos.length && (
          <View style={[styles.empty, { backgroundColor: palette.brandPaper, borderColor: palette.brandInk }]}>
            <Ionicons name="calendar-outline" size={30} color={palette.brandCoral} />
            <Text style={[styles.emptyTitle, { color: palette.brandInk }]}>Nenhum evento encontrado</Text>
            <Text style={[styles.emptyText, { color: palette.muted }]}>Tente voltar para “Todos” para visualizar a agenda completa.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 34 },
  hero: { minHeight: 260, borderRadius: 20, borderWidth: 1, overflow: 'hidden', position: 'relative', marginBottom: 18 },
  heroCopy: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24, zIndex: 2 },
  eyebrow: { fontSize: 11, fontWeight: '900', letterSpacing: 2.2 },
  title: { fontSize: 43, lineHeight: 47, fontWeight: '900', letterSpacing: -1.5 },
  titleLine: { height: 8, width: 104, marginTop: 12, marginBottom: 14 },
  subtitle: { maxWidth: 250, fontSize: 13, lineHeight: 18, fontWeight: '600' },
  heroShapeBlue: { position: 'absolute', width: 118, height: 118, borderRadius: 28, top: 78, right: -18, transform: [{ rotate: '20deg' }] },
  heroShapeGreen: { position: 'absolute', width: 92, height: 54, borderRadius: 12, right: 20, top: 34, transform: [{ rotate: '-2deg' }] },
  heroShapeOrange: { position: 'absolute', width: 64, height: 150, borderRadius: 12, right: 96, top: -26, transform: [{ rotate: '2deg' }] },
  toolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 12 },
  sectionKicker: { flex: 1, fontSize: 12, fontWeight: '900', letterSpacing: 1.2 },
  filters: { flexDirection: 'row', gap: 8 },
  filter: { minHeight: 36, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center', gap: 5 },
  filterText: { fontSize: 12, fontWeight: '900' },
  cardWrap: { marginBottom: 14, borderRadius: 14, paddingRight: 5, paddingBottom: 5 },
  card: { borderRadius: 12, borderWidth: 1.5, flexDirection: 'row', overflow: 'hidden', minHeight: 122 },
  dateBox: { width: 82, paddingVertical: 10, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1.5 },
  arrow: { position: 'absolute', top: 6, left: 8, fontSize: 24, fontWeight: '900' },
  day: { fontSize: 38, lineHeight: 38, fontWeight: '900', letterSpacing: -1.5 },
  weekday: { marginTop: 1, fontSize: 12, lineHeight: 14, fontWeight: '900' },
  month: { fontSize: 9, fontWeight: '900', marginTop: 1 },
  body: { flex: 1, padding: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  category: { fontSize: 9, fontWeight: '900', letterSpacing: 0.9, flex: 1 },
  badge: { borderRadius: 8, paddingHorizontal: 6, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', gap: 3 },
  badgeText: { fontSize: 8, fontWeight: '900' },
  eventTitle: { fontSize: 17, lineHeight: 20, fontWeight: '900', marginTop: 6 },
  description: { fontSize: 11.5, lineHeight: 16, marginTop: 4 },
  info: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  infoText: { fontSize: 10.5, flex: 1 },
  empty: { borderWidth: 1.5, borderRadius: 12, padding: 24, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '900', marginTop: 10 },
  emptyText: { marginTop: 5, fontSize: 12, textAlign: 'center', lineHeight: 17 },
});
