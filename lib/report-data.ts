export interface ReportHeader {
  sinistro: string
  regulador: string
  perito: string
  cidade: string
  marca: string
  modelo: string
  placa: string
  oficina: string
  data: string
  horaChegada: string
  estado: string
  agenteCausa: string
  motivo: string
}

export interface PecaGlosada {
  id: string
  quantidade: number
  codigoPeca: string
  descricao: string
  valorBrutoUnitario: number
  desconto: number
  valorLiquidoTotal: number
  valorLiquidoNegociado: number
}

export interface MaoDeObraItem {
  tipo: "servicos_gerais" | "pintura" | "recuperacao"
  label: string
  valorHora: number
  horas: number
  valor: number
}

export interface MaoDeObraGlosa {
  deducao: MaoDeObraItem[]
  valorizacao: MaoDeObraItem[]
}

export interface ServicosTerceiros {
  valorizacaoTotal: number
  deducaoTotal: number
}

export interface ReportData {
  header: ReportHeader
  pecasGlosadas: PecaGlosada[]
  maoDeObra: MaoDeObraGlosa
  servicosTerceiros: ServicosTerceiros
}

export const emptyReportData: ReportData = {
  header: {
    sinistro: "",
    regulador: "",
    perito: "",
    cidade: "",
    marca: "",
    modelo: "",
    placa: "",
    oficina: "",
    data: "",
    horaChegada: "",
    estado: "",
    agenteCausa: "",
    motivo: "",
  },
  pecasGlosadas: [],
  maoDeObra: {
    deducao: [
      { tipo: "servicos_gerais", label: "Serviços Gerais", valorHora: 0, horas: 0, valor: 0 },
      { tipo: "pintura", label: "Pintura", valorHora: 0, horas: 0, valor: 0 },
      { tipo: "recuperacao", label: "Recuperação", valorHora: 0, horas: 0, valor: 0 },
    ],
    valorizacao: [
      { tipo: "servicos_gerais", label: "Serviços Gerais", valorHora: 36, horas: 0, valor: 0 },
      { tipo: "pintura", label: "Pintura", valorHora: 49, horas: 0, valor: 0 },
      { tipo: "recuperacao", label: "Recuperação", valorHora: 45, horas: 0, valor: 0 },
    ],
  },
  servicosTerceiros: {
    valorizacaoTotal: 0,
    deducaoTotal: 0,
  },
}
