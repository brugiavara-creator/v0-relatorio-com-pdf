import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams

  // Filtros da URL
  const seguradora = searchParams.get("seguradora")
  const mes = searchParams.get("mes")
  const ano = searchParams.get("ano")
  const motivo = searchParams.get("motivo")
  const agenteCausa = searchParams.get("agente_causa")
  const tipoOficina = searchParams.get("tipo_oficina")
  const credenciamento = searchParams.get("credenciamento")
  const tipoCliente = searchParams.get("tipo_cliente")
  const uf = searchParams.get("uf")
  const houveAjuste = searchParams.get("houve_ajuste")

  try {
    // Construir query com filtros
    let query = supabase.from("laudos").select("*")

    if (seguradora) query = query.eq("seguradora", seguradora)
    if (mes) query = query.eq("mes", parseInt(mes))
    if (ano) query = query.eq("ano", parseInt(ano))
    if (motivo) query = query.eq("motivo", motivo)
    if (agenteCausa) query = query.eq("agente_causa", agenteCausa)
    if (tipoOficina) query = query.eq("tipo_oficina", tipoOficina)
    if (credenciamento) query = query.eq("credenciamento", credenciamento)
    if (tipoCliente) query = query.eq("tipo_cliente", tipoCliente)
    if (uf) query = query.eq("uf", uf)
    if (houveAjuste) query = query.eq("houve_ajuste", houveAjuste)

    query = query.order("created_at", { ascending: false })

    const { data: laudos, error: laudosError } = await query

    if (laudosError) {
      console.error("[v0] Erro Supabase ao buscar laudos:", laudosError)
      throw new Error(`Supabase: ${laudosError.message} (code: ${laudosError.code})`)
    }

    // Calcular métricas
    const totalLaudos = laudos?.length || 0
    const totalDeducoes = laudos?.reduce((acc, l) => acc + (l.total_deducoes || 0), 0) || 0
    const totalInclusoes = laudos?.reduce((acc, l) => acc + (l.total_inclusoes || 0), 0) || 0
    const totalSaldo = laudos?.reduce((acc, l) => acc + (l.saldo_final || 0), 0) || 0
    const totalOrcamento = laudos?.reduce((acc, l) => acc + (l.valor_orcamento || 0), 0) || 0
    const totalFranquia = laudos?.reduce((acc, l) => acc + (l.franquia || 0), 0) || 0
    const totalSavingPecas = laudos?.reduce((acc, l) => acc + (l.saving_pecas || 0), 0) || 0
    const totalSavingMO = laudos?.reduce((acc, l) => acc + (l.saving_mo || 0), 0) || 0
    const totalSavingReal = laudos?.reduce((acc, l) => acc + (l.saving_real || 0), 0) || 0
    const totalSavingPotencial = laudos?.reduce((acc, l) => acc + (l.saving_potencial || 0), 0) || 0

    // Agrupar por seguradora
    const porSeguradora: Record<string, number> = {}
    laudos?.forEach((l) => {
      const seg = l.seguradora || "Não informado"
      porSeguradora[seg] = (porSeguradora[seg] || 0) + 1
    })
    const seguradoras = Object.entries(porSeguradora)
      .map(([nome, quantidade]) => ({ nome, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)

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
      const mot = l.motivo || l.descricao_glosa
      if (mot) {
        porMotivo[mot] = (porMotivo[mot] || 0) + 1
      }
    })
    const motivos = Object.entries(porMotivo)
      .map(([nome, quantidade]) => ({ nome, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 15)

    // Agrupar por tipo de oficina
    const porTipoOficina: Record<string, number> = {}
    laudos?.forEach((l) => {
      const tipo = l.tipo_oficina || "Não informado"
      porTipoOficina[tipo] = (porTipoOficina[tipo] || 0) + 1
    })
    const tiposOficina = Object.entries(porTipoOficina)
      .map(([nome, quantidade]) => ({ nome, quantidade }))

    // Agrupar por tipo de cliente
    const porTipoCliente: Record<string, number> = {}
    laudos?.forEach((l) => {
      const tipo = l.tipo_cliente || "Não informado"
      porTipoCliente[tipo] = (porTipoCliente[tipo] || 0) + 1
    })
    const tiposCliente = Object.entries(porTipoCliente)
      .map(([nome, quantidade]) => ({ nome, quantidade }))

    // Agrupar por credenciamento
    const porCredenciamento: Record<string, number> = {}
    laudos?.forEach((l) => {
      const cred = l.credenciamento || "Não informado"
      porCredenciamento[cred] = (porCredenciamento[cred] || 0) + 1
    })
    const credenciamentos = Object.entries(porCredenciamento)
      .map(([nome, quantidade]) => ({ nome, quantidade }))

    // Agrupar por UF
    const porUF: Record<string, number> = {}
    laudos?.forEach((l) => {
      const estado = l.uf || "Não informado"
      porUF[estado] = (porUF[estado] || 0) + 1
    })
    const ufs = Object.entries(porUF)
      .map(([nome, quantidade]) => ({ nome, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)

    // Agrupar por houve ajuste
    const porHouveAjuste: Record<string, number> = {}
    laudos?.forEach((l) => {
      const ajuste = l.houve_ajuste || "Não informado"
      porHouveAjuste[ajuste] = (porHouveAjuste[ajuste] || 0) + 1
    })
    const houveAjustes = Object.entries(porHouveAjuste)
      .map(([nome, quantidade]) => ({ nome, quantidade }))

    // Evolução mensal
    const porMes: Record<string, { laudos: number; deducoes: number; inclusoes: number; savingPecas: number; savingMO: number }> = {}
    laudos?.forEach((l) => {
      let mesAno = "Sem data"
      if (l.mes && l.ano) {
        mesAno = `${l.mes}/${l.ano}`
      } else if (l.data_inspecao) {
        const date = new Date(l.data_inspecao)
        mesAno = `${date.getMonth() + 1}/${date.getFullYear()}`
      } else if (l.created_at) {
        const date = new Date(l.created_at)
        mesAno = `${date.getMonth() + 1}/${date.getFullYear()}`
      }
      
      if (!porMes[mesAno]) {
        porMes[mesAno] = { laudos: 0, deducoes: 0, inclusoes: 0, savingPecas: 0, savingMO: 0 }
      }
      porMes[mesAno].laudos++
      porMes[mesAno].deducoes += l.total_deducoes || 0
      porMes[mesAno].inclusoes += l.total_inclusoes || 0
      porMes[mesAno].savingPecas += l.saving_pecas || 0
      porMes[mesAno].savingMO += l.saving_mo || 0
    })
    const evolucaoMensal = Object.entries(porMes)
      .map(([mes, dados]) => ({ mes, ...dados }))
      .sort((a, b) => {
        const [mesA, anoA] = a.mes.split("/").map(Number)
        const [mesB, anoB] = b.mes.split("/").map(Number)
        if (anoA !== anoB) return anoA - anoB
        return mesA - mesB
      })

    // Buscar opções de filtro únicas (sem filtro aplicado)
    const { data: allLaudos } = await supabase
      .from("laudos")
      .select("seguradora, motivo, descricao_glosa, agente_causa, tipo_oficina, credenciamento, tipo_cliente, uf, mes, ano, houve_ajuste")

    const filtrosUnicos = {
      seguradoras: [...new Set(allLaudos?.map((l) => l.seguradora).filter(Boolean))].sort(),
      motivos: [...new Set(allLaudos?.map((l) => l.motivo || l.descricao_glosa).filter(Boolean))].sort(),
      agentesCausa: [...new Set(allLaudos?.map((l) => l.agente_causa).filter(Boolean))].sort(),
      tiposOficina: [...new Set(allLaudos?.map((l) => l.tipo_oficina).filter(Boolean))].sort(),
      credenciamentos: [...new Set(allLaudos?.map((l) => l.credenciamento).filter(Boolean))].sort(),
      tiposCliente: [...new Set(allLaudos?.map((l) => l.tipo_cliente).filter(Boolean))].sort(),
      ufs: [...new Set(allLaudos?.map((l) => l.uf).filter(Boolean))].sort(),
      meses: [...new Set(allLaudos?.map((l) => l.mes).filter(Boolean))].sort((a, b) => a - b),
      anos: [...new Set(allLaudos?.map((l) => l.ano).filter(Boolean))].sort((a, b) => b - a),
      houveAjustes: [...new Set(allLaudos?.map((l) => l.houve_ajuste).filter(Boolean))].sort(),
    }

    // Últimos laudos
    const ultimosLaudos = laudos?.slice(0, 50).map((l) => ({
      id: l.id,
      seguradora: l.seguradora,
      sinistro: l.sinistro,
      placa: l.placa,
      modelo: l.modelo,
      oficina: l.oficina,
      tipoOficina: l.tipo_oficina,
      credenciamento: l.credenciamento,
      tipoCliente: l.tipo_cliente,
      uf: l.uf,
      agenteCausa: l.agente_causa,
      motivo: l.motivo || l.descricao_glosa,
      valorOrcamento: l.valor_orcamento,
      savingPecas: l.saving_pecas,
      savingMO: l.saving_mo,
      totalDeducoes: l.total_deducoes,
      totalInclusoes: l.total_inclusoes,
      saldoFinal: l.saldo_final,
      houveAjuste: l.houve_ajuste,
      dataInspecao: l.data_inspecao,
      mes: l.mes,
      ano: l.ano,
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
        totalSavingPecas,
        totalSavingMO,
        totalSavingReal,
        totalSavingPotencial,
        mediaDeducao: totalLaudos > 0 ? totalDeducoes / totalLaudos : 0,
        mediaInclusao: totalLaudos > 0 ? totalInclusoes / totalLaudos : 0,
      },
      seguradoras,
      agentesCausa,
      motivos,
      tiposOficina,
      tiposCliente,
      credenciamentos,
      ufs,
      houveAjustes,
      evolucaoMensal,
      ultimosLaudos,
      filtros: filtrosUnicos,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido"
    console.error("[v0] Erro ao buscar dados do dashboard:", msg)
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    )
  }
}
