"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table"
import type { PecaGlosada } from "@/lib/report-data"
import { Package, Plus, Trash2 } from "lucide-react"

interface PecasSectionProps {
  data: PecaGlosada[]
  onChange: (data: PecaGlosada[]) => void
}

export function PecasSection({ data, onChange }: PecasSectionProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleAddPeca = () => {
    const newPeca: PecaGlosada = {
      id: crypto.randomUUID(),
      quantidade: 1,
      codigoPeca: "",
      descricao: "",
      valorBrutoUnitario: 0,
      desconto: 0,
      valorLiquidoTotal: 0,
      valorLiquidoNegociado: 0,
    }
    onChange([...data, newPeca])
  }

  const handleRemovePeca = (id: string) => {
    onChange(data.filter((peca) => peca.id !== id))
  }

  const handlePecaChange = (id: string, field: keyof PecaGlosada, value: string | number) => {
    onChange(
      data.map((peca) => {
        if (peca.id !== id) return peca

        const updatedPeca = { ...peca, [field]: value }

        // Recalcular valores
        if (field === "valorBrutoUnitario" || field === "desconto" || field === "quantidade") {
          const bruto = updatedPeca.valorBrutoUnitario * updatedPeca.quantidade
          const descontoValor = (bruto * updatedPeca.desconto) / 100
          updatedPeca.valorLiquidoTotal = bruto - descontoValor
        }

        return updatedPeca
      })
    )
  }

  const totals = data.reduce(
    (acc, peca) => ({
      valorBruto: acc.valorBruto + peca.valorBrutoUnitario * peca.quantidade,
      desconto: acc.desconto + ((peca.valorBrutoUnitario * peca.quantidade * peca.desconto) / 100),
      valorLiquido: acc.valorLiquido + peca.valorLiquidoTotal,
      valorNegociado: acc.valorNegociado + peca.valorLiquidoNegociado,
    }),
    { valorBruto: 0, desconto: 0, valorLiquido: 0, valorNegociado: 0 }
  )

  return (
    <Card className="border-l-4 border-l-indigo-500">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5 text-indigo-500" />
            Glosas de Peças
          </CardTitle>
          <Button onClick={handleAddPeca} size="sm" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Peça
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">Qtde</TableHead>
                <TableHead className="w-32">Código</TableHead>
                <TableHead className="min-w-48">Descrição</TableHead>
                <TableHead className="w-32 text-right">Valor Bruto Unit. (R$)</TableHead>
                <TableHead className="w-24 text-right">Desconto (%)</TableHead>
                <TableHead className="w-32 text-right">Valor Líquido (R$)</TableHead>
                <TableHead className="w-32 text-right">Valor Negociado (R$)</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    Nenhuma peça adicionada. Clique em &quot;Adicionar Peça&quot; para começar.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((peca) => (
                  <TableRow key={peca.id}>
                    <TableCell>
                      <Input
                        type="number"
                        min={1}
                        value={peca.quantidade}
                        onChange={(e) =>
                          handlePecaChange(peca.id, "quantidade", parseInt(e.target.value) || 1)
                        }
                        className="w-16"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={peca.codigoPeca}
                        onChange={(e) => handlePecaChange(peca.id, "codigoPeca", e.target.value)}
                        placeholder="Código"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={peca.descricao}
                        onChange={(e) => handlePecaChange(peca.id, "descricao", e.target.value)}
                        placeholder="Descrição da peça"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        value={peca.valorBrutoUnitario}
                        onChange={(e) =>
                          handlePecaChange(peca.id, "valorBrutoUnitario", parseFloat(e.target.value) || 0)
                        }
                        className="text-right"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.1"
                        min={0}
                        max={100}
                        value={peca.desconto}
                        onChange={(e) =>
                          handlePecaChange(peca.id, "desconto", parseFloat(e.target.value) || 0)
                        }
                        className="text-right"
                      />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(peca.valorLiquidoTotal)}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        value={peca.valorLiquidoNegociado}
                        onChange={(e) =>
                          handlePecaChange(
                            peca.id,
                            "valorLiquidoNegociado",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="text-right"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePeca(peca.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {data.length > 0 && (
              <TableFooter>
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell colSpan={3} className="text-right">
                    Totais:
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(totals.valorBruto)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(totals.desconto)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(totals.valorLiquido)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(totals.valorNegociado)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
