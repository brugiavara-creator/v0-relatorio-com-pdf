"use client"

import { useEffect, useState, useCallback } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
  Upload,
  Filter,
  X,
  Building2,
  Car,
  MapPin,
} from "lucide-react"

interface DashboardData {
  metricas: {
    totalLaudos: number
    totalDeducoes: number
    totalInclusoes: number
    totalSaldo: number
    totalOrcamento: number
    totalFranquia: number
    totalSavingPecas: number
    totalSavingMO: number
    totalSavingReal: number
    totalSavingPotencial: number
    mediaDeducao: number
    mediaInclusao: number
  }
  seguradoras: Array<{ nome: string; quantidade: number }>
  agentesCausa: Array<{ nome: string; quantidade: number }>
  motivos: Array<{ nome: string; quantidade: number }>
  tiposOficina: Array<{ nome: string; quantidade: number }>
  tiposCliente: Array<{ nome: string; quantidade: number }>
  credenciamentos: Array<{ nome: string; quantidade: number }>
  ufs: Array<{ nome: string; quantidade: number }>
  houveAjustes: Array<{ nome: string; quantidade: number }>
  evolucaoMensal: Array<{ mes: string; laudos: number; deducoes: number; inclusoes: number; savingPecas: number; savingMO: number }>
  ultimosLaudos: Array<{
    id: string
    seguradora: string
    sinistro: string
    placa: string
    modelo: string
    oficina: string
    tipoOficina: string
    credenciamento: string
    tipoCliente: string
    uf: string
    agenteCausa: string
    motivo: string
    valorOrcamento: number
    savingPecas: number
    savingMO: number
    totalDeducoes: number
    totalInclusoes: number
    saldoFinal: number
    houveAjuste: string
    dataInspecao: string
    mes: number
    ano: number
    createdAt: string
  }>
  filtros: {
    seguradoras: string[]
    motivos: string[]
    agentesCausa: string[]
    tiposOficina: string[]
    credenciamentos: string[]
    tiposCliente: string[]
    ufs: string[]
    meses: number[]
    anos: number[]
    houveAjustes: string[]
  }
}

interface Filters {
  seguradora: string
  mes: string
  ano: string
  motivo: string
  agente_causa: string
  tipo_oficina: string
  credenciamento: string
  tipo_cliente: string
  uf: string
  houve_ajuste: string
}

const COLORS = ["#0066a1", "#5a9a7a", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16", "#14b8a6", "#f97316"]

const MESES_NOMES = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

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
  const [filters, setFilters] = useState<Filters>({
    seguradora: "",
    mes: "",
    ano: "",
    motivo: "",
    agente_causa: "",
    tipo_oficina: "",
    credenciamento: "",
    tipo_cliente: "",
    uf: "",
    houve_ajuste: "",
  })
  const [showFilters, setShowFilters] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      
      const response = await fetch(`/api/dashboard?${params.toString()}`)
      if (!response.ok) throw new Error("Erro ao carregar dados")
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError("Erro ao carregar dados do dashboard")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      seguradora: "",
      mes: "",
      ano: "",
      motivo: "",
      agente_causa: "",
      tipo_oficina: "",
      credenciamento: "",
      tipo_cliente: "",
      uf: "",
      houve_ajuste: "",
    })
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  if (loading && !data) {
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
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
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
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            <Link href="/import">
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Importar
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            <Link href="/">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {/* Filtros */}
        {showFilters && data?.filtros && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                </CardTitle>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="mr-2 h-4 w-4" />
                    Limpar filtros
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                {/* Seguradora */}
                <div className="space-y-1">
                  <Label className="text-xs">Seguradora</Label>
                  <Select value={filters.seguradora} onValueChange={(v) => handleFilterChange("seguradora", v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      {data.filtros.seguradoras.map((seg) => (
                        <SelectItem key={seg} value={seg}>{seg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Ano */}
                <div className="space-y-1">
                  <Label className="text-xs">Ano</Label>
                  <Select value={filters.ano} onValueChange={(v) => handleFilterChange("ano", v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {data.filtros.anos.map((ano) => (
                        <SelectItem key={ano} value={String(ano)}>{ano}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mês */}
                <div className="space-y-1">
                  <Label className="text-xs">Mes</Label>
                  <Select value={filters.mes} onValueChange={(v) => handleFilterChange("mes", v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {data.filtros.meses.map((mes) => (
                        <SelectItem key={mes} value={String(mes)}>{MESES_NOMES[mes]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* UF */}
                <div className="space-y-1">
                  <Label className="text-xs">UF</Label>
                  <Select value={filters.uf} onValueChange={(v) => handleFilterChange("uf", v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {data.filtros.ufs.map((uf) => (
                        <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tipo Oficina */}
                <div className="space-y-1">
                  <Label className="text-xs">Tipo Oficina</Label>
                  <Select value={filters.tipo_oficina} onValueChange={(v) => handleFilterChange("tipo_oficina", v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {data.filtros.tiposOficina.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Credenciamento */}
                <div className="space-y-1">
                  <Label className="text-xs">Credenciamento</Label>
                  <Select value={filters.credenciamento} onValueChange={(v) => handleFilterChange("credenciamento", v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {data.filtros.credenciamentos.map((cred) => (
                        <SelectItem key={cred} value={cred}>{cred}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tipo Cliente */}
                <div className="space-y-1">
                  <Label className="text-xs">Tipo Cliente</Label>
                  <Select value={filters.tipo_cliente} onValueChange={(v) => handleFilterChange("tipo_cliente", v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {data.filtros.tiposCliente.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Agente Causa */}
                <div className="space-y-1">
                  <Label className="text-xs">Agente Causa</Label>
                  <Select value={filters.agente_causa} onValueChange={(v) => handleFilterChange("agente_causa", v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {data.filtros.agentesCausa.map((agente) => (
                        <SelectItem key={agente} value={agente}>{agente}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Houve Ajuste */}
                <div className="space-y-1">
                  <Label className="text-xs">Houve Ajuste</Label>
                  <Select value={filters.houve_ajuste} onValueChange={(v) => handleFilterChange("houve_ajuste", v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {data.filtros.houveAjustes.map((ajuste) => (
                        <SelectItem key={ajuste} value={ajuste}>{ajuste}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Motivo */}
                <div className="space-y-1">
                  <Label className="text-xs">Motivo</Label>
                  <Select value={filters.motivo} onValueChange={(v) => handleFilterChange("motivo", v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {data.filtros.motivos.slice(0, 20).map((motivo) => (
                        <SelectItem key={motivo} value={motivo}>{motivo.substring(0, 50)}{motivo.length > 50 ? "..." : ""}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Métricas Principais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Laudos</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data?.metricas.totalLaudos || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">laudos registrados</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saving Pecas</CardTitle>
              <Car className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(data?.metricas.totalSavingPecas || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">economia em pecas</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saving MO</CardTitle>
              <Building2 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(data?.metricas.totalSavingMO || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">economia em mao de obra</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Saving</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency((data?.metricas.totalSavingPecas || 0) + (data?.metricas.totalSavingMO || 0))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">economia total</p>
            </CardContent>
          </Card>
        </div>

        {/* Segunda linha de métricas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Deducoes</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(data?.metricas.totalDeducoes || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Media: {formatCurrency(data?.metricas.mediaDeducao || 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Inclusoes</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {formatCurrency(data?.metricas.totalInclusoes || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Media: {formatCurrency(data?.metricas.mediaInclusao || 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Valor Orcamento</CardTitle>
              <DollarSign className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {formatCurrency(data?.metricas.totalOrcamento || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">valor total orcado</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-cyan-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Final</CardTitle>
              <MapPin className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${(data?.metricas.totalSaldo || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(data?.metricas.totalSaldo || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">resultado acumulado</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          {/* Por Seguradora */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Por Seguradora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.seguradoras || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#0066a1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Por Agente da Causa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Por Agente da Causa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.agentesCausa || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="nome" type="category" width={100} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#5a9a7a" radius={[0, 4, 4, 0]} />
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
                Top 15 Motivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.motivos || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="quantidade"
                      nameKey="nome"
                    >
                      {(data?.motivos || []).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, name]} />
                    <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: "9px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Por UF */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Por UF
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={(data?.ufs || []).slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Distribuição */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuicao por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-3">Tipo de Oficina</h4>
                  <div className="space-y-2">
                    {(data?.tiposOficina || []).map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs truncate max-w-24">{item.nome}</span>
                        <Badge variant="secondary">{item.quantidade}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-3">Tipo de Cliente</h4>
                  <div className="space-y-2">
                    {(data?.tiposCliente || []).map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs truncate max-w-24">{item.nome}</span>
                        <Badge variant="secondary">{item.quantidade}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-3">Credenciamento</h4>
                  <div className="space-y-2">
                    {(data?.credenciamentos || []).map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs truncate max-w-24">{item.nome}</span>
                        <Badge variant="secondary">{item.quantidade}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-3">Houve Ajuste</h4>
                  <div className="space-y-2">
                    {(data?.houveAjustes || []).map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs">{item.nome}</span>
                        <Badge variant={item.nome === "SIM" ? "default" : "secondary"}>{item.quantidade}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evolução Mensal */}
          <Card>
            <CardHeader>
              <CardTitle>Evolucao Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {(data?.evolucaoMensal || []).length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.evolucaoMensal}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip formatter={(value: number, name: string) => [
                        name === "laudos" ? value : formatCurrency(value),
                        name === "laudos" ? "Laudos" : name === "savingPecas" ? "Saving Pecas" : "Saving MO"
                      ]} />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="laudos" stroke="#0066a1" strokeWidth={2} name="Laudos" />
                      <Line yAxisId="right" type="monotone" dataKey="savingPecas" stroke="#5a9a7a" strokeWidth={2} name="Saving Pecas" />
                      <Line yAxisId="right" type="monotone" dataKey="savingMO" stroke="#f59e0b" strokeWidth={2} name="Saving MO" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">Sem dados</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Laudos */}
        <Card>
          <CardHeader>
            <CardTitle>Laudos Registrados</CardTitle>
            <CardDescription>Ultimos 50 laudos {activeFiltersCount > 0 ? "(filtrados)" : ""}</CardDescription>
          </CardHeader>
          <CardContent>
            {(data?.ultimosLaudos || []).length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Seguradora</TableHead>
                      <TableHead className="text-xs">Sinistro</TableHead>
                      <TableHead className="text-xs">Placa</TableHead>
                      <TableHead className="text-xs">UF</TableHead>
                      <TableHead className="text-xs">Oficina</TableHead>
                      <TableHead className="text-xs">Tipo</TableHead>
                      <TableHead className="text-xs">Agente</TableHead>
                      <TableHead className="text-xs text-right">Orcamento</TableHead>
                      <TableHead className="text-xs text-right">Saving Pecas</TableHead>
                      <TableHead className="text-xs text-right">Saving MO</TableHead>
                      <TableHead className="text-xs">Ajuste</TableHead>
                      <TableHead className="text-xs">Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.ultimosLaudos.map((laudo) => (
                      <TableRow key={laudo.id}>
                        <TableCell className="text-xs font-medium">{laudo.seguradora || "-"}</TableCell>
                        <TableCell className="text-xs">{laudo.sinistro || "-"}</TableCell>
                        <TableCell className="text-xs">{laudo.placa || "-"}</TableCell>
                        <TableCell className="text-xs">{laudo.uf || "-"}</TableCell>
                        <TableCell className="text-xs max-w-24 truncate">{laudo.oficina || "-"}</TableCell>
                        <TableCell className="text-xs">{laudo.tipoOficina || "-"}</TableCell>
                        <TableCell className="text-xs">{laudo.agenteCausa || "-"}</TableCell>
                        <TableCell className="text-xs text-right">{formatCurrency(laudo.valorOrcamento || 0)}</TableCell>
                        <TableCell className="text-xs text-right text-blue-600">{formatCurrency(laudo.savingPecas || 0)}</TableCell>
                        <TableCell className="text-xs text-right text-purple-600">{formatCurrency(laudo.savingMO || 0)}</TableCell>
                        <TableCell className="text-xs">
                          <Badge variant={laudo.houveAjuste === "SIM" ? "default" : "secondary"} className="text-xs">
                            {laudo.houveAjuste || "-"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {laudo.dataInspecao ? new Date(laudo.dataInspecao).toLocaleDateString("pt-BR") : 
                           laudo.mes && laudo.ano ? `${laudo.mes}/${laudo.ano}` : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum laudo encontrado. {activeFiltersCount > 0 ? "Tente ajustar os filtros." : "Importe dados para ver os resultados."}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
