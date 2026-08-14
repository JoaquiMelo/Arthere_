import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Platform, SafeAreaView } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const REGIAO_INICIAL: Region = {
  latitude: -23.5550,
  longitude: -46.6700,
  latitudeDelta: 0.045,
  longitudeDelta: 0.045,
};

export default function MapaScreen() {
  const [busca, setBusca] = useState('');

  return (
    <View style={styles.container}>
      {/* Mapa em Tela Cheia */}
      <MapView
        style={StyleSheet.absoluteFill}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={REGIAO_INICIAL}
      />

      {/* Barra de Busca Superior */}
      <SafeAreaView style={styles.searchOverlay}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar artistas, cidades..."
            placeholderTextColor="#999"
            value={busca}
            onChangeText={setBusca}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchOverlay: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 10,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111',
  },
});