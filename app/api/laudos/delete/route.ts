import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const seguradora = searchParams.get("seguradora")
    const deleteAll = searchParams.get("all") === "true"

    const supabase = await createClient()

    if (deleteAll) {
      // Deletar todas as fotos
      const { error: fotosError } = await supabase
        .from("laudos_fotos")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000")

      // Deletar todas as peças
      const { error: pecasError } = await supabase
        .from("laudos_pecas")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000")

      // Deletar toda a mão de obra
      const { error: moError } = await supabase
        .from("laudos_mao_de_obra")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000")

      // Deletar todos os laudos
      const { error: laudosError, count } = await supabase
        .from("laudos")
        .delete({ count: "exact" })
        .neq("id", "00000000-0000-0000-0000-000000000000")

      if (laudosError) {
        console.error("[v0] Erro ao deletar laudos:", laudosError)
        return NextResponse.json(
          { error: "Erro ao deletar laudos: " + laudosError.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: `Todos os ${count || 0} registros foram deletados com sucesso!`,
        deleted: count || 0,
      })
    } else if (seguradora) {
      // Buscar IDs dos laudos da seguradora
      const { data: laudos, error: fetchError } = await supabase
        .from("laudos")
        .select("id")
        .eq("seguradora", seguradora)

      if (fetchError) {
        console.error("[v0] Erro ao buscar laudos:", fetchError)
        return NextResponse.json(
          { error: "Erro ao buscar laudos: " + fetchError.message },
          { status: 500 }
        )
      }

      const laudoIds = laudos?.map((l) => l.id) || []

      if (laudoIds.length > 0) {
        // Deletar fotos dos laudos
        await supabase.from("laudos_fotos").delete().in("laudo_id", laudoIds)

        // Deletar peças dos laudos
        await supabase.from("laudos_pecas").delete().in("laudo_id", laudoIds)

        // Deletar mão de obra dos laudos
        await supabase.from("laudos_mao_de_obra").delete().in("laudo_id", laudoIds)

        // Deletar os laudos
        const { error: deleteError, count } = await supabase
          .from("laudos")
          .delete({ count: "exact" })
          .eq("seguradora", seguradora)

        if (deleteError) {
          console.error("[v0] Erro ao deletar laudos:", deleteError)
          return NextResponse.json(
            { error: "Erro ao deletar laudos: " + deleteError.message },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          message: `${count || 0} registros da seguradora ${seguradora} foram deletados!`,
          deleted: count || 0,
        })
      }

      return NextResponse.json({
        success: true,
        message: `Nenhum registro encontrado para a seguradora ${seguradora}`,
        deleted: 0,
      })
    } else {
      return NextResponse.json(
        { error: "Especifique a seguradora ou use ?all=true para deletar todos" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("[v0] Erro geral:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
