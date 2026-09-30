import { memo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';

import type { AgenteCriativo } from '@/features/agents/types/agent';
import { CATEGORIAS } from '@/shared/config/categories';
import { colors } from '@/shared/theme/colors';

type Props = { agente: AgenteCriativo; ativo: boolean; onPress: (agente: AgenteCriativo) => void };

function AgentMarkerComponent({ agente, ativo, onPress }: Props) {
  const [pronto, setPronto] = useState(false);
  const cor = CATEGORIAS[agente.categoria]?.cor ?? CATEGORIAS.design.cor;

  return (
    <Marker
      coordinate={{ latitude: agente.latitude, longitude: agente.longitude }}
      onPress={() => onPress(agente)}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={!pronto}
    >
      <View style={[styles.pinContainer, ativo && styles.pinActive]}>

        <View style={[styles.pinImageContainer, { borderColor: cor }]}>
          <Image source={{ uri: agente.avatarUrl }} style={styles.pinImage} onLoad={() => setPronto(true)} />
        </View>
        <View style={[styles.pinStatus, { backgroundColor: agente.disponivel ? cor : colors.muted }]} />
        <View style={[styles.pinTail, { borderTopColor: cor }]} />
      </View>
    </Marker>
  );
}

export const AgentMarker = memo(AgentMarkerComponent);

const styles = StyleSheet.create({
  pinContainer: { alignItems: 'center', width: 54, height: 65 },
  pinActive: { transform: [{ scale: 1.16 }] },
  pinImageContainer: { width: 44, height: 44, borderRadius: 22, borderWidth: 2.5, backgroundColor: colors.brandPaper, overflow: 'hidden', elevation: 5 },
  pinImage: { width: 40, height: 40, borderRadius: 20, alignSelf: 'center', marginTop: 2 },
  pinStatus: { position: 'absolute', right: 2, top: 0, width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: colors.brandPaper },
  pinTail: { width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 10, borderLeftColor: 'transparent', borderRightColor: 'transparent', marginTop: -1 },
});
