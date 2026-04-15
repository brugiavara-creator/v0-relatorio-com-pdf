"use server"

import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  try {
    // Buscar todos os laudos
    const { data: laudos, error: laudosError } = await supabase
      .from("laudos")
      .select("*")
      .order("created_at", { ascending: false })

    if (laudosError) throw laudosError

    // Calcular métricas
    const totalLaudos = laudos?.length || 0
    const totalDeducoes = laudos?.reduce((acc, l) => acc + (l.total_deducoes || 0), 0) || 0
    const totalInclusoes = laudos?.reduce((acc, l) => acc + (l.total_inclusoes || 0), 0) || 0
    const totalSaldo = laudos?.reduce((acc, l) => acc + (l.saldo_final || 0), 0) || 0
    const totalOrcamento = laudos?.reduce((acc, l) => acc + (l.valor_inicial_orcamento || 0), 0) || 0
    const totalFranquia = laudos?.reduce((acc, l) => acc + (l.franquia || 0), 0) || 0

    // Agrupar por agente da causa
    const porAgente: Record<string, number> = {}
    laudos?.forEach((l) => {
      if (l.agente_causa) {
        porAgente[l.agente_causa] = (porAgente[l.agente_causa] || 0) + 1
      }
    })
    const agentesCausa = Object.entries(porAgente)
      .map(([nome, quantidade]) => ({ nome, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)

    // Agrupar por motivo
    const porMotivo: Record<string, number> = {}
    laudos?.forEach((l) => {
      if (l.motivo) {
        porMotivo[l.motivo] = (porMotivo[l.motivo] || 0) + 1
      }
    })
    const motivos = Object.entries(porMotivo)
      .map(([nome, quantidade]) => ({ nome, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10)

    // Agrupar por tipo de oficina
    const porTipoOficina: Record<string, number> = {}
    laudos?.forEach((l) => {
      if (l.tipo_oficina) {
        porTipoOficina[l.tipo_oficina] = (porTipoOficina[l.tipo_oficina] || 0) + 1
      }
    })
    const tiposOficina = Object.entries(porTipoOficina)
      .map(([nome, quantidade]) => ({ nome, quantidade }))

    // Agrupar por tipo de cliente
    const porTipoCliente: Record<string, number> = {}
    laudos?.forEach((l) => {
      if (l.tipo_cliente) {
        porTipoCliente[l.tipo_cliente] = (porTipoCliente[l.tipo_cliente] || 0) + 1
      }
    })
    const tiposCliente = Object.entries(porTipoCliente)
      .map(([nome, quantidade]) => ({ nome, quantidade }))

    // Agrupar por credenciamento
    const porCredenciamento: Record<string, number> = {}
    laudos?.forEach((l) => {
      if (l.credenciamento) {
        porCredenciamento[l.credenciamento] = (porCredenciamento[l.credenciamento] || 0) + 1
      }
    })
    const credenciamentos = Object.entries(porCredenciamento)
      .map(([nome, quantidade]) => ({ nome, quantidade }))

    // Evolução mensal
    const porMes: Record<string, { laudos: number; deducoes: number; inclusoes: number }> = {}
    laudos?.forEach((l) => {
      const date = new Date(l.created_at)
      const mesAno = `${date.getMonth() + 1}/${date.getFullYear()}`
      if (!porMes[mesAno]) {
        porMes[mesAno] = { laudos: 0, deducoes: 0, inclusoes: 0 }
      }
      porMes[mesAno].laudos++
      porMes[mesAno].deducoes += l.total_deducoes || 0
      porMes[mesAno].inclusoes += l.total_inclusoes || 0
    })
    const evolucaoMensal = Object.entries(porMes)
      .map(([mes, dados]) => ({ mes, ...dados }))
      .reverse()

    // Últimos laudos
    const ultimosLaudos = laudos?.slice(0, 10).map((l) => ({
      id: l.id,
      sinistro: l.sinistro,
      placa: l.placa,
      oficina: l.oficina,
      agenteCausa: l.agente_causa,
      motivo: l.motivo,
      totalDeducoes: l.total_deducoes,
      totalInclusoes: l.total_inclusoes,
      saldoFinal: l.saldo_final,
      createdAt: l.created_at,
    }))

    return NextResponse.json({
      metricas: {
        totalLaudos,
        totalDeducoes,
        totalInclusoes,
        totalSaldo,
        totalOrcamento,
        totalFranquia,
        mediaDeducao: totalLaudos > 0 ? totalDeducoes / totalLaudos : 0,
        mediaInclusao: totalLaudos > 0 ? totalInclusoes / totalLaudos : 0,
      },
      agentesCausa,
      motivos,
      tiposOficina,
      tiposCliente,
      credenciamentos,
      evolucaoMensal,
      ultimosLaudos,
    })
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error)
    return NextResponse.json(
      { error: "Erro ao buscar dados do dashboard" },
      { status: 500 }
    )
  }
}
