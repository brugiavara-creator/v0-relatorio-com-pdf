import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Função para converter data serial do Excel para data real
function excelDateToJSDate(serial: number): string {
  const utc_days = Math.floor(serial - 25569)
  const date = new Date(utc_days * 86400 * 1000)
  return date.toISOString().split("T")[0]
}

// Mapeamento de campos para cada seguradora
function mapAllianzData(item: any) {
  return {
    seguradora: "ALLIANZ SEGUROS",
    sinistro: String(item.Sinistro || ""),
    placa: item.Placa || "",
    tipo_cliente: item["Terceiro/Segurado"] || "",
    oficina: item.Oficina || "",
    credenciamento: item["Referenciada/Cadastrada/DRP"] || "",
    tipo_oficina: item["Tipo (Conc ou oficina)"] === "Concessionaria" ? "Concessionária" : "Linhas gerais",
    estado: item.UF || "",
    regulador: item.Regulador || "",
    perito: item.Perito || "",
    data_inspecao: item.Data ? excelDateToJSDate(item.Data) : null,
    valor_inicial_orcamento: parseFloat(item["Valor Orçamento"]) || 0,
    observacao: "Importado via JSON - Allianz Janeiro 2026",
  }
}

function mapMapfreData(item: any) {
  return {
    seguradora: "MAPFRE SEGUROS",
    sinistro: String(item["Nº. Sinistro"] || ""),
    placa: item.Placa || "",
    modelo: item.Modelo || "",
    tipo_cliente: "",
    oficina: "",
    credenciamento: "",
    tipo_oficina: "",
    estado: item.UF || "",
    regulador: item["Reguladora - Regulador"] || "",
    perito: item.Analista || "",
    data_inspecao: item.Data ? excelDateToJSDate(item.Data) : null,
    valor_inicial_orcamento: parseFloat(item["Valot total"]) || 0,
    observacao: item["Observações"] || "Importado via JSON - Mapfre Janeiro 2026",
  }
}

function mapPierData(item: any) {
  return {
    seguradora: "PIER SEGUROS",
    sinistro: String(item["Nº. Sinistro"] || ""),
    placa: item.Placa || "",
    modelo: item.Modelo || "",
    tipo_cliente: item["Tipo de cliente"] || "",
    oficina: item.Oficina || "",
    credenciamento: item["Tipo de cadastro"] || "",
    tipo_oficina: "",
    estado: item.UF || "",
    regulador: item["Reguladora - Regulador"] || "",
    perito: item.Analista || "",
    data_inspecao: item.Data ? excelDateToJSDate(item.Data) : null,
    valor_inicial_orcamento: parseFloat(item["Valor total"]) || 0,
    observacao: item["Observações"] || "Importado via JSON - Pier Janeiro 2026",
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
