import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import type { RootStackParamList } from '../../../navigation/app-navigator';
import { useTheme } from '@/providers/theme-provider';
import { MOCK_EVENTOS } from '../types/event';

type Filtro = 'TODOS' | 'PREMIUM' | string;

const MESES = [
  'JANEIRO',
  'FEVEREIRO',
  'MARÇO',
  'ABRIL',
  'MAIO',
  'JUNHO',
  'JULHO',
  'AGOSTO',
  'SETEMBRO',
  'OUTUBRO',
  'NOVEMBRO',
  'DEZEMBRO',
];

const SEMANAS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

function dataDoEvento(data: string) {
  return new Date(data + 'T12:00:00');
}

function formatarDia(data: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'long',
  })
    .format(dataDoEvento(data))
    .replace('.', '');
}

export default function EventsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Events'>>();
  const { palette } = useTheme();

  const primeiroEvento = MOCK_EVENTOS[0];
  const dataInicial = dataDoEvento(primeiroEvento.data);

  const [filtro, setFiltro] = useState<Filtro>('TODOS');
  const [busca, setBusca] = useState('');
  const [ano, setAno] = useState(dataInicial.getFullYear());
  const [mes, setMes] = useState(dataInicial.getMonth());
  const [diaSelecionado, setDiaSelecionado] = useState(dataInicial.getDate());

  const categorias = useMemo(() => {
    const unicas = Array.from(new Set(MOCK_EVENTOS.map((evento) => evento.categoria)));
    return ['TODOS', ...unicas, 'PREMIUM'];
  }, []);

  const eventosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return MOCK_EVENTOS.filter((evento) => {
      const atendeFiltro =
        filtro === 'TODOS'
          ? true
          : filtro === 'PREMIUM'
            ? evento.premium
            : evento.categoria === filtro;

      if (!atendeFiltro) return false;
      if (!termo) return true;

      return [
        evento.titulo,
        evento.categoria,
        evento.descricao,
        evento.local,
        evento.cidade,
        evento.organizador,
      ].some((campo) => campo.toLowerCase().includes(termo));
    });
  }, [busca, filtro]);

  const eventosDoMes = useMemo(
    () =>
      eventosFiltrados.filter((evento) => {
        const data = dataDoEvento(evento.data);
        return data.getFullYear() === ano && data.getMonth() === mes;
      }),
    [ano, mes, eventosFiltrados]
  );

  const eventosDoDia = useMemo(
    () =>
      eventosDoMes.filter((evento) => dataDoEvento(evento.data).getDate() === diaSelecionado),
    [diaSelecionado, eventosDoMes]
  );

  const eventosDestaque = useMemo(
    () => MOCK_EVENTOS.filter((evento) => evento.destaque),
    []
  );

  const diasDoMes = useMemo(() => {
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();

    return [
      ...Array(primeiroDia).fill(null),
      ...Array.from({ length: totalDias }, (_, index) => index + 1),
    ];
  }, [ano, mes]);

  const datasComEvento = useMemo(
    () =>
      new Set(
        eventosDoMes.map((evento) => dataDoEvento(evento.data).getDate())
      ),
    [eventosDoMes]
  );

  const moverMes = (delta: number) => {
    const novaData = new Date(ano, mes + delta, 1);
    setAno(novaData.getFullYear());
    setMes(novaData.getMonth());
    setDiaSelecionado(1);
  };

  const abrirEvento = (eventId: string) => {
    navigation.navigate('EventDetails', { eventId });
  };

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

        <View style={[styles.searchSection, { borderBottomColor: palette.border }]}>
          <Text style={[styles.searchHint, { color: palette.muted }]}>PESQUISAR NA AGENDA</Text>
          <View style={[styles.searchBox, { backgroundColor: palette.brandPaper, borderColor: palette.brandInk }]}>
            <Ionicons name="search-outline" size={20} color={palette.brandInk} />
            <TextInput
              value={busca}
              onChangeText={setBusca}
              placeholder="Nome, cidade, categoria ou local"
              placeholderTextColor={palette.muted}
              style={[styles.searchInput, { color: palette.brandInk }]}
              returnKeyType="search"
            />
            {!!busca && (
              <TouchableOpacity onPress={() => setBusca('')} style={styles.clearSearch}>
                <Ionicons name="close" size={18} color={palette.muted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={[styles.filtersHeader, { borderBottomColor: palette.border }]}>
          <Text style={[styles.searchHint, { color: palette.muted }]}>FILTRAR EVENTOS</Text>
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
                  {item === 'PREMIUM' && (
                    <Ionicons
                      name="star"
                      size={14}
                      color={ativo ? palette.brandPaper : palette.brandGreen}
                    />
                  )}
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: ativo ? palette.brandPaper : palette.brandInk },
                    ]}
                  >
                    {item.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={[styles.calendarArea, { borderBottomColor: palette.border }]}>
          <View style={styles.sectionLabelRow}>
            <View>
              <Text style={[styles.sectionLabel, { color: palette.muted }]}>CALENDÁRIO</Text>
              <Text style={[styles.monthTitle, { color: palette.brandInk }]}>
                {MESES[mes]} {ano}
              </Text>
            </View>

            <View style={styles.monthControls}>
              <TouchableOpacity
                onPress={() => moverMes(-1)}
                style={[styles.controlButton, { borderColor: palette.border, backgroundColor: palette.brandPaper }]}
              >
                <Text style={[styles.controlText, { color: palette.brandInk }]}>‹</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => moverMes(1)}
                style={[styles.controlButton, { borderColor: palette.border, backgroundColor: palette.brandPaper }]}
              >
                <Text style={[styles.controlText, { color: palette.brandInk }]}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.weekHeader}>
            {SEMANAS.map((dia) => (
              <Text key={dia} style={[styles.weekText, { color: palette.muted }]}>
                {dia}
              </Text>
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
                    selecionado && {
                      backgroundColor: palette.brandCoral,
                      borderColor: palette.brandCoral,
                    },
                    temEvento &&
                      !selecionado && {
                        backgroundColor: palette.brandBlue,
                        borderColor: palette.brandBlue,
                      },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      {
                        color: selecionado ? palette.brandPaper : palette.brandInk,
                      },
                    ]}
                  >
                    {dia}
                  </Text>
                  {temEvento && (
                    <View
                      style={[
                        styles.dayDot,
                        {
                          backgroundColor: selecionado
                            ? palette.brandPaper
                            : palette.brandCoral,
                        },
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.calendarLegend}>
            <View style={[styles.legendDot, { backgroundColor: palette.brandCoral }]} />
            <Text style={[styles.legendText, { color: palette.muted }]}>
              dias com eventos
            </Text>
          </View>
        </View>

        <View style={styles.agendaSection}>
          <View style={styles.sectionLabelRow}>
            <View>
              <Text style={[styles.sectionLabel, { color: palette.muted }]}>PRÓXIMOS</Text>
              <Text style={[styles.agendaTitle, { color: palette.brandInk }]}>Agenda do mês</Text>
            </View>
            <Text style={[styles.eventCount, { color: palette.muted }]}>
              {eventosDoMes.length} {eventosDoMes.length === 1 ? 'evento' : 'eventos'}
            </Text>
          </View>

          <Text style={[styles.agendaDate, { color: palette.muted }]}>
            {formatarDia(
              `${ano}-${String(mes + 1).padStart(2, '0')}-${String(diaSelecionado).padStart(2, '0')}`
            )}
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
                    {String(dataDoEvento(evento.data).getDate()).padStart(2, '0')}
                  </Text>
                  <Text style={[styles.agendaMeta, { color: palette.muted }]}>{evento.horario}</Text>
                </View>

                <View style={styles.agendaTextBlock}>
                  <View style={styles.agendaTitleRow}>
                    <Text style={[styles.agendaItemTitle, { color: palette.brandInk }]}>
                      {evento.titulo}
                    </Text>
                    {evento.premium && (
                      <Ionicons name="star" size={14} color={palette.brandGreen} />
                    )}
                  </View>
                  <Text style={[styles.agendaItemMeta, { color: palette.muted }]}>
                    {evento.categoria} · {evento.local} · {evento.cidade}
                  </Text>
                </View>

                <Text style={[styles.agendaArrow, { color: palette.muted }]}>→</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={[styles.noAgenda, { borderTopColor: palette.border }]}>
              <Text style={[styles.noAgendaText, { color: palette.muted }]}>
                Nenhum evento nesta data.
              </Text>
            </View>
          )}

          {!!busca && (
            <View style={[styles.searchResultLine, { backgroundColor: palette.brandSand }]}>
              <Text style={[styles.searchResultText, { color: palette.brandInk }]}>
                {eventosFiltrados.length} resultado{eventosFiltrados.length === 1 ? '' : 's'} para “{busca}”
              </Text>
            </View>
          )}

          <Text style={[styles.allEventsLabel, { color: palette.muted }]}>TODOS OS EVENTOS DA BUSCA</Text>
          {eventosFiltrados.map((evento) => (
            <TouchableOpacity
              key={'all-' + evento.id}
              onPress={() => abrirEvento(evento.id)}
              style={[styles.eventListItem, { borderTopColor: palette.border }]}
            >
              <View style={[styles.smallDate, { backgroundColor: evento.premium ? palette.brandSand : palette.brandBlue }]}>
                <Text style={[styles.smallDateDay, { color: palette.brandInk }]}>
                  {String(dataDoEvento(evento.data).getDate()).padStart(2, '0')}
                </Text>
                <Text style={[styles.smallDateMonth, { color: palette.brandInk }]}>
                  {MESES[dataDoEvento(evento.data).getMonth()].slice(0, 3)}
                </Text>
              </View>

              <View style={styles.eventListBody}>
                <View style={styles.agendaTitleRow}>
                  <Text style={[styles.eventListTitle, { color: palette.brandInk }]}>{evento.titulo}</Text>
                  {evento.destaque && (
                    <View style={[styles.fixedTag, { backgroundColor: palette.brandInk }]}>
                      <Ionicons name="pin" size={11} color={palette.brandPaper} />
                      <Text style={[styles.fixedTagText, { color: palette.brandPaper }]}>FIXADO</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.eventListMeta, { color: palette.muted }]}>
                  {evento.categoria} · {evento.local} · {evento.cidade}
                </Text>
                <Text style={[styles.eventListTime, { color: palette.brandCoral }]}>
                  {evento.horario} · {evento.organizador}
                </Text>
              </View>

              <Text style={[styles.agendaArrow, { color: palette.muted }]}>→</Text>
            </TouchableOpacity>
          ))}

          {!eventosFiltrados.length && (
            <View style={[styles.empty, { backgroundColor: palette.brandPaper, borderColor: palette.border }]}>
              <Ionicons name="search-outline" size={34} color={palette.brandCoral} />
              <Text style={[styles.emptyTitle, { color: palette.brandInk }]}>Nenhum evento encontrado</Text>
              <Text style={[styles.emptyText, { color: palette.muted }]}>
                Tente outro termo ou remova alguns filtros.
              </Text>
            </View>
          )}
        </View>

        {eventosDestaque.length > 0 && (
          <View style={styles.highlightsSection}>
            <View style={styles.sectionLabelRow}>
              <View>
                <Text style={[styles.sectionLabel, { color: palette.muted }]}>EM EVIDÊNCIA</Text>
                <Text style={[styles.highlightsTitle, { color: palette.brandInk }]}>Destaques fixados</Text>
              </View>
              <Ionicons name="pin" size={18} color={palette.brandCoral} />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.highlightContent}>
              {eventosDestaque.map((evento) => (
                <TouchableOpacity
                  key={'highlight-' + evento.id}
                  activeOpacity={0.92}
                  onPress={() => abrirEvento(evento.id)}
                  style={[styles.featured, { backgroundColor: palette.brandInk }]}
                >
                  <View style={styles.featuredTop}>
                    <View>
                      <Text style={[styles.featuredKicker, { color: palette.muted }]}>FIXADO</Text>
                      <Text style={[styles.featuredDay, { color: palette.brandCoral }]}>
                        {String(dataDoEvento(evento.data).getDate()).padStart(2, '0')}
                      </Text>
                      <Text style={[styles.featuredDateText, { color: palette.brandPaper }]}>
                        {MESES[dataDoEvento(evento.data).getMonth()]}
                      </Text>
                    </View>
                    <View style={[styles.pinBadge, { backgroundColor: palette.brandCoral }]}>
                      <Ionicons name="pin" size={13} color={palette.brandPaper} />
                    </View>
                  </View>

                  <View style={[styles.featuredDivider, { backgroundColor: palette.brandCoral }]} />
                  <Text style={[styles.featuredTitle, { color: palette.brandPaper }]}>{evento.titulo}</Text>
                  <Text style={[styles.featuredDescription, { color: palette.muted }]}>
                    {evento.descricao}
                  </Text>

                  <View style={styles.featuredInfoRow}>
                    <Text style={[styles.featuredInfo, { color: palette.brandPaper }]}>{evento.horario}</Text>
                    <Text style={[styles.featuredInfo, { color: palette.brandPaper }]}>{evento.local}</Text>
                  </View>

                  <View style={styles.featuredFooter}>
                    <Text style={[styles.featuredLocation, { color: palette.muted }]}>{evento.cidade}</Text>
                    <View style={[styles.detailButton, { backgroundColor: palette.brandCoral }]}>
                      <Text style={[styles.detailButtonText, { color: palette.brandPaper }]}>
                        VER DETALHES →
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 42 },

  miniHeader: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  brandLockup: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  brand: { fontSize: 13, fontWeight: '900', letterSpacing: 0.8 },
  brandSub: { fontSize: 7, fontWeight: '800', letterSpacing: 1.2 },
  headerLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },

  hero: { paddingTop: 24, paddingBottom: 22, borderBottomWidth: 1 },
  kicker: { fontSize: 9, fontWeight: '900', letterSpacing: 1.4, marginBottom: 10 },
  heroTitle: { fontSize: 31, lineHeight: 36, fontWeight: '800', letterSpacing: -0.6 },
  heroTitleAccent: { fontSize: 31, lineHeight: 36, fontWeight: '800' },
  heroDescription: { fontSize: 12, lineHeight: 18, maxWidth: 340, marginTop: 12 },

  searchSection: { paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1 },
  searchHint: { fontSize: 9, fontWeight: '900', letterSpacing: 1.15, marginBottom: 8 },
  searchBox: {
    minHeight: 52,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    paddingVertical: 11,
  },
  clearSearch: { padding: 5 },

  filtersHeader: { paddingTop: 14, paddingBottom: 14, borderBottomWidth: 1 },
  filterContent: { paddingRight: 10, gap: 8 },
  filterChip: {
    minHeight: 40,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    borderWidth: 1.5,
  },
  filterChipText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.75 },

  calendarArea: { paddingTop: 20, paddingBottom: 22, borderBottomWidth: 1 },
  sectionLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 1.3 },
  monthTitle: { fontSize: 22, fontWeight: '500', marginTop: 5 },
  monthControls: { flexDirection: 'row', gap: 7 },
  controlButton: {
    width: 40,
    height: 40,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlText: { fontSize: 23, lineHeight: 26, fontWeight: '400' },

  weekHeader: { flexDirection: 'row', marginTop: 18, marginBottom: 8 },
  weekText: { flex: 1, textAlign: 'center', fontSize: 8, fontWeight: '900' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: '14.285%',
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayText: { fontSize: 11, fontWeight: '700' },
  dayDot: { width: 5, height: 5, borderRadius: 3, marginTop: 3 },
  calendarLegend: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 11 },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  legendText: { fontSize: 8, fontWeight: '600' },

  agendaSection: { paddingTop: 22 },
  agendaTitle: { fontSize: 22, fontWeight: '600', marginTop: 5 },
  agendaDate: { fontSize: 10, marginTop: 5, marginBottom: 12, textTransform: 'capitalize' },
  eventCount: { fontSize: 9, fontWeight: '700' },
  agendaItem: {
    minHeight: 70,
    borderTopWidth: 1,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },
  agendaDateBlock: { width: 58 },
  agendaDay: { fontSize: 22, fontWeight: '900' },
  agendaMeta: { fontSize: 8, marginTop: 2 },
  agendaTextBlock: { flex: 1, paddingRight: 8 },
  agendaTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  agendaItemTitle: { fontSize: 13, fontWeight: '800', flexShrink: 1 },
  agendaItemMeta: { fontSize: 9, marginTop: 4, lineHeight: 13 },
  agendaArrow: { fontSize: 18 },
  noAgenda: { paddingVertical: 16, borderTopWidth: 1 },
  noAgendaText: { fontSize: 10 },

  searchResultLine: { marginTop: 12, padding: 10 },
  searchResultText: { fontSize: 9, fontWeight: '800' },
  allEventsLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 1.2, marginTop: 22, marginBottom: 7 },

  eventListItem: {
    minHeight: 82,
    borderTopWidth: 1,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  smallDate: {
    width: 54,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallDateDay: { fontSize: 22, fontWeight: '900' },
  smallDateMonth: { fontSize: 8, fontWeight: '900', marginTop: 2 },
  eventListBody: { flex: 1 },
  eventListTitle: { fontSize: 13, lineHeight: 17, fontWeight: '800', flex: 1 },
  eventListMeta: { fontSize: 8.5, marginTop: 4, lineHeight: 13 },
  eventListTime: { fontSize: 8.5, fontWeight: '800', marginTop: 5 },
  fixedTag: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  fixedTagText: { fontSize: 7, fontWeight: '900', letterSpacing: 0.6 },

  empty: { marginTop: 10, borderWidth: 1.5, padding: 24, alignItems: 'center' },
  emptyTitle: { fontSize: 17, fontWeight: '900', marginTop: 11 },
  emptyText: { marginTop: 6, fontSize: 11, lineHeight: 17, textAlign: 'center' },

  highlightsSection: { marginTop: 28 },
  highlightsTitle: { fontSize: 22, fontWeight: '600', marginTop: 5 },
  highlightContent: { paddingTop: 13, paddingRight: 16, gap: 12 },
  featured: {
    width: 300,
    paddingVertical: 20,
    paddingHorizontal: 17,
  },
  featuredTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  featuredKicker: { fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
  featuredDay: { fontSize: 48, lineHeight: 50, fontWeight: '700', marginTop: 2 },
  featuredDateText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.4 },
  pinBadge: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredDivider: { height: 2, width: 54, marginTop: 14, marginBottom: 13 },
  featuredTitle: { fontSize: 21, lineHeight: 26, fontWeight: '700' },
  featuredDescription: { fontSize: 10, lineHeight: 15, marginTop: 8 },
  featuredInfoRow: { flexDirection: 'row', gap: 15, marginTop: 15, flexWrap: 'wrap' },
  featuredInfo: { fontSize: 9, fontWeight: '700' },
  featuredFooter: { marginTop: 18, gap: 12 },
  featuredLocation: { fontSize: 8.5 },
  detailButton: { alignSelf: 'flex-start', paddingHorizontal: 11, paddingVertical: 9 },
  detailButtonText: { fontSize: 8, fontWeight: '900', letterSpacing: 0.7 },
});