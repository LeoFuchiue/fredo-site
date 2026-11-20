/**
 * CNPJ: máscara, validação dos dígitos e consulta pública (BrasilAPI) para
 * preencher nome e endereço do restaurante automaticamente.
 * A consulta é feita do navegador do visitante; nada fica salvo no site.
 */

const digitos = (v: string) => v.replace(/\D/g, "");

/** 12345678000190 → 12.345.678/0001-90 */
export function mascaraCnpj(v: string): string {
  const d = digitos(v).slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

/** Confere os dois dígitos verificadores. */
export function cnpjValido(v: string): boolean {
  const d = digitos(v);
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
  const calc = (base: string) => {
    const pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const soma = base.split("").reduce((acc, n, i) => acc + Number(n) * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  const d1 = calc(d.slice(0, 12));
  const d2 = calc(d.slice(0, 12) + d1);
  return d.endsWith(`${d1}${d2}`);
}

export type DadosCnpj = {
  nome: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
};

/** Consulta o CNPJ na BrasilAPI. `null` se não encontrar ou se o serviço não responder. */
export async function buscarCnpj(v: string): Promise<DadosCnpj | null> {
  const d = digitos(v);
  if (d.length !== 14) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 7000);
  try {
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${d}`, { signal: ctrl.signal });
    if (!res.ok) return null;
    const j = (await res.json()) as Record<string, unknown>;
    const s = (k: string) => (typeof j[k] === "string" && (j[k] as string).trim() ? (j[k] as string).trim() : undefined);
    const nome = s("nome_fantasia") ?? s("razao_social");
    if (!nome) return null;
    const tipo = s("descricao_tipo_de_logradouro");
    const rua = s("logradouro");
    return {
      nome,
      cep: s("cep"),
      logradouro: rua ? (tipo && !rua.toUpperCase().startsWith(tipo.toUpperCase()) ? `${tipo} ${rua}` : rua) : undefined,
      numero: s("numero"),
      complemento: s("complemento"),
      bairro: s("bairro"),
      cidade: s("municipio"),
      uf: s("uf"),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
