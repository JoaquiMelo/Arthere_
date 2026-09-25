import { useTheme } from '@/providers/theme-provider';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../../navigation/app-navigator';
import { MOCK_EVENTOS } from '../types/event';

type Filtro = 'TODOS' | 'PREMIUM' | string;

const MESES = ['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO','SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO'];
const SEMANAS = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB'];

function formatarDia(data: string) {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: 'long' })
    .format(new Date(data + 'T12:00:00'))
    .replace('.', '');
}

export default function EventsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Events'>>();
  const { palette } = useTheme();

  const primeiroEvento = MOCK_EVENTOS[0];
  const dataInicial = new Date(primeiroEvento.data + 'T12:00:00');
  const [filtro, setFiltro] = useState<Filtro>('TODOS');
  const [ano, setAno] = useState(dataInicial.getFullYear());
  const [mes, setMes] = useState(dataInicial.getMonth());
  const [diaSelecionado, setDiaSelecionado] = useState(26);

  const categorias = useMemo(() => {
    const unicas = Array.from(new Set(MOCK_EVENTOS.map((evento) => evento.categoria)));
    return ['TODOS', ...unicas, 'PREMIUM'];
  }, []);

  const eventosFiltrados = useMemo(() => MOCK_EVENTOS.filter((evento) => {
    if (filtro === 'TODOS') return true;
    if (filtro === 'PREMIUM') return evento.premium;
    return evento.categoria === filtro;
  }), [filtro]);

  const eventosDoMes = useMemo(() => eventosFiltrados.filter((evento) => {
    const data = new Date(evento.data + 'T12:00:00');
    return data.getFullYear() === ano && data.getMonth() === mes;
  }), [ano, mes, eventosFiltrados]);

  const eventosDoDia = useMemo(() => eventosDoMes.filter((evento) => {
    const data = new Date(evento.data + 'T12:00:00');
    return data.getDate() === diaSelecionado;
  }), [diaSelecionado, eventosDoMes]);

  const eventoDestaque = eventosDoDia[0] ?? eventosDoMes[0] ?? eventosFiltrados[0] ?? null;

  const diasDoMes = useMemo(() => {
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();
    return [...Array(primeiroDia).fill(null), ...Array.from({ length: totalDias }, (_, index) => index + 1)];
  }, [ano, mes]);

  const datasComEvento = useMemo(() => new Set(
    eventosDoMes.map((evento) => new Date(evento.data + 'T12:00:00').getDate())
  ), [eventosDoMes]);

  const moverMes = (delta: number) => {
    const novaData = new Date(ano, mes + delta, 1);
    setAno(novaData.getFullYear());
    setMes(novaData.getMonth());
    setDiaSelecionado(1);
  };

  const abrirEvento = (eventId: string) => navigation.navigate('EventDetails', { eventId });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={[styles.miniHeader, { borderBottomColor: palette.border }]}>
          <View style={styles.brandLockup}>
            <Text style={[styles.brand, { color: palette.brandInk }]}>ARTHERE</Text>
            <Text style={[styles.brandSub, { color: palette.muted }]}>AGENDA REGIONAL</Text>
          </View>
          <Text style={[styles.headerLabel, { color: palette.muted }]}>EVENTOS</Text>
        </View>

        <View style={[styles.hero, { borderBottomColor: palette.border }]}>
          <Text style={[styles.kicker, { color: palette.muted }]}>AGENDA CULTURAL · BAIXADA SANTISTA</Text>
          <Text style={[styles.heroTitle, { color: palette.brandInk }]}>Encontros que fazem a</Text>
          <Text style={[styles.heroTitleAccent, { color: palette.brandCoral }]}>cena acontecer.</Text>
          <Text style={[styles.heroDescription, { color: palette.muted }]}>
            Feiras, shows, exposições e oficinas para criar, trocar e descobrir o que movimenta a região.
          </Text>
        </View>

        <View style={[styles.filtersHeader, { borderBottomColor: palette.border }]}>
          <Text style={[styles.searchHint, { color: palette.muted }]}>O QUE ESTÁ ACONTECENDO?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
            {categorias.map((item) => {
              const ativo = filtro === item;
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => setFiltro(item)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: ativo ? palette.brandCoral : palette.brandPaper,
                      borderColor: ativo ? palette.brandCoral : palette.border,
                    },
                  ]}
                >
                  <Text style={[styles.filterChipText, { color: ativo ? palette.brandPaper : palette.brandInk }]}>
                    {item.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={[styles.calendarArea, { borderBottomColor: palette.border }]}>
          <View style={styles.calendarColumn}>
            <View style={styles.sectionLabelRow}>
              <Text style={[styles.sectionLabel, { color: palette.muted }]}>CALENDÁRIO</Text>
              <View style={styles.monthControls}>
                <TouchableOpacity onPress={() => moverMes(-1)} style={styles.controlButton}>
                  <Text style={[styles.controlText, { color: palette.brandInk }]}>‹</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => moverMes(1)} style={styles.controlButton}>
                  <Text style={[styles.controlText, { color: palette.brandInk }]}>›</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.monthTitle, { color: palette.brandInk }]}>{MESES[mes]} {ano}</Text>

            <View style={styles.weekHeader}>
              {SEMANAS.map((dia) => (
                <Text key={dia} style={[styles.weekText, { color: palette.muted }]}>{dia}</Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {diasDoMes.map((dia, index) => {
                if (!dia) return <View key={'empty-' + index} style={styles.dayCell} />;
                const selecionado = dia === diaSelecionado;
                const temEvento = datasComEvento.has(dia);
                return (
                  <TouchableOpacity
                    key={dia}
                    onPress={() => setDiaSelecionado(dia)}
                    style={[
                      styles.dayCell,
                      selecionado && { backgroundColor: palette.brandCoral },
                      temEvento && !selecionado && { backgroundColor: palette.brandBlue },
                    ]}
                  >
                    <Text style={[styles.dayText, { color: selecionado ? palette.brandPaper : palette.brandInk }]}>
                      {dia}
                    </Text>
                    {temEvento && <View style={[styles.dayDot, { backgroundColor: selecionado ? palette.brandPaper : palette.brandCoral }]} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.calendarLegend}>
              <View style={[styles.legendDot, { backgroundColor: palette.brandCoral }]} />
              <Text style={[styles.legendText, { color: palette.muted }]}>eventos confirmados</Text>
            </View>
          </View>

          <View style={styles.agendaColumn}>
            <View style={styles.sectionLabelRow}>
              <Text style={[styles.sectionLabel, { color: palette.muted }]}>PRÓXIMOS</Text>
              <Text style={[styles.eventCount, { color: palette.muted }]}>{eventosDoMes.length} eventos</Text>
            </View>
            <Text style={[styles.agendaTitle, { color: palette.brandInk }]}>Agenda do mês</Text>
            <Text style={[styles.agendaDate, { color: palette.muted }]}>
              {formatarDia(`${ano}-${String(mes + 1).padStart(2, '0')}-${String(diaSelecionado).padStart(2, '0')}`)}
            </Text>

            {eventosDoDia.length ? (
              eventosDoDia.map((evento) => (
                <TouchableOpacity
                  key={evento.id}
                  style={[styles.agendaItem, { borderTopColor: palette.border }]}
                  onPress={() => abrirEvento(evento.id)}
                >
                  <View style={styles.agendaDateBlock}>
                    <Text style={[styles.agendaDay, { color: palette.brandCoral }]}>
                      {String(new Date(evento.data + 'T12:00:00').getDate()).padStart(2, '0')}
                    </Text>
                    <Text style={[styles.agendaMeta, { color: palette.muted }]}>{evento.horario}</Text>
                  </View>
                  <View style={styles.agendaTextBlock}>
                    <Text style={[styles.agendaItemTitle, { color: palette.brandInk }]}>{evento.titulo}</Text>
                    <Text style={[styles.agendaItemMeta, { color: palette.muted }]}>
                      {evento.local} · {evento.cidade}
                    </Text>
                  </View>
                  <Text style={[styles.agendaArrow, { color: palette.muted }]}>→</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={[styles.noAgenda, { borderTopColor: palette.border }]}>
                <Text style={[styles.noAgendaText, { color: palette.muted }]}>Nenhum evento nesta data.</Text>
              </View>
            )}
          </View>
        </View>

        {eventoDestaque && (
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() => abrirEvento(eventoDestaque.id)}
            style={[styles.featured, { backgroundColor: palette.brandInk }]}
          >
            <View style={[styles.featuredDate, { borderBottomColor: palette.brandCoral }]}>
              <Text style={[styles.featuredKicker, { color: palette.muted }]}>DESTAQUE</Text>
              <Text style={[styles.featuredDay, { color: palette.brandCoral }]}>
                {String(new Date(eventoDestaque.data + 'T12:00:00').getDate()).padStart(2, '0')}
              </Text>
              <Text style={[styles.featuredDateText, { color: palette.brandPaper }]}>
                {new Intl.DateTimeFormat('pt-BR', { month: 'long', weekday: 'short' }).format(new Date(eventoDestaque.data + 'T12:00:00'))}
              </Text>
              <Text style={[styles.featuredDateText, { color: palette.muted }]}>{eventoDestaque.cidade}</Text>
            </View>

            <View style={styles.featuredBody}>
              <Text style={[styles.featuredTitle, { color: palette.brandPaper }]}>{eventoDestaque.titulo}</Text>
              <Text style={[styles.featuredDescription, { color: palette.muted }]}>{eventoDestaque.descricao}</Text>

              <View style={styles.featuredInfoRow}>
                <Text style={[styles.featuredInfo, { color: palette.brandPaper }]}>{eventoDestaque.horario}</Text>
                <Text style={[styles.featuredInfo, { color: palette.brandPaper }]}>{eventoDestaque.local}</Text>
                <Text style={[styles.featuredInfo, { color: palette.brandPaper }]}>{eventoDestaque.premium ? 'PREMIUM' : 'PÚBLICO'}</Text>
              </View>

              <View style={styles.featuredFooter}>
                <Text style={[styles.featuredLocation, { color: palette.muted }]}>{eventoDestaque.organizador}</Text>
                <View style={[styles.detailButton, { backgroundColor: palette.brandCoral }]}>
                  <Text style={[styles.detailButtonText, { color: palette.brandPaper }]}>VER DETALHES →</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 34 },
  miniHeader: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  brandLockup: { flexDirection: 'row', alignItems: 'baseline', gap: 5 },
  brand: { fontSize: 10, fontWeight: '900', letterSpacing: 0.7 },
  brandSub: { fontSize: 6, fontWeight: '800', letterSpacing: 1.1 },
  headerLabel: { fontSize: 7, fontWeight: '900', letterSpacing: 1.1 },
  hero: { paddingTop: 18, paddingBottom: 18, borderBottomWidth: 1 },
  kicker: { fontSize: 8, fontWeight: '900', letterSpacing: 1.3, marginBottom: 9 },
  heroTitle: { fontSize: 28, lineHeight: 31, fontWeight: '800', letterSpacing: -0.5 },
  heroTitleAccent: { fontSize: 28, lineHeight: 31, fontWeight: '800' },
  heroDescription: { fontSize: 9.5, lineHeight: 14, maxWidth: 290, marginTop: 10 },
  filtersHeader: { paddingTop: 12, paddingBottom: 12, borderBottomWidth: 1 },
  searchHint: { fontSize: 7, fontWeight: '900', letterSpacing: 1.05, marginBottom: 7 },
  filterContent: { paddingRight: 10, gap: 6 },
  filterChip: { minHeight: 28, paddingHorizontal: 10, justifyContent: 'center', borderWidth: 1 },
  filterChipText: { fontSize: 7.5, fontWeight: '900', letterSpacing: 0.7 },
  calendarArea: { paddingTop: 16, paddingBottom: 18, borderBottomWidth: 1, gap: 22 },
  calendarColumn: { width: '100%' },
  agendaColumn: { width: '100%' },
  sectionLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionLabel: { fontSize: 7, fontWeight: '900', letterSpacing: 1.2 },
  monthControls: { flexDirection: 'row', gap: 3 },
  controlButton: { paddingHorizontal: 5, paddingVertical: 1 },
  controlText: { fontSize: 14, fontWeight: '400' },
  monthTitle: { fontSize: 17, fontWeight: '500', marginTop: 4, marginBottom: 10 },
  weekHeader: { flexDirection: 'row', marginBottom: 4 },
  weekText: { flex: 1, textAlign: 'center', fontSize: 6.5, fontWeight: '900' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.285%', height: 30, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  dayText: { fontSize: 8, fontWeight: '700' },
  dayDot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
  calendarLegend: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  legendDot: { width: 5, height: 5, borderRadius: 3 },
  legendText: { fontSize: 7, fontWeight: '600' },
  eventCount: { fontSize: 7 },
  agendaTitle: { fontSize: 18, fontWeight: '600', marginTop: 4 },
  agendaDate: { fontSize: 8, marginTop: 3, marginBottom: 9, textTransform: 'capitalize' },
  agendaItem: { minHeight: 54, borderTopWidth: 1, paddingVertical: 9, flexDirection: 'row', alignItems: 'center' },
  agendaDateBlock: { width: 48 },
  agendaDay: { fontSize: 18, fontWeight: '900' },
  agendaMeta: { fontSize: 6.5, marginTop: 1 },
  agendaTextBlock: { flex: 1, paddingRight: 8 },
  agendaItemTitle: { fontSize: 10.5, fontWeight: '800' },
  agendaItemMeta: { fontSize: 7.5, marginTop: 2 },
  agendaArrow: { fontSize: 15 },
  noAgenda: { paddingVertical: 14, borderTopWidth: 1 },
  noAgendaText: { fontSize: 8 },
  featured: { marginTop: 18, paddingVertical: 22, paddingHorizontal: 16, flexDirection: 'column' },
  featuredDate: { paddingBottom: 14, borderBottomWidth: 1, width: '100%' },
  featuredKicker: { fontSize: 7, fontWeight: '900', letterSpacing: 1.1 },
  featuredDay: { fontSize: 42, lineHeight: 42, fontWeight: '700', marginTop: 2 },
  featuredDateText: { fontSize: 7.5, marginTop: 2 },
  featuredBody: { paddingTop: 16 },
  featuredTitle: { fontSize: 23, lineHeight: 27, fontWeight: '700' },
  featuredDescription: { fontSize: 9, lineHeight: 14, marginTop: 7, maxWidth: 310 },
  featuredInfoRow: { flexDirection: 'row', gap: 15, marginTop: 14, flexWrap: 'wrap' },
  featuredInfo: { fontSize: 7.5, fontWeight: '700' },
  featuredFooter: { marginTop: 18, gap: 12 },
  featuredLocation: { fontSize: 7 },
  detailButton: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 8 },
  detailButtonText: { fontSize: 7, fontWeight: '900', letterSpacing: 0.6 },
});