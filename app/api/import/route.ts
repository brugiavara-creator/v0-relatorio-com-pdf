import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Função para converter data serial do Excel para data real
function excelDateToJSDate(serial: number): string | null {
  if (!serial || isNaN(serial)) return null
  const utc_days = Math.floor(serial - 25569)
  const date = new Date(utc_days * 86400 * 1000)
  return date.toISOString().split("T")[0]
}

function parseNumber(value: any): number {
  if (value === null || value === undefined || value === "" || value === "-") return 0
  if (typeof value === "number") return value
  const cleaned = String(value).replace(/[R$\s.]/g, "").replace(",", ".")
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

function extractMonth(dateStr: string | null): number | null {
  if (!dateStr) return null
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? null : date.getMonth() + 1
}

function extractYear(dateStr: string | null): number | null {
  if (!dateStr) return null
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? null : date.getFullYear()
}

// Mapeamento completo para ALLIANZ
function mapAllianzData(item: any) {
  const dataInspecao = item.Data ? excelDateToJSDate(item.Data) : null
  const mes = extractMonth(dataInspecao)
  const ano = extractYear(dataInspecao)
  
  const savingPecas = parseNumber(item["Saving de Peças"] || item["Saving Peças"] || 0)
  const savingMO = parseNumber(item["Saving de Mão de obra"] || item["Saving MO"] || 0)
  const savingReal = parseNumber(item["Saving Real"] || 0)
  const savingPotencial = parseNumber(item["Saving Potencial"] || 0)
  
  return {
    seguradora: "ALLIANZ SEGUROS",
    sinistro: String(item.Sinistro || ""),
    placa: item.Placa || "",
    chassi: item.Chassi || "",
    marca: item.Marca || item.Fabricante || "",
    modelo: item.Modelo || "",
    tipo_veiculo: item["Tipo Veículo"] || item.Tipo || "",
    fabricante: item.Fabricante || item.Marca || "",
    tipo_cliente: item["Terceiro/Segurado"] || item["Tipo Cliente"] || "",
    oficina: item.Oficina || "",
    credenciamento: item["Referenciada/Cadastrada/DRP"] || item.Credenciamento || "",
    tipo_oficina: item["Tipo (Conc ou oficina)"] === "Concessionaria" ? "Concessionária" : (item["Tipo (Conc ou oficina)"] || "Linhas gerais"),
    cidade: item.Cidade || item.Município || "",
    municipio: item.Município || item.Cidade || "",
    uf: item.UF || item.Estado || "",
    regulador: item.Regulador || "",
    perito: item.Perito || "",
    regulacao_perito: item.Perito || item.Regulador || "",
    data_inspecao: dataInspecao,
    mes,
    ano,
    agente_causa: item["Agente da Causa"] || item.Agente || "",
    motivo: item.Motivo || item["Descrição Glosa"] || "",
    descricao_glosa: item["Descrição Glosa"] || item.Motivo || item.Glosa || "",
    valor_orcamento: parseNumber(item["Valor Orçamento"] || item["Vlr Orçamento"] || 0),
    franquia: parseNumber(item.Franquia || 0),
    valor_auditado: parseNumber(item["Valor Auditado"] || item["Vlr Auditado"] || 0),
    saving_pecas: savingPecas,
    saving_mo: savingMO,
    saving_real: savingReal,
    saving_potencial: savingPotencial,
    total_pecas_deduzidas: savingPecas,
    total_pecas_negociadas: 0,
    total_mo_deduzida: savingMO,
    total_mo_incluida: 0,
    total_deducoes: savingPecas + savingMO,
    total_inclusoes: 0,
    saldo_final: -(savingPecas + savingMO),
    houve_ajuste: (savingPecas > 0 || savingMO > 0) ? "SIM" : "NÃO",
    observacao: "Importado via JSON - Allianz",
  }
}

// Mapeamento completo para MAPFRE
function mapMapfreData(item: any) {
  const dataInspecao = item.Data ? excelDateToJSDate(item.Data) : null
  const mes = extractMonth(dataInspecao)
  const ano = extractYear(dataInspecao)
  
  const savingPecas = parseNumber(item["Saving de Peças"] || item["Saving Peças"] || 0)
  const savingMO = parseNumber(item["Saving de Mão de obra"] || item["Saving MO"] || 0)
  const savingReal = parseNumber(item["Saving Real"] || 0)
  const savingPotencial = parseNumber(item["Saving Potencial"] || 0)
  
  return {
    seguradora: "MAPFRE SEGUROS",
    sinistro: String(item["Nº. Sinistro"] || item.Sinistro || ""),
    placa: item.Placa || "",
    chassi: item.Chassi || "",
    marca: item.Marca || item.Fabricante || "",
    modelo: item.Modelo || "",
    tipo_veiculo: item["Tipo Veículo"] || item.Tipo || "",
    fabricante: item.Fabricante || item.Marca || "",
    tipo_cliente: item["Tipo de cliente"] || item["Tipo Cliente"] || "",
    oficina: item.Oficina || "",
    credenciamento: item["Tipo de cadastro"] || item.Credenciamento || "",
    tipo_oficina: item["Tipo Oficina"] || "",
    cidade: item.Cidade || item.Município || "",
    municipio: item.Município || item.Cidade || "",
    uf: item.UF || item.Estado || "",
    regulador: item["Reguladora - Regulador"] || item.Regulador || "",
    perito: item.Analista || item.Perito || "",
    regulacao_perito: item.Analista || item["Reguladora - Regulador"] || "",
    data_inspecao: dataInspecao,
    mes,
    ano,
    agente_causa: item["Agente da Causa"] || item.Agente || "",
    motivo: item.Motivo || item["Descrição Glosa"] || "",
    descricao_glosa: item["Descrição Glosa"] || item.Motivo || item.Glosa || "",
    valor_orcamento: parseNumber(item["Valot total"] || item["Valor total"] || item["Valor Orçamento"] || 0),
    franquia: parseNumber(item.Franquia || 0),
    valor_auditado: parseNumber(item["Valor Auditado"] || 0),
    saving_pecas: savingPecas,
    saving_mo: savingMO,
    saving_real: savingReal,
    saving_potencial: savingPotencial,
    total_pecas_deduzidas: savingPecas,
    total_pecas_negociadas: 0,
    total_mo_deduzida: savingMO,
    total_mo_incluida: 0,
    total_deducoes: savingPecas + savingMO,
    total_inclusoes: 0,
    saldo_final: -(savingPecas + savingMO),
    houve_ajuste: (savingPecas > 0 || savingMO > 0) ? "SIM" : "NÃO",
    observacao: item["Observações"] || "Importado via JSON - Mapfre",
  }
}

// Mapeamento completo para PIER
function mapPierData(item: any) {
  const dataInspecao = item.Data ? excelDateToJSDate(item.Data) : null
  const mes = extractMonth(dataInspecao)
  const ano = extractYear(dataInspecao)
  
  const savingPecas = parseNumber(item["Saving de Peças"] || item["Saving Peças"] || 0)
  const savingMO = parseNumber(item["Saving de Mão de obra"] || item["Saving MO"] || 0)
  const savingReal = parseNumber(item["Saving Real"] || 0)
  const savingPotencial = parseNumber(item["Saving Potencial"] || 0)
  
  return {
    seguradora: "PIER SEGUROS",
    sinistro: String(item["Nº. Sinistro"] || item.Sinistro || ""),
    placa: item.Placa || "",
    chassi: item.Chassi || "",
    marca: item.Marca || item.Fabricante || "",
    modelo: item.Modelo || "",
    tipo_veiculo: item["Tipo Veículo"] || item.Tipo || "",
    fabricante: item.Fabricante || item.Marca || "",
    tipo_cliente: item["Tipo de cliente"] || item["Tipo Cliente"] || "",
    oficina: item.Oficina || "",
    credenciamento: item["Tipo de cadastro"] || item.Credenciamento || "",
    tipo_oficina: item["Tipo Oficina"] || "",
    cidade: item.Cidade || item.Município || "",
    municipio: item.Município || item.Cidade || "",
    uf: item.UF || item.Estado || "",
    regulador: item["Reguladora - Regulador"] || item.Regulador || "",
    perito: item.Analista || item.Perito || "",
    regulacao_perito: item.Analista || item["Reguladora - Regulador"] || "",
    data_inspecao: dataInspecao,
    mes,
    ano,
    agente_causa: item["Agente da Causa"] || item.Agente || "",
    motivo: item.Motivo || item["Descrição Glosa"] || "",
    descricao_glosa: item["Descrição Glosa"] || item.Motivo || item.Glosa || "",
    valor_orcamento: parseNumber(item["Valor total"] || item["Valor Orçamento"] || 0),
    franquia: parseNumber(item.Franquia || 0),
    valor_auditado: parseNumber(item["Valor Auditado"] || 0),
    saving_pecas: savingPecas,
    saving_mo: savingMO,
    saving_real: savingReal,
    saving_potencial: savingPotencial,
    total_pecas_deduzidas: savingPecas,
    total_pecas_negociadas: 0,
    total_mo_deduzida: savingMO,
    total_mo_incluida: 0,
    total_deducoes: savingPecas + savingMO,
    total_inclusoes: 0,
    saldo_final: -(savingPecas + savingMO),
    houve_ajuste: (savingPecas > 0 || savingMO > 0) ? "SIM" : "NÃO",
    observacao: item["Observações"] || "Importado via JSON - Pier",
  }
}

export async function POST(request: Request) {
  try {
    const { seguradora, data } = await request.json()

    if (!seguradora || !data || !Array.isArray(data)) {
      return NextResponse.json(
        { error: "Dados inválidos. Forneça seguradora e array de dados." },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Mapear dados conforme a seguradora
    let mappedData: any[] = []
    
    switch (seguradora.toUpperCase()) {
      case "ALLIANZ":
      case "ALLIANZ SEGUROS":
        mappedData = data.map(mapAllianzData)
        break
      case "MAPFRE":
      case "MAPFRE SEGUROS":
        mappedData = data.map(mapMapfreData)
        break
      case "PIER":
      case "PIER SEGUROS":
        mappedData = data.map(mapPierData)
        break
      default:
        return NextResponse.json(
          { error: "Seguradora não reconhecida. Use: ALLIANZ, MAPFRE ou PIER" },
          { status: 400 }
        )
    }

    // Inserir dados em lotes de 100
    const batchSize = 100
    let totalInserted = 0
    const errors: string[] = []

    for (let i = 0; i < mappedData.length; i += batchSize) {
      const batch = mappedData.slice(i, i + batchSize)
      
      const { data: insertedData, error } = await supabase
        .from("laudos")
        .insert(batch)
        .select("id")

      if (error) {
        console.error(`[v0] Erro ao inserir lote ${i / batchSize + 1}:`, error)
        errors.push(`Lote ${i / batchSize + 1}: ${error.message}`)
      } else {
        totalInserted += insertedData?.length || 0
      }
    }

    return NextResponse.json({
      success: true,
      message: `Importação concluída! ${totalInserted} de ${mappedData.length} registros inseridos.`,
      totalRecords: mappedData.length,
      inserted: totalInserted,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error("[v0] Erro na importação:", error)
    return NextResponse.json(
      { error: "Erro interno ao processar a importação" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "API de Importação de Dados JSON",
    usage: {
      method: "POST",
      body: {
        seguradora: "ALLIANZ | MAPFRE | PIER",
        data: "[array de objetos JSON]"
      }
    }
  })
}
