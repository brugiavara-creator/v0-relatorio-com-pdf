"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ReportData } from "@/lib/report-data"
import { Calculator, TrendingDown, TrendingUp, Minus, DollarSign } from "lucide-react"

interface SummarySectionProps {
  data: ReportData
  onOrcamentoChange: (value: number) => void
  onFranquiaChange: (value: number) => void
}

export function SummarySection({ data, onOrcamentoChange, onFranquiaChange }: SummarySectionProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Calcular totais de peças
  const totalPecasLiquido = data.pecasGlosadas.reduce((acc, peca) => acc + peca.valorLiquidoTotal, 0)
  const totalPecasNegociado = data.pecasGlosadas.reduce(
    (acc, peca) => acc + peca.valorLiquidoNegociado,
    0
  )

  // Calcular totais de mão de obra
  const totalMODeducao = data.maoDeObra.deducao.reduce((acc, item) => acc + item.valor, 0)
  const totalMOValorizacao = data.maoDeObra.valorizacao.reduce((acc, item) => acc + item.valor, 0)

  // Serviços de terceiros
  const totalServicosTerceirosDeducao = data.servicosTerceiros.deducaoTotal
  const totalServicosTerceirosValorizacao = data.servicosTerceiros.valorizacaoTotal

  // Totais gerais
  const totalDeducoes = totalPecasLiquido + totalMODeducao + totalServicosTerceirosDeducao
  const totalInclusoes = totalMOValorizacao + totalServicosTerceirosValorizacao + totalPecasNegociado

  // Cálculo do saldo final com orçamento e franquia
  const valorInicialOrcamento = data.valorInicialOrcamento || 0
  const franquia = data.franquia || 0
  const valorAposFranquia = valorInicialOrcamento - franquia
  const saldoFinal = valorAposFranquia - totalDeducoes + totalInclusoes

  return (
    <Card className="border-l-4 border-l-slate-500">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-slate-500" />
          Resumo do Laudo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Campos de Orçamento e Franquia */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-950/30">
            <Label htmlFor="valorOrcamento" className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Valor Inicial Orçamento / Total Geral
            </Label>
            <div className="mt-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <Input
                id="valorOrcamento"
                type="number"
                step="0.01"
                min={0}
                value={data.valorInicialOrcamento || ""}
                onChange={(e) => onOrcamentoChange(parseFloat(e.target.value) || 0)}
                className="text-right font-medium"
                placeholder="0,00"
              />
            </div>
          </div>
          <div className="rounded-lg border bg-orange-50 p-4 dark:bg-orange-950/30">
            <Label htmlFor="franquia" className="text-sm font-medium text-orange-700 dark:text-orange-400">
              Franquia
            </Label>
            <div className="mt-2 flex items-center gap-2">
              <Minus className="h-4 w-4 text-orange-500" />
              <Input
                id="franquia"
                type="number"
                step="0.01"
                min={0}
                value={data.franquia || ""}
                onChange={(e) => onFranquiaChange(parseFloat(e.target.value) || 0)}
                className="text-right font-medium"
                placeholder="0,00"
              />
            </div>
          </div>
          <div className="rounded-lg border bg-slate-100 p-4 dark:bg-slate-800/50 md:col-span-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Valor Após Franquia
            </span>
            <div className="mt-2 text-2xl font-bold text-slate-700 dark:text-slate-300">
              {formatCurrency(valorAposFranquia)}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Deduções */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
            <div className="mb-3 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              <h4 className="font-semibold text-red-700 dark:text-red-400">Deduções</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Peças Glosadas</span>
                <span className="font-medium">{formatCurrency(totalPecasLiquido)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mão de Obra</span>
                <span className="font-medium">{formatCurrency(totalMODeducao)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Serviços Terceiros</span>
                <span className="font-medium">{formatCurrency(totalServicosTerceirosDeducao)}</span>
              </div>
              <div className="border-t border-red-200 pt-2 mt-2 dark:border-red-800 space-y-1">
                <div className="flex justify-between text-red-600 dark:text-red-400">
                  <span>Total Peça Deduzida</span>
                  <span className="font-medium">{formatCurrency(totalPecasLiquido)}</span>
                </div>
                <div className="flex justify-between text-red-600 dark:text-red-400">
                  <span>Total M.O. Deduzida</span>
                  <span className="font-medium">{formatCurrency(totalMODeducao + totalServicosTerceirosDeducao)}</span>
                </div>
              </div>
              <div className="border-t border-red-200 pt-2 dark:border-red-800">
                <div className="flex justify-between font-semibold text-red-700 dark:text-red-400">
                  <span>Total Deduções</span>
                  <span>{formatCurrency(totalDeducoes)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inclusões */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <h4 className="font-semibold text-green-700 dark:text-green-400">Inclusões</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Peças Negociadas</span>
                <span className="font-medium">{formatCurrency(totalPecasNegociado)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mão de Obra</span>
                <span className="font-medium">{formatCurrency(totalMOValorizacao)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Serviços Terceiros</span>
                <span className="font-medium">{formatCurrency(totalServicosTerceirosValorizacao)}</span>
              </div>
              <div className="border-t border-green-200 pt-2 dark:border-green-800">
                <div className="flex justify-between font-semibold text-green-700 dark:text-green-400">
                  <span>Total Inclusões</span>
                  <span>{formatCurrency(totalInclusoes)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Saldo Final */}
          <div
            className={`rounded-lg border p-4 ${
              saldoFinal >= 0
                ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
                : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
            }`}
          >
            <div className="mb-3 flex items-center gap-2">
              <Calculator className={`h-5 w-5 ${saldoFinal >= 0 ? "text-green-500" : "text-red-500"}`} />
              <h4
                className={`font-semibold ${
                  saldoFinal >= 0
                    ? "text-green-700 dark:text-green-400"
                    : "text-red-700 dark:text-red-400"
                }`}
              >
                Saldo Final
              </h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor Após Franquia</span>
                <span className="font-medium">{formatCurrency(valorAposFranquia)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">(-) Total Deduções</span>
                <span className="font-medium text-red-600">-{formatCurrency(totalDeducoes)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">(+) Total Inclusões</span>
                <span className="font-medium text-green-600">+{formatCurrency(totalInclusoes)}</span>
              </div>
              <div
                className={`border-t pt-2 ${
                  saldoFinal >= 0 ? "border-green-200 dark:border-green-800" : "border-red-200 dark:border-red-800"
                }`}
              >
                <div
                  className={`flex justify-between text-xl font-bold ${
                    saldoFinal >= 0
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-700 dark:text-red-400"
                  }`}
                >
                  <span>TOTAL FINAL</span>
                  <span>{formatCurrency(saldoFinal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
