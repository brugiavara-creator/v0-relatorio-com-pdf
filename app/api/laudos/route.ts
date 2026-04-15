import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { ReportData } from "@/lib/report-data"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const reportData: ReportData = await request.json()

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

    // Inserir laudo principal
    const { data: laudo, error: laudoError } = await supabase
      .from("laudos")
      .insert({
        sinistro: reportData.header.sinistro,
        tipo_cliente: reportData.header.tipoCliente,
        regulador: reportData.header.regulador,
        perito: reportData.header.perito,
        cidade: reportData.header.cidade,
        estado: reportData.header.estado,
        marca: reportData.header.marca,
        modelo: reportData.header.modelo,
        placa: reportData.header.placa,
        chassi: reportData.header.chassi,
        oficina: reportData.header.oficina,
        tipo_oficina: reportData.header.tipoOficina,
        credenciamento: reportData.header.credenciamento,
        data_laudo: reportData.header.data || null,
        hora_chegada: reportData.header.horaChegada || null,
        agente_causa: reportData.header.agenteCausa,
        motivo: reportData.header.motivo,
        valor_inicial_orcamento: reportData.valorInicialOrcamento,
        franquia: reportData.franquia,
        valor_apos_franquia: valorAposFranquia,
        total_pecas_bruto: totalPecasBruto,
        total_pecas_liquido: totalPecasLiquido,
        total_pecas_negociado: totalPecasNegociado,
        total_mo_deducao: totalMODeducao,
        total_mo_valorizacao: totalMOValorizacao,
        total_servicos_terceiros_deducao: reportData.servicosTerceiros.deducaoTotal,
        total_servicos_terceiros_valorizacao: reportData.servicosTerceiros.valorizacaoTotal,
        total_deducoes: totalDeducoes,
        total_inclusoes: totalInclusoes,
        saldo_final: saldoFinal,
        observacao: reportData.observacao,
      })
      .select()
      .single()

    if (laudoError) {
      console.error("Erro ao inserir laudo:", laudoError)
      return NextResponse.json(
        { error: "Erro ao salvar laudo", details: laudoError.message },
        { status: 500 }
      )
    }

    const laudoId = laudo.id

    // Inserir peças
    if (reportData.pecasGlosadas.length > 0) {
      const pecasData = reportData.pecasGlosadas.map((peca) => ({
        laudo_id: laudoId,
        quantidade: peca.quantidade,
        codigo_peca: peca.codigoPeca,
        descricao: peca.descricao,
        valor_bruto_unitario: peca.valorBrutoUnitario,
        desconto: peca.desconto,
        valor_liquido_total: peca.valorLiquidoTotal,
        valor_liquido_negociado: peca.valorLiquidoNegociado,
      }))

      const { error: pecasError } = await supabase
        .from("laudos_pecas")
        .insert(pecasData)

      if (pecasError) {
        console.error("Erro ao inserir peças:", pecasError)
      }
    }

    // Inserir mão de obra
    const maoDeObraData = [
      ...reportData.maoDeObra.deducao.map((mo) => ({
        laudo_id: laudoId,
        tipo: mo.tipo,
        categoria: "deducao" as const,
        valor_hora: mo.valorHora,
        horas: mo.horas,
        valor: mo.valor,
        descricao: mo.descricao,
      })),
      ...reportData.maoDeObra.valorizacao.map((mo) => ({
        laudo_id: laudoId,
        tipo: mo.tipo,
        categoria: "inclusao" as const,
        valor_hora: mo.valorHora,
        horas: mo.horas,
        valor: mo.valor,
        descricao: mo.descricao,
      })),
    ]

    if (maoDeObraData.length > 0) {
      const { error: moError } = await supabase
        .from("laudos_mao_de_obra")
        .insert(maoDeObraData)

      if (moError) {
        console.error("Erro ao inserir mão de obra:", moError)
      }
    }

    // Inserir fotos (apenas URLs/referências)
    if (reportData.fotos && reportData.fotos.length > 0) {
      const fotosData = reportData.fotos.map((foto, index) => ({
        laudo_id: laudoId,
        url: foto.url,
        descricao: foto.descricao,
        ordem: index,
      }))

      const { error: fotosError } = await supabase
        .from("laudos_fotos")
        .insert(fotosData)

      if (fotosError) {
        console.error("Erro ao inserir fotos:", fotosError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      laudoId,
      message: "Laudo salvo com sucesso!" 
    })
  } catch (error) {
    console.error("Erro geral:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
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
    console.error("Erro geral:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
