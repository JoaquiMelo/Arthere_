import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { MOCK_EVENTOS } from '../types/event';

export default function EventsScreen() {
  const [filtro, setFiltro] = useState<'TODOS' | 'PREMIUM'>('TODOS');
  const eventos = useMemo(() => MOCK_EVENTOS.filter((e) => filtro === 'TODOS' || e.premium), [filtro]);

  return <SafeAreaView style={styles.container}><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.eyebrow}>AGENDA REGIONAL</Text><Text style={styles.title}>Eventos da região</Text>
    <Text style={styles.subtitle}>Feiras, oficinas, shows, exposições e oportunidades culturais perto de você.</Text>
    <View style={styles.filters}>
      <TouchableOpacity style={[styles.filter, filtro === 'TODOS' && styles.active]} onPress={() => setFiltro('TODOS')}><Text style={[styles.filterText, filtro === 'TODOS' && styles.activeText]}>Todos</Text></TouchableOpacity>
      <TouchableOpacity style={[styles.filter, filtro === 'PREMIUM' && styles.active]} onPress={() => setFiltro('PREMIUM')}><Ionicons name="star" size={15} color={filtro === 'PREMIUM' ? colors.white : colors.orange}/><Text style={[styles.filterText, filtro === 'PREMIUM' && styles.activeText]}>Premium</Text></TouchableOpacity>
    </View>
    <View style={styles.section}><Ionicons name="calendar-outline" size={19} color={colors.primaryDark}/><Text style={styles.sectionTitle}>Próximos eventos</Text></View>
    {eventos.map((e) => <View key={e.id} style={[styles.card, e.premium && styles.premiumCard]}>
      <View style={styles.dateBox}><Text style={styles.day}>{new Date(e.data + 'T12:00:00').getDate()}</Text><Text style={styles.month}>{new Intl.DateTimeFormat('pt-BR',{month:'short'}).format(new Date(e.data+'T12:00:00')).replace('.','').toUpperCase()}</Text></View>
      <View style={styles.body}><View style={styles.row}><Text style={styles.category}>{e.categoria}</Text>{e.premium && <View style={styles.badge}><Ionicons name="star" size={11} color={colors.white}/><Text style={styles.badgeText}>PREMIUM</Text></View>}</View>
      <Text style={styles.eventTitle}>{e.titulo}</Text><Text style={styles.description}>{e.descricao}</Text>
      <View style={styles.info}><Ionicons name="location-outline" size={14} color={colors.muted}/><Text style={styles.infoText}>{e.local} · {e.cidade}</Text></View>
      <View style={styles.info}><Ionicons name="time-outline" size={14} color={colors.muted}/><Text style={styles.infoText}>{e.horario} · {e.organizador}</Text></View></View>
    </View>)}
  </ScrollView></SafeAreaView>;
}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:colors.background},content:{padding:20,paddingBottom:40},eyebrow:{fontSize:11,fontWeight:'900',letterSpacing:1.4,color:colors.orange},title:{fontSize:28,fontWeight:'900',color:colors.text,marginTop:5},subtitle:{fontSize:14,lineHeight:21,color:colors.muted,marginTop:7},filters:{flexDirection:'row',gap:10,marginTop:20},filter:{height:38,paddingHorizontal:17,borderRadius:20,borderWidth:1,borderColor:colors.border,backgroundColor:colors.white,flexDirection:'row',alignItems:'center',gap:6},active:{backgroundColor:colors.primaryDark,borderColor:colors.primaryDark},filterText:{fontSize:13,fontWeight:'800',color:colors.text},activeText:{color:colors.white},section:{flexDirection:'row',alignItems:'center',gap:8,marginTop:26,marginBottom:12},sectionTitle:{fontSize:17,fontWeight:'900',color:colors.text},card:{backgroundColor:colors.white,borderRadius:16,borderWidth:1,borderColor:colors.border,padding:13,flexDirection:'row',marginBottom:12},premiumCard:{borderColor:colors.orange,borderWidth:1.5},dateBox:{width:55,height:65,borderRadius:12,backgroundColor:colors.surfaceStrong,alignItems:'center',justifyContent:'center',marginRight:12},day:{fontSize:22,fontWeight:'900',color:colors.primaryDark},month:{fontSize:10,fontWeight:'900',color:colors.muted},body:{flex:1},row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},category:{fontSize:10,fontWeight:'900',color:colors.primaryDark,textTransform:'uppercase'},badge:{backgroundColor:colors.orange,borderRadius:10,paddingHorizontal:7,paddingVertical:4,flexDirection:'row',alignItems:'center',gap:3},badgeText:{fontSize:8,fontWeight:'900',color:colors.white},eventTitle:{fontSize:16,fontWeight:'900',color:colors.text,marginTop:5},description:{fontSize:12,color:colors.muted,lineHeight:17,marginTop:4},info:{flexDirection:'row',alignItems:'center',gap:5,marginTop:6},infoText:{fontSize:11,color:colors.muted,flex:1}});
