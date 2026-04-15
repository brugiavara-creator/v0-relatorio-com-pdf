"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table"
import type { MaoDeObraGlosa, MaoDeObraItem, ServicosTerceiros } from "@/lib/report-data"
import { Wrench, TrendingDown, TrendingUp } from "lucide-react"

interface MaoDeObraSectionProps {
  data: MaoDeObraGlosa
  servicosTerceiros: ServicosTerceiros
  onChange: (data: MaoDeObraGlosa) => void
  onServicosTerceirosChange: (data: ServicosTerceiros) => void
}

export function MaoDeObraSection({
  data,
  servicosTerceiros,
  onChange,
  onServicosTerceirosChange,
}: MaoDeObraSectionProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleDeducaoChange = (
    tipo: MaoDeObraItem["tipo"],
    field: "valorHora" | "horas",
    value: number
  ) => {
    const updatedDeducao = data.deducao.map((item) => {
      if (item.tipo !== tipo) return item
      const updated = { ...item, [field]: value }
      updated.valor = updated.valorHora * updated.horas
      return updated
    })
    onChange({ ...data, deducao: updatedDeducao })
  }

  const handleValorizacaoChange = (
    tipo: MaoDeObraItem["tipo"],
    field: "valorHora" | "horas",
    value: number
  ) => {
    const updatedValorizacao = data.valorizacao.map((item) => {
      if (item.tipo !== tipo) return item
      const updated = { ...item, [field]: value }
      updated.valor = updated.valorHora * updated.horas
      return updated
    })
    onChange({ ...data, valorizacao: updatedValorizacao })
  }

  const totalDeducao = data.deducao.reduce((acc, item) => acc + item.valor, 0)
  const totalValorizacao = data.valorizacao.reduce((acc, item) => acc + item.valor, 0)
  const totalHorasDeducao = data.deducao.reduce((acc, item) => acc + item.horas, 0)
  const totalHorasValorizacao = data.valorizacao.reduce((acc, item) => acc + item.horas, 0)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Dedução de Mão de Obra */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingDown className="h-5 w-5 text-red-500" />
            Dedução de Mão de Obra
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Tipo</TableHead>
                <TableHead className="w-28 text-right">R$/h</TableHead>
                <TableHead className="w-24 text-right">Horas</TableHead>
                <TableHead className="w-32 text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.deducao.map((item) => (
                <TableRow key={item.tipo}>
                  <TableCell className="font-medium">{item.label}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      value={item.valorHora}
                      onChange={(e) =>
                        handleDeducaoChange(item.tipo, "valorHora", parseFloat(e.target.value) || 0)
                      }
                      className="text-right"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.5"
                      min={0}
                      value={item.horas}
                      onChange={(e) =>
                        handleDeducaoChange(item.tipo, "horas", parseFloat(e.target.value) || 0)
                      }
                      className="text-right"
                    />
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(item.valor)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-red-50 dark:bg-red-950/30 font-semibold">
                <TableCell>Total</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">{totalHorasDeducao}h</TableCell>
                <TableCell className="text-right text-red-600 dark:text-red-400">
                  {formatCurrency(totalDeducao)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          {/* Dedução Serviços de Terceiros */}
          <div className="mt-4 rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Dedução Serviços de Terceiros</span>
              <Input
                type="number"
                step="0.01"
                min={0}
                value={servicosTerceiros.deducaoTotal}
                onChange={(e) =>
                  onServicosTerceirosChange({
                    ...servicosTerceiros,
                    deducaoTotal: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-32 text-right"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Valorização de Mão de Obra */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Valorização de Mão de Obra
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Tipo</TableHead>
                <TableHead className="w-28 text-right">R$/h</TableHead>
                <TableHead className="w-24 text-right">Horas</TableHead>
                <TableHead className="w-32 text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.valorizacao.map((item) => (
                <TableRow key={item.tipo}>
                  <TableCell className="font-medium">{item.label}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      value={item.valorHora}
                      onChange={(e) =>
                        handleValorizacaoChange(item.tipo, "valorHora", parseFloat(e.target.value) || 0)
                      }
                      className="text-right"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.5"
                      min={0}
                      value={item.horas}
                      onChange={(e) =>
                        handleValorizacaoChange(item.tipo, "horas", parseFloat(e.target.value) || 0)
                      }
                      className="text-right"
                    />
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(item.valor)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-green-50 dark:bg-green-950/30 font-semibold">
                <TableCell>Total</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">{totalHorasValorizacao}h</TableCell>
                <TableCell className="text-right text-green-600 dark:text-green-400">
                  {formatCurrency(totalValorizacao)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          {/* Valorização Serviços de Terceiros */}
          <div className="mt-4 rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Valorização Serviços de Terceiros</span>
              <Input
                type="number"
                step="0.01"
                min={0}
                value={servicosTerceiros.valorizacaoTotal}
                onChange={(e) =>
                  onServicosTerceirosChange({
                    ...servicosTerceiros,
                    valorizacaoTotal: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-32 text-right"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
