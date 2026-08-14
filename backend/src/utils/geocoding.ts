export async function enderecoParaCoordenadas(
  endereco: string,
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const query = encodeURIComponent(endereco);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=br`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Arthere-TCC/1.0 (contato@arthere.com.br)' },
    });
    const data = await res.json();
    if (!data?.length) return null;
    return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}
