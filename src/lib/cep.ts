/**
 * Busca de revendas pelo CEP do cliente.
 *
 * 1. Consulta o CEP na BrasilAPI (cidade, UF e, quando houver, coordenadas).
 *    Se ela falhar, usa o ViaCEP (cidade e UF).
 * 2. Com coordenadas: calcula a distância até cada revenda e mostra as que atendem no raio.
 *    Sem coordenadas: mostra as revendas que atendem a cidade do cliente.
 * 3. Se nenhuma atender, sugere as revendas do mesmo estado.
 *
 * O CEP só é usado nesta consulta; nada fica salvo no site.
 */

import type { Revenda } from "@/content/revendas";

export type LocalCep = {
  cep: string;
  cidade: string;
  uf: string;
  bairro?: string;
  lat?: number;
  lng?: number;
};

export type RevendaEncontrada = { revenda: Revenda; distanciaKm?: number };

export type ResultadoBusca = {
  local: LocalCep;
  /** Revendas que atendem o endereço do cliente, da mais próxima para a mais distante. */
  proximas: RevendaEncontrada[];
  /** Revendas do mesmo estado (mostradas só quando não há nenhuma próxima). */
  mesmoEstado: RevendaEncontrada[];
};

export const somenteDigitos = (v: string) => v.replace(/\D/g, "");

/** 12940280 → 12940-280 (formata enquanto a pessoa digita). */
export function mascaraCep(v: string): string {
  const d = somenteDigitos(v).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

async function getJson(url: string, ms = 6000): Promise<unknown> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function numero(v: unknown): number | undefined {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number.parseFloat(v) : Number.NaN;
  return Number.isFinite(n) && n !== 0 ? n : undefined;
}

/** Retorna cidade, UF e (quando existir) coordenadas do CEP. `null` = CEP não encontrado. */
export async function buscarCep(cep: string): Promise<LocalCep | null> {
  const d = somenteDigitos(cep);
  if (d.length !== 8) return null;

  type BrasilApi = {
    city?: string;
    state?: string;
    neighborhood?: string;
    location?: { coordinates?: { latitude?: string; longitude?: string } };
  };
  const b = (await getJson(`https://brasilapi.com.br/api/cep/v2/${d}`)) as BrasilApi | null;
  if (b?.city && b?.state) {
    return {
      cep: d,
      cidade: b.city,
      uf: b.state,
      bairro: b.neighborhood || undefined,
      lat: numero(b.location?.coordinates?.latitude),
      lng: numero(b.location?.coordinates?.longitude),
    };
  }

  type ViaCep = { localidade?: string; uf?: string; bairro?: string; erro?: boolean | string };
  const v = (await getJson(`https://viacep.com.br/ws/${d}/json/`)) as ViaCep | null;
  if (v && !v.erro && v.localidade && v.uf) {
    return { cep: d, cidade: v.localidade, uf: v.uf, bairro: v.bairro || undefined };
  }
  return null;
}

/** Distância em linha reta entre dois pontos, em km. */
export function distanciaKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Compara nomes de cidade sem acento, maiúsculas ou espaços extras. */
export const normalizar = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

export function encontrarRevendas(local: LocalCep, lista: Revenda[]): ResultadoBusca {
  const cidade = normalizar(local.cidade);
  const temCoords = local.lat !== undefined && local.lng !== undefined;

  const proximas: RevendaEncontrada[] = [];
  const mesmoEstado: RevendaEncontrada[] = [];

  for (const revenda of lista) {
    const distancia = temCoords ? distanciaKm(local.lat!, local.lng!, revenda.lat, revenda.lng) : undefined;
    const atendeCidade =
      normalizar(revenda.cidade) === cidade || revenda.cidadesAtendidas.some((c) => normalizar(c) === cidade);
    const dentroDoRaio = distancia !== undefined && distancia <= revenda.raioKm;

    if (atendeCidade || dentroDoRaio) proximas.push({ revenda, distanciaKm: distancia });
    else if (revenda.uf.toUpperCase() === local.uf.toUpperCase()) mesmoEstado.push({ revenda, distanciaKm: distancia });
  }

  // Ordena pela distância; sem coordenadas, pela proximidade numérica do CEP.
  const cepCliente = Number(local.cep);
  const chave = (r: RevendaEncontrada) =>
    r.distanciaKm ?? Math.abs(Number(somenteDigitos(r.revenda.cep)) - cepCliente) / 1000;
  proximas.sort((a, b) => chave(a) - chave(b));
  mesmoEstado.sort((a, b) => chave(a) - chave(b));

  return { local, proximas, mesmoEstado };
}
