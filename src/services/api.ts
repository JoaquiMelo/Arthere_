import AsyncStorage from "@react-native-async-storage/async-storage";

// Para um celular físico, troque localhost pelo IP do computador na rede Wi-Fi.
// Expo Web ou iOS Simulator
// Celular físico
export const API_URL = 'http://192.168.10.173:3000';

type AuthResponse = {
  access_token: string;
  usuario: {
    id: string;
    email: string;
    tipo: string;
    perfil: unknown;
  };
};

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.message ?? "Não foi possível concluir a operação.");
  }

  return body as T;
}

export async function login(email: string, senha: string) {
  const result = await request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });

  await AsyncStorage.setItem("access_token", result.access_token);
  await AsyncStorage.setItem("usuario", JSON.stringify(result.usuario));
  return result;
}

export async function register(data: {
  nome: string;
  email: string;
  senha: string;
  tipo: "AGENTE" | "CONTRATANTE";
}) {
  const result = await request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  await AsyncStorage.setItem("access_token", result.access_token);
  await AsyncStorage.setItem("usuario", JSON.stringify(result.usuario));
  return result;
}
