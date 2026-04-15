export interface ReportHeader {
  seguradora: string
  sinistro: string
  tipoCliente: string
  regulador: string
  perito: string
  cidade: string
  marca: string
  modelo: string
  placa: string
  chassi: string
  oficina: string
  tipoOficina: string
  credenciamento: string
  data: string
  horaChegada: string
  estado: string
  agenteCausa: string
  motivo: string
}

export const SEGURADORAS = [
  "ALLIANZ SEGUROS",
  "MAPFRE SEGUROS", 
  "PIER SEGUROS",
] as const

export const TIPOS_CLIENTE = ["Segurado", "Terceiro"] as const

export const TIPOS_OFICINA = ["Concessionária", "Linhas gerais"] as const

export const CREDENCIAMENTOS = ["Cadastrada", "Referenciada", "DRP"] as const

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
  descricao: string
}

export interface MaoDeObraGlosa {
  deducao: MaoDeObraItem[]
  valorizacao: MaoDeObraItem[]
}

export interface ServicosTerceiros {
  valorizacaoTotal: number
  deducaoTotal: number
}

export interface Foto {
  id: string
  url: string
  descricao: string
}

export interface ReportData {
  header: ReportHeader
  pecasGlosadas: PecaGlosada[]
  maoDeObra: MaoDeObraGlosa
  servicosTerceiros: ServicosTerceiros
  fotos: Foto[]
  observacao: string
  valorInicialOrcamento: number
  franquia: number
}

export const AGENTES_CAUSA = [
  "Perito",
  "Oficina",
  "Sistema",
  "Negociação OFR",
  "Analista",
  "Oficina e Perito",
  "Fornecimento",
  "Imagem",
  "Perito e Negociação OFR",
  "Fastrack",
] as const

export const MOTIVOS = [
  "DIVERGÊNCIA DE PREÇO PEÇAS",
  "FRANQUIA",
  "MATERIAL DE PINTURA",
  "MO INCORRETA",
  "PEÇA AFT",
  "PEÇA EM DUPLICIDADE",
  "PEÇA INCORRETA",
  "PEÇA RECUPERADA/PASSIVEL REPARAÇÃO",
  "PEÇA SEM AVARIAS",
  "APLICAÇÃO INADEQUADO DE APOLICE",
  "INVERSÃO DE CULPA",
  "RECUSA TECNICA",
  "AVARIAS SEM NEXO",
  "NEXO CAUSAL",
  "ERRO CADASTRAL",
  "DIVERGÊNCIA DE DESCONTO",
  "SERVIÇO NÃO REALIZADO",
  "NEGOCIAÇÃO OFR",
  "RESSARCIMENTO",
  "PT MAL INFORMADA",
] as const

export const emptyReportData: ReportData = {
  header: {
    seguradora: "",
    sinistro: "",
    tipoCliente: "",
    regulador: "",
    perito: "",
    cidade: "",
    marca: "",
    modelo: "",
    placa: "",
    chassi: "",
    oficina: "",
    tipoOficina: "",
    credenciamento: "",
    data: "",
    horaChegada: "",
    estado: "",
    agenteCausa: "",
    motivo: "",
  },
  pecasGlosadas: [],
  maoDeObra: {
    deducao: [
      { tipo: "servicos_gerais", label: "Serviços Gerais", valorHora: 0, horas: 0, valor: 0, descricao: "" },
      { tipo: "pintura", label: "Pintura", valorHora: 0, horas: 0, valor: 0, descricao: "" },
      { tipo: "recuperacao", label: "Recuperação", valorHora: 0, horas: 0, valor: 0, descricao: "" },
    ],
    valorizacao: [
      { tipo: "servicos_gerais", label: "Serviços Gerais", valorHora: 36, horas: 0, valor: 0, descricao: "" },
      { tipo: "pintura", label: "Pintura", valorHora: 49, horas: 0, valor: 0, descricao: "" },
      { tipo: "recuperacao", label: "Recuperação", valorHora: 45, horas: 0, valor: 0, descricao: "" },
    ],
  },
  servicosTerceiros: {
    valorizacaoTotal: 0,
    deducaoTotal: 0,
  },
  fotos: [],
  observacao: "",
  valorInicialOrcamento: 0,
  franquia: 0,
}
