/**
 * Área de atendimento das revendas autorizadas fred.o.
 *
 * O site NÃO mostra dados das revendas (nome, telefone, endereço, e-mail).
 * Esta lista serve só para avisar ao restaurante se já existe revenda na região dele.
 * O pedido do restaurante vai para o WhatsApp da fred.o, que repassa para a revenda certa.
 * Os contatos das revendas ficam com a equipe fred.o, fora do site.
 *
 * COMO CADASTRAR UMA ÁREA NOVA
 * Copie o bloco abaixo e troque os dados:
 *  - lat / lng: centro da área atendida (Google Maps: botão direito → copiar coordenadas);
 *  - raioKm: até que distância a revenda atende;
 *  - cidadesAtendidas: cidades atendidas (usado quando o CEP do cliente não traz coordenadas).
 */

export type AreaRevenda = {
  /** Identificação interna (não aparece no site). */
  id: string;
  cidade: string;
  uf: string;
  cep: string;
  lat: number;
  lng: number;
  raioKm: number;
  cidadesAtendidas: string[];
};

export const revendas: AreaRevenda[] = [
  {
    id: "revenda-atibaia-01",
    cidade: "Atibaia",
    uf: "SP",
    cep: "12940-280",
    lat: -23.1166,
    lng: -46.5505,
    raioKm: 50,
    cidadesAtendidas: ["Atibaia"],
  },
];
