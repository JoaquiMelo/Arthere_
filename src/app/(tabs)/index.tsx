import React, { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { MOCK_AGENTES } from '../../../src/data/mockData';
import { useUser } from '../../../src/context/UserContext';

export default function HomeScreen() {
  const { user } = useUser(); // Pega o usuário logado do estado local
  const [agentes] = useState(MOCK_AGENTES); // Usa a lista mockada de agentes

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: user.latitude,
        longitude: user.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {/* 1. Marker do Usuário Logado (Pin Roxo) */}
      <Marker
        coordinate={{ latitude: user.latitude, longitude: user.longitude }}
        title="Você"
        description={user.cidade}
        pinColor="purple"
      />

      {/* 2. Markers dos Agentes cadastrados no Mock (Pins Vermelhos) */}
      {agentes.map((agente) => (
        <Marker
          key={agente.id}
          coordinate={{
            latitude: agente.latitude,
            longitude: agente.longitude,
          }}
          title={agente.nome}
          description={`${agente.especialidade} - ${agente.cidade}`}
          pinColor="red"
        />
      ))}
    </MapView>
  );
}