import React, { useState } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '@/shared/theme/colors';
import { useUser } from '@/providers/user-provider';
import { useTheme, PaletteName } from '@/providers/theme-provider';

type IconName = keyof typeof Ionicons.glyphMap;

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { logout } = useUser();
  const { paletteName, palette, setPalette } = useTheme();
  const [paletaAberta, setPaletaAberta] = useState(false);
  const [notificacoes, setNotificacoes] = useState(true);
  const [modoEscuro, setModoEscuro] = useState(false);
  const indisponivel = (titulo: string) => Alert.alert(titulo, 'Esta opção estará disponível em breve.');

  const sair = () => Alert.alert('Sair da conta', 'Você deseja encerrar a sessão?', [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Sair', style: 'destructive', onPress: () => { logout(); navigation.reset({ index: 0, routes: [{ name: 'Login' }] }); } },
  ]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Profile')} accessibilityLabel="Voltar"><Ionicons name="chevron-back" size={25} color={colors.text} /></TouchableOpacity>
        <Text style={[styles.headerTitle, { color: palette.text }]}>Configurações</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.groupTitle}>CONTA</Text>
        <View style={styles.card}>
          <SettingRow icon="person-outline" label="Editar perfil" onPress={() => navigation.navigate('EditProfile')} />
          <SettingRow icon="shield-checkmark-outline" label="Privacidade e segurança" onPress={() => indisponivel('Privacidade e segurança')} />
          <SettingRow icon="notifications-outline" label="Notificações" last right={<Switch value={notificacoes} onValueChange={setNotificacoes} trackColor={{ false: colors.secondary, true: colors.primary }} thumbColor={colors.white} />} />
        </View>

        <Text style={styles.groupTitle}>APARÊNCIA</Text>
        <View style={styles.card}>
          <SettingRow icon="moon-outline" label="Modo escuro" right={<Switch value={modoEscuro} onValueChange={setModoEscuro} trackColor={{ false: colors.secondary, true: colors.primary }} thumbColor={colors.white} />} />
          <SettingRow icon="color-palette-outline" label="Paleta de cores" last onPress={() => setPaletaAberta(true)} right={<View style={styles.swatches}><View style={[styles.swatch, { backgroundColor: palette.primary }]} /><View style={[styles.swatch, { backgroundColor: palette.danger }]} /><View style={[styles.swatch, { backgroundColor: palette.accent }]} /><Ionicons name="chevron-forward" size={18} color={palette.muted}/></View>} />
        </View>

        <Text style={styles.groupTitle}>SUPORTE</Text>
        <View style={styles.card}>
          <SettingRow icon="help-circle-outline" label="Ajuda e suporte" onPress={() => indisponivel('Ajuda e suporte')} />
          <SettingRow icon="document-text-outline" label="Termos e políticas" onPress={() => indisponivel('Termos e políticas')} last />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={sair}><Ionicons name="log-out-outline" size={19} color={colors.danger} /><Text style={styles.logoutText}>Sair da conta</Text></TouchableOpacity>
        <Text style={styles.version}>Arthere · versão 1.0.0</Text>
      </ScrollView>

      <Modal visible={paletaAberta} transparent animationType="slide" onRequestClose={() => setPaletaAberta(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.paletteCard, { backgroundColor: palette.white }]}>
            <Text style={[styles.paletteTitle, { color: palette.text }]}>Escolha sua paleta</Text>
            {(['Arthere','Oceano','Ameixa'] as PaletteName[]).map((nome) => {
              const selecionada = nome === paletteName;
              const cores = nome === 'Arthere' ? ['#D75103','#F00817','#FCC12E'] : nome === 'Oceano' ? ['#087F8C','#D64545','#F2C14E'] : ['#8A3D72','#C83D58','#E4B84A'];
              return <TouchableOpacity key={nome} style={[styles.paletteOption,{borderColor:selecionada?palette.primary:palette.border,backgroundColor:selecionada?palette.surface:palette.white}]} onPress={() => { setPalette(nome); setPaletaAberta(false); }}>
                <View style={styles.paletteDots}>{cores.map((cor) => <View key={cor} style={[styles.paletteDot,{backgroundColor:cor}]} />)}</View>
                <Text style={[styles.paletteName,{color:palette.text}]}>{nome}</Text>
                {selecionada && <Ionicons name="checkmark-circle" size={22} color={palette.primary}/>}
              </TouchableOpacity>;
            })}
          </View>
        </View>
      </Modal>    </SafeAreaView>
  );
}

function SettingRow({ icon, label, onPress, right, last }: { icon: IconName; label: string; onPress?: () => void; right?: React.ReactNode; last?: boolean }) {
  return (
    <TouchableOpacity style={[styles.row, !last && styles.rowBorder]} onPress={onPress} disabled={!onPress} activeOpacity={onPress ? 0.7 : 1}>
      <View style={styles.rowIcon}><Ionicons name={icon} size={20} color={colors.primaryDark} /></View>
      <Text style={styles.rowText}>{label}</Text>
      {right ?? (onPress && <Ionicons name="chevron-forward" size={19} color={colors.muted} />)}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background }, header: { height: 58, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, backButton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }, headerTitle: { color: colors.text, fontSize: 17, fontWeight: '800' }, headerSpacer: { width: 38 }, content: { padding: 20, paddingTop: 12, paddingBottom: 42 },
  groupTitle: { marginTop: 18, marginBottom: 8, color: colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 0.7 }, card: { borderRadius: 12, backgroundColor: colors.surface, paddingHorizontal: 14 }, row: { minHeight: 58, flexDirection: 'row', alignItems: 'center' }, rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border }, rowIcon: { width: 33, alignItems: 'flex-start' }, rowText: { flex: 1, color: colors.text, fontSize: 14, fontWeight: '600' }, swatches: { flexDirection: 'row', gap: 4 }, swatch: { width: 15, height: 15, borderRadius: 8 },
  logoutButton: { height: 50, marginTop: 33, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: colors.danger, backgroundColor: colors.white }, logoutText: { color: colors.danger, fontSize: 14, fontWeight: '800' }, version: { marginTop: 17, textAlign: 'center', color: colors.muted, fontSize: 11 }, modalOverlay:{flex:1,backgroundColor:'rgba(0,0,0,.4)',justifyContent:'flex-end'},paletteCard:{padding:20,borderTopLeftRadius:22,borderTopRightRadius:22},paletteTitle:{fontSize:19,fontWeight:'900',marginBottom:15},paletteOption:{minHeight:60,borderWidth:1.5,borderRadius:14,paddingHorizontal:15,marginBottom:10,flexDirection:'row',alignItems:'center',gap:12},paletteDots:{flexDirection:'row',gap:5},paletteDot:{width:18,height:18,borderRadius:9},paletteName:{flex:1,fontSize:15,fontWeight:'800'},
});
