# Arthere

Aplicativo Expo/React Native para conectar profissionais criativos a oportunidades, com uma API NestJS separada.

## Estrutura

```text
.
├── App.tsx                 # ponto de entrada mínimo
├── src/
│   ├── features/           # código por domínio de negócio
│   │   ├── agents/         # tipos, dados de exemplo e componentes de agentes
│   │   ├── auth/           # telas de autenticação e onboarding
│   │   ├── map/            # tela do mapa
│   │   ├── opportunities/  # tela de oportunidades
│   │   └── profile/        # perfil e edição de portfólio
│   ├── navigation/         # navegadores React Navigation
│   ├── providers/          # providers globais, como o usuário autenticado
│   ├── services/           # comunicação com a API
│   └── shared/             # configurações e dados reutilizáveis
└── backend/
    ├── prisma/             # schema e migrations
    └── src/                # módulos NestJS
```

## Executar o aplicativo

```bash
npm install
npm start
```

Use `npm run android`, `npm run ios` ou `npm run web` para abrir uma plataforma específica.

## Verificações

```bash
npm run lint
npx tsc --noEmit
```

## API

```bash
cd backend
npm install
npm run start:dev
```

Defina `EXPO_PUBLIC_API_URL` no arquivo `.env` da raiz para conectar o aplicativo à API local ou publicada.
