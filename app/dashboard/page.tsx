"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  FileText,
  TrendingDown,
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChartIcon,
  ArrowLeft,
  RefreshCw,
} from "lucide-react"

interface DashboardData {
  metricas: {
    totalLaudos: number
    totalDeducoes: number
    totalInclusoes: number
    totalSaldo: number
    totalOrcamento: number
    totalFranquia: number
    mediaDeducao: number
    mediaInclusao: number
  }
  agentesCausa: Array<{ nome: string; quantidade: number }>
  motivos: Array<{ nome: string; quantidade: number }>
  tiposOficina: Array<{ nome: string; quantidade: number }>
  tiposCliente: Array<{ nome: string; quantidade: number }>
  credenciamentos: Array<{ nome: string; quantidade: number }>
  evolucaoMensal: Array<{ mes: string; laudos: number; deducoes: number; inclusoes: number }>
  ultimosLaudos: Array<{
    id: string
    sinistro: string
    placa: string
    oficina: string
    agenteCausa: string
    motivo: string
    totalDeducoes: number
    totalInclusoes: number
    saldoFinal: number
    createdAt: string
  }>
}

const COLORS = ["#0066a1", "#5a9a7a", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16"]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/dashboard")
      if (!response.ok) throw new Error("Erro ao carregar dados")
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError("Erro ao carregar dados do dashboard")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ControlExpert_a_solvd_group_company_left%20%283%29-wC5qwyBGMnRbrukfXswRCWNGb6TI62.png"
                alt="ControlExpert"
                className="h-10 w-auto"
              />
              <div className="h-8 w-px bg-border" />
              <h1 className="text-xl font-bold text-primary">DASHBOARD DE INDICADORES</h1>
            </div>
          </div>
        </header>
        <main className="container py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error || "Erro ao carregar dados"}</p>
            <Button onClick={fetchData}>Tentar novamente</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ControlExpert_a_solvd_group_company_left%20%283%29-wC5qwyBGMnRbrukfXswRCWNGb6TI62.png"
              alt="ControlExpert"
              className="h-10 w-auto"
            />
            <div className="h-8 w-px bg-border" />
            <h1 className="text-xl font-bold text-primary">DASHBOARD DE INDICADORES</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchData}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
            <Link href="/">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Laudo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Métricas Principais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Laudos
              </CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.metricas.totalLaudos}</div>
              <p className="text-xs text-muted-foreground mt-1">laudos registrados</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Deduções
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(data.metricas.totalDeducoes)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Média: {formatCurrency(data.metricas.mediaDeducao)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Inclusões
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(data.metricas.totalInclusoes)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Média: {formatCurrency(data.metricas.mediaInclusao)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saldo Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${data.metricas.totalSaldo >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(data.metricas.totalSaldo)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">resultado acumulado</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Por Agente da Causa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Por Agente da Causa
              </CardTitle>
              <CardDescription>Distribuição de laudos por agente responsável</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.agentesCausa} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="nome" type="category" width={120} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#0066a1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Por Motivo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" />
                Top 10 Motivos
              </CardTitle>
              <CardDescription>Motivos mais frequentes nas glosas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.motivos}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ nome, percent }) =>
                        percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="quantidade"
                      nameKey="nome"
                    >
                      {data.motivos.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, name]} />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      wrapperStyle={{ fontSize: "10px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Por Tipo de Oficina e Cliente */}
          <Card>
            <CardHeader>
              <CardTitle>Por Tipo de Oficina e Cliente</CardTitle>
              <CardDescription>Segmentação dos laudos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-3">Tipo de Oficina</h4>
                  <div className="space-y-2">
                    {data.tiposOficina.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm">{item.nome}</span>
                        <span className="text-sm font-bold">{item.quantidade}</span>
                      </div>
                    ))}
                    {data.tiposOficina.length === 0 && (
                      <p className="text-sm text-muted-foreground">Sem dados</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-3">Tipo de Cliente</h4>
                  <div className="space-y-2">
                    {data.tiposCliente.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm">{item.nome}</span>
                        <span className="text-sm font-bold">{item.quantidade}</span>
                      </div>
                    ))}
                    {data.tiposCliente.length === 0 && (
                      <p className="text-sm text-muted-foreground">Sem dados</p>
                    )}
                  </div>
                </div>
                <div className="col-span-2 mt-4">
                  <h4 className="text-sm font-semibold mb-3">Credenciamento</h4>
                  <div className="flex gap-4">
                    {data.credenciamentos.map((item, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-lg border bg-muted/30 p-3 text-center"
                      >
                        <div className="text-2xl font-bold text-primary">{item.quantidade}</div>
                        <div className="text-xs text-muted-foreground">{item.nome}</div>
                      </div>
                    ))}
                    {data.credenciamentos.length === 0 && (
                      <p className="text-sm text-muted-foreground">Sem dados</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evolução Mensal */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução Mensal</CardTitle>
              <CardDescription>Quantidade de laudos e valores ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {data.evolucaoMensal.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.evolucaoMensal}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          name === "laudos" ? value : formatCurrency(value),
                          name === "laudos"
                            ? "Laudos"
                            : name === "deducoes"
                            ? "Deduções"
                            : "Inclusões",
                        ]}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="laudos"
                        stroke="#0066a1"
                        strokeWidth={2}
                        name="Laudos"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="deducoes"
                        stroke="#ef4444"
                        strokeWidth={2}
                        name="Deduções"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="inclusoes"
                        stroke="#22c55e"
                        strokeWidth={2}
                        name="Inclusões"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Sem dados de evolução mensal
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Últimos Laudos */}
        <Card>
          <CardHeader>
            <CardTitle>Últimos Laudos Registrados</CardTitle>
            <CardDescription>Os 10 laudos mais recentes no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {data.ultimosLaudos.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sinistro</TableHead>
                      <TableHead>Placa</TableHead>
                      <TableHead>Oficina</TableHead>
                      <TableHead>Agente</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead className="text-right">Deduções</TableHead>
                      <TableHead className="text-right">Inclusões</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.ultimosLaudos.map((laudo) => (
                      <TableRow key={laudo.id}>
                        <TableCell className="font-medium">{laudo.sinistro || "-"}</TableCell>
                        <TableCell>{laudo.placa || "-"}</TableCell>
                        <TableCell className="max-w-32 truncate">{laudo.oficina || "-"}</TableCell>
                        <TableCell>{laudo.agenteCausa || "-"}</TableCell>
                        <TableCell className="max-w-40 truncate text-xs">
                          {laudo.motivo || "-"}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatCurrency(laudo.totalDeducoes || 0)}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(laudo.totalInclusoes || 0)}
                        </TableCell>
                        <TableCell
                          className={`text-right font-semibold ${
                            (laudo.saldoFinal || 0) >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {formatCurrency(laudo.saldoFinal || 0)}
                        </TableCell>
                        <TableCell className="text-xs">
                          {new Date(laudo.createdAt).toLocaleDateString("pt-BR")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum laudo registrado ainda. Crie seu primeiro laudo para ver os dados aqui.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
