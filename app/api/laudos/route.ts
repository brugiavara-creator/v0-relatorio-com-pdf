import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { ReportData } from "@/lib/report-data"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const reportData: ReportData = await request.json()

    console.log("[v0] Recebendo dados para salvar laudo:", reportData.header.sinistro)

    // Calcular totais
    const totalPecasBruto = reportData.pecasGlosadas.reduce(
      (sum, p) => sum + p.valorBrutoUnitario * p.quantidade,
      0
    )
    const totalPecasLiquido = reportData.pecasGlosadas.reduce(
      (sum, p) => sum + p.valorLiquidoTotal,
      0
    )
    const totalPecasNegociado = reportData.pecasGlosadas.reduce(
      (sum, p) => sum + p.valorLiquidoNegociado,
      0
    )
    const totalMODeducao = reportData.maoDeObra.deducao.reduce(
      (sum, m) => sum + m.valor,
      0
    )
    const totalMOValorizacao = reportData.maoDeObra.valorizacao.reduce(
      (sum, m) => sum + m.valor,
      0
    )
    const totalDeducoes =
      totalPecasLiquido + totalMODeducao + reportData.servicosTerceiros.deducaoTotal
    const totalInclusoes =
      totalMOValorizacao + reportData.servicosTerceiros.valorizacaoTotal + totalPecasNegociado
    const valorAposFranquia =
      reportData.valorInicialOrcamento - reportData.franquia
    const saldoFinal = valorAposFranquia - totalDeducoes + totalInclusoes

    // Inserir laudo principal - usando nomes de colunas do schema real
    const { data: laudo, error: laudoError } = await supabase
      .from("laudos")
      .insert({
        seguradora: reportData.header.seguradora || null,
        sinistro: reportData.header.sinistro || null,
        tipo_cliente: reportData.header.tipoCliente || null,
        regulador: reportData.header.regulador || null,
        perito: reportData.header.perito || null,
        cidade: reportData.header.cidade || null,
        estado: reportData.header.estado || null,
        marca: reportData.header.marca || null,
        modelo: reportData.header.modelo || null,
        placa: reportData.header.placa || null,
        chassi: reportData.header.chassi || null,
        oficina: reportData.header.oficina || null,
        tipo_oficina: reportData.header.tipoOficina || null,
        credenciamento: reportData.header.credenciamento || null,
        data_inspecao: reportData.header.data || null,
        hora_chegada: reportData.header.horaChegada || null,
        agente_causa: reportData.header.agenteCausa || null,
        motivo: reportData.header.motivo || null,
        valor_inicial_orcamento: reportData.valorInicialOrcamento || 0,
        franquia: reportData.franquia || 0,
        total_pecas_deduzidas: totalPecasLiquido,
        total_pecas_negociadas: totalPecasNegociado,
        total_mo_deduzida: totalMODeducao + reportData.servicosTerceiros.deducaoTotal,
        total_mo_incluida: totalMOValorizacao + reportData.servicosTerceiros.valorizacaoTotal,
        total_servicos_terceiros_deducao: reportData.servicosTerceiros.deducaoTotal || 0,
        total_servicos_terceiros_inclusao: reportData.servicosTerceiros.valorizacaoTotal || 0,
        total_deducoes: totalDeducoes,
        total_inclusoes: totalInclusoes,
        saldo_final: saldoFinal,
        observacao: reportData.observacao || null,
        dados_completos: reportData,
      })
      .select()
      .single()

    if (laudoError) {
      console.error("[v0] Erro ao inserir laudo:", laudoError)
      return NextResponse.json(
        { error: "Erro ao salvar laudo", details: laudoError.message },
        { status: 500 }
      )
    }

    console.log("[v0] Laudo inserido com sucesso:", laudo.id)

    const laudoId = laudo.id

    // Inserir peças
    if (reportData.pecasGlosadas.length > 0) {
      const pecasData = reportData.pecasGlosadas.map((peca) => ({
        laudo_id: laudoId,
        quantidade: peca.quantidade,
        codigo: peca.codigoPeca || null,
        descricao: peca.descricao || null,
        valor_unitario: peca.valorBrutoUnitario,
        valor_total: peca.valorBrutoUnitario * peca.quantidade,
        valor_liquido: peca.valorLiquidoTotal,
        valor_negociado: peca.valorLiquidoNegociado,
      }))

      const { error: pecasError } = await supabase
        .from("laudos_pecas")
        .insert(pecasData)

      if (pecasError) {
        console.error("[v0] Erro ao inserir peças:", pecasError)
      } else {
        console.log("[v0] Peças inseridas com sucesso")
      }
    }

    // Inserir mão de obra
    const maoDeObraData = [
      ...reportData.maoDeObra.deducao.filter(mo => mo.valor > 0).map((mo) => ({
        laudo_id: laudoId,
        tipo: mo.tipo,
        categoria: "deducao",
        valor_hora: mo.valorHora,
        horas: mo.horas,
        valor_total: mo.valor,
        descricao: mo.descricao || null,
      })),
      ...reportData.maoDeObra.valorizacao.filter(mo => mo.valor > 0).map((mo) => ({
        laudo_id: laudoId,
        tipo: mo.tipo,
        categoria: "inclusao",
        valor_hora: mo.valorHora,
        horas: mo.horas,
        valor_total: mo.valor,
        descricao: mo.descricao || null,
      })),
    ]

    if (maoDeObraData.length > 0) {
      const { error: moError } = await supabase
        .from("laudos_mao_de_obra")
        .insert(maoDeObraData)

      if (moError) {
        console.error("[v0] Erro ao inserir mão de obra:", moError)
      } else {
        console.log("[v0] Mão de obra inserida com sucesso")
      }
    }

    // Inserir fotos
    if (reportData.fotos && reportData.fotos.length > 0) {
      const fotosData = reportData.fotos.map((foto) => ({
        laudo_id: laudoId,
        url: foto.url,
        descricao: foto.descricao || null,
      }))

      const { error: fotosError } = await supabase
        .from("laudos_fotos")
        .insert(fotosData)

      if (fotosError) {
        console.error("[v0] Erro ao inserir fotos:", fotosError)
      } else {
        console.log("[v0] Fotos inseridas com sucesso")
      }
    }

    return NextResponse.json({ 
      success: true, 
      laudoId,
      message: "Laudo salvo com sucesso!" 
    })
  } catch (error) {
    console.error("[v0] Erro geral:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor", details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: laudos, error } = await supabase
      .from("laudos")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: "Erro ao buscar laudos", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ laudos })
  } catch (error) {
    console.error("[v0] Erro geral:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
