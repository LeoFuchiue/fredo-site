/**
 * Revendas autorizadas fred.o, usadas na página "Encontre uma revenda" (/fredo/revendas).
 *
 * COMO CADASTRAR UMA REVENDA NOVA
 * Copie o bloco da Lefer, troque os dados e salve. A busca por CEP usa:
 *  - lat / lng: posição da loja (pegue no Google Maps: botão direito no endereço → copiar coordenadas);
 *  - raioKm: até que distância a revenda atende;
 *  - cidadesAtendidas: cidades que ela atende (usado quando o CEP do cliente não traz coordenadas).
 * O WhatsApp vai só com dígitos: 55 + DDD + número.
 *
 * Quando houver muitas revendas, esta lista pode ir para uma planilha ou banco de dados
 * sem mudar a página: basta a busca ler os dados de lá no lugar deste arquivo.
 */

export type Revenda = {
  id: string;
  nome: string;
  razaoSocial: string;
  cnpj: string;
  descricao: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  lat: number;
  lng: number;
  raioKm: number;
  cidadesAtendidas: string[];
  whatsapp: string[];
  email?: string;
  site?: string;
  instagram?: string;
};

export const revendas: Revenda[] = [
  {
    id: "lefer-atibaia",
    nome: "Lefer Automação Comercial",
    razaoSocial: "Lefer Comércio e Serviços de Informática LTDA",
    cnpj: "20.749.542/0001-79",
    descricao:
      "Softwares de gestão, equipamentos e automação comercial para bares, restaurantes, padarias, lojas e prestadores de serviço.",
    endereco: "Rua Adolfo André, 335, Sala 02",
    bairro: "Centro",
    cidade: "Atibaia",
    uf: "SP",
    cep: "12940-280",
    // Coordenadas aproximadas do endereço (centro de Atibaia).
    lat: -23.1166,
    lng: -46.5505,
    raioKm: 50,
    cidadesAtendidas: ["Atibaia"],
    whatsapp: ["5511973291391", "5511974658213"],
    email: "lefer@leferautomacao.com.br",
    site: "https://leferautomacao.com.br/",
    instagram: "https://www.instagram.com/leferautomacaocomercial/",
  },
];

/** Formata 5511973291391 como (11) 97329-1391. */
export function formatarTelefone(digitos: string): string {
  const d = digitos.replace(/\D/g, "").replace(/^55/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return digitos;
}
