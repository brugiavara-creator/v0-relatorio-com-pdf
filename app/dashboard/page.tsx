"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  ArrowLeft,
  RefreshCw,
  Upload,
  Filter,
  X,
  Search,
  Building2,
  Calendar,
  MapPin,
  Users,
  Car,
} from "lucide-react"

const CHART_COLORS = [
  "#0066a1",
  "#5a9a7a", 
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
  "#06b6d4",
]

const MESES_NOMES = ["", "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

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
  }
  seguradoras: Array<{ nome: string; quantidade: number }>
  agentesCausa: Array<{ nome: string; quantidade: number }>
  motivos: Array<{ nome: string; quantidade: number }>
  tiposOficina: Array<{ nome: string; quantidade: number }>
  ufs: Array<{ nome: string; quantidade: number }>
  evolucaoMensal: Array<{ mes: string; laudos: number; savingPecas: number; savingMO: number }>
  ultimosLaudos: Array<{
    id: string
    seguradora: string
    sinistro: string
    placa: string
    modelo: string
    oficina: string
    uf: string
    agenteCausa: string
    motivo: string
    savingPecas: number
    savingMO: number
    saldoFinal: number
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

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0)
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("pt-BR").format(value || 0)
}

function MetricCard({ 
  title, 
  value, 
  subtitle,
  icon: Icon, 
  color = "blue",
  isLoading = false 
}: { 
  title: string
  value: string
  subtitle?: string
  icon: React.ElementType
  color?: "blue" | "green" | "orange" | "red" | "purple"
  isLoading?: boolean
}) {
  const styles = {
    blue: { bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800", icon: "text-blue-600 bg-blue-100 dark:bg-blue-900", text: "text-blue-700" },
    green: { bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800", icon: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900", text: "text-emerald-700" },
    orange: { bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800", icon: "text-amber-600 bg-amber-100 dark:bg-amber-900", text: "text-amber-700" },
    red: { bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800", icon: "text-red-600 bg-red-100 dark:bg-red-900", text: "text-red-700" },
    purple: { bg: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-200 dark:border-purple-800", icon: "text-purple-600 bg-purple-100 dark:bg-purple-900", text: "text-purple-700" },
  }

  const s = styles[color]

  if (isLoading) {
    return (
      <Card className={`${s.bg} ${s.border} border`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${s.bg} ${s.border} border transition-all hover:shadow-md`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${s.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide truncate">{title}</p>
            <p className={`text-xl font-bold ${s.text} truncate`}>{value}</p>
            {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
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

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      const response = await fetch(`/api/dashboard?${params.toString()}`)
      const result = await response.json()
      setData(result)
    } catch (err) {
      console.error("Erro ao carregar dados:", err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const clearFilters = () => {
    setFilters({
      seguradora: "", mes: "", ano: "", motivo: "", agente_causa: "",
      tipo_oficina: "", credenciamento: "", tipo_cliente: "", uf: "", houve_ajuste: "",
    })
  }

  const filteredLaudos = useMemo(() => {
    if (!data?.ultimosLaudos) return []
    if (!searchTerm) return data.ultimosLaudos
    const term = searchTerm.toLowerCase()
    return data.ultimosLaudos.filter(l => 
      l.sinistro?.toLowerCase().includes(term) ||
      l.placa?.toLowerCase().includes(term) ||
      l.oficina?.toLowerCase().includes(term)
    )
  }, [data?.ultimosLaudos, searchTerm])

  const chartSeguradora = useMemo(() => 
    (data?.seguradoras || []).map((item, i) => ({
      name: item.nome || "N/A",
      total: item.quantidade,
      fill: CHART_COLORS[i % CHART_COLORS.length],
    })), [data?.seguradoras])

  const chartMotivo = useMemo(() => 
    (data?.motivos || []).slice(0, 8).map((item, i) => ({
      name: item.nome?.substring(0, 25) || "N/A",
      value: item.quantidade,
      fill: CHART_COLORS[i % CHART_COLORS.length],
    })), [data?.motivos])

  const chartUF = useMemo(() => 
    (data?.ufs || []).slice(0, 10).map((item, i) => ({
      name: item.nome || "N/A",
      total: item.quantidade,
      fill: CHART_COLORS[i % CHART_COLORS.length],
    })), [data?.ufs])

  const chartMensal = useMemo(() => 
    (data?.evolucaoMensal || []).map(item => ({
      name: item.mes,
      laudos: item.laudos,
    })), [data?.evolucaoMensal])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ControlExpert_a_solvd_group_company_left%20%283%29-wC5qwyBGMnRbrukfXswRCWNGb6TI62.png" 
                alt="ControlExpert"
                className="h-8 w-auto"
              />
              <div className="hidden sm:block h-6 w-px bg-border" />
              <h1 className="hidden sm:block text-lg font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/import">
                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  <span className="hidden sm:inline">Importar</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={fetchData} className="h-8 px-3 text-xs">
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
              <Link href="/">
                <Button size="sm" className="h-8 px-3 text-xs bg-primary">
                  <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                  Novo Laudo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Filtros Compactos */}
        <Card className="border-dashed bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtros</span>
              {activeFiltersCount > 0 && (
                <>
                  <Badge variant="secondary" className="text-[10px] h-5">{activeFiltersCount}</Badge>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-[10px] ml-auto">
                    <X className="h-3 w-3 mr-1" />Limpar
                  </Button>
                </>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
              <Select value={filters.seguradora} onValueChange={(v) => setFilters(f => ({ ...f, seguradora: v }))}>
                <SelectTrigger className="h-8 text-xs"><Building2 className="h-3 w-3 mr-1 text-muted-foreground" /><SelectValue placeholder="Seguradora" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  {(data?.filtros?.seguradoras || []).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.ano} onValueChange={(v) => setFilters(f => ({ ...f, ano: v }))}>
                <SelectTrigger className="h-8 text-xs"><Calendar className="h-3 w-3 mr-1 text-muted-foreground" /><SelectValue placeholder="Ano" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {(data?.filtros?.anos || []).map(a => <SelectItem key={a} value={String(a)}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.mes} onValueChange={(v) => setFilters(f => ({ ...f, mes: v }))}>
                <SelectTrigger className="h-8 text-xs"><Calendar className="h-3 w-3 mr-1 text-muted-foreground" /><SelectValue placeholder="Mes" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {(data?.filtros?.meses || []).map(m => <SelectItem key={m} value={String(m)}>{MESES_NOMES[m]}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.uf} onValueChange={(v) => setFilters(f => ({ ...f, uf: v }))}>
                <SelectTrigger className="h-8 text-xs"><MapPin className="h-3 w-3 mr-1 text-muted-foreground" /><SelectValue placeholder="UF" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {(data?.filtros?.ufs || []).map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.agente_causa} onValueChange={(v) => setFilters(f => ({ ...f, agente_causa: v }))}>
                <SelectTrigger className="h-8 text-xs"><Users className="h-3 w-3 mr-1 text-muted-foreground" /><SelectValue placeholder="Agente" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {(data?.filtros?.agentesCausa || []).map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.tipo_oficina} onValueChange={(v) => setFilters(f => ({ ...f, tipo_oficina: v }))}>
                <SelectTrigger className="h-8 text-xs"><Car className="h-3 w-3 mr-1 text-muted-foreground" /><SelectValue placeholder="Oficina" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {(data?.filtros?.tiposOficina || []).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* KPIs - 2 rows of 4 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard title="Total Laudos" value={formatNumber(data?.metricas?.totalLaudos || 0)} icon={FileText} color="blue" isLoading={loading} />
          <MetricCard title="Saving Pecas" value={formatCurrency(data?.metricas?.totalSavingPecas || 0)} icon={Car} color="green" isLoading={loading} />
          <MetricCard title="Saving M.O." value={formatCurrency(data?.metricas?.totalSavingMO || 0)} icon={Building2} color="purple" isLoading={loading} />
          <MetricCard title="Total Saving" value={formatCurrency((data?.metricas?.totalSavingPecas || 0) + (data?.metricas?.totalSavingMO || 0))} icon={TrendingUp} color="green" isLoading={loading} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard title="Total Deducoes" value={formatCurrency(data?.metricas?.totalDeducoes || 0)} icon={TrendingDown} color="red" isLoading={loading} />
          <MetricCard title="Total Inclusoes" value={formatCurrency(data?.metricas?.totalInclusoes || 0)} icon={TrendingUp} color="green" isLoading={loading} />
          <MetricCard title="Total Orcamento" value={formatCurrency(data?.metricas?.totalOrcamento || 0)} icon={DollarSign} color="blue" isLoading={loading} />
          <MetricCard title="Saldo Final" value={formatCurrency(data?.metricas?.totalSaldo || 0)} icon={DollarSign} color={(data?.metricas?.totalSaldo || 0) >= 0 ? "green" : "red"} isLoading={loading} />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Seguradora */}
          <Card>
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-sm font-medium">Por Seguradora</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {loading ? <Skeleton className="h-[200px]" /> : (
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartSeguradora} layout="vertical" margin={{ left: 0, right: 16 }}>
                      <XAxis type="number" fontSize={10} tickFormatter={formatNumber} />
                      <YAxis type="category" dataKey="name" fontSize={10} width={90} tickLine={false} axisLine={false} />
                      <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                        {chartSeguradora.map((e, i) => <Cell key={i} fill={e.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* UF */}
          <Card>
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-sm font-medium">Top 10 UFs</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {loading ? <Skeleton className="h-[200px]" /> : (
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartUF} margin={{ left: 0, right: 16 }}>
                      <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis fontSize={10} tickFormatter={formatNumber} />
                      <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                        {chartUF.map((e, i) => <Cell key={i} fill={e.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Motivos */}
          <Card>
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-sm font-medium">Top Motivos</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {loading ? <Skeleton className="h-[200px]" /> : (
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartMotivo} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={2} dataKey="value">
                        {chartMotivo.map((e, i) => <Cell key={i} fill={e.fill} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evolucao Mensal */}
          <Card>
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-sm font-medium">Evolucao Mensal</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {loading ? <Skeleton className="h-[200px]" /> : (
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartMensal} margin={{ left: 0, right: 16 }}>
                      <defs>
                        <linearGradient id="colorLaudos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0066a1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0066a1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" fontSize={10} tickLine={false} />
                      <YAxis fontSize={10} tickFormatter={formatNumber} />
                      <Area type="monotone" dataKey="laudos" stroke="#0066a1" fillOpacity={1} fill="url(#colorLaudos)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabela */}
        <Card>
          <CardHeader className="pb-3 px-4 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="text-sm font-medium">Ultimos Laudos</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 h-8 text-xs" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-[11px] font-medium h-9">Seguradora</TableHead>
                    <TableHead className="text-[11px] font-medium h-9">Sinistro</TableHead>
                    <TableHead className="text-[11px] font-medium h-9">Placa</TableHead>
                    <TableHead className="text-[11px] font-medium h-9">Oficina</TableHead>
                    <TableHead className="text-[11px] font-medium h-9">Agente</TableHead>
                    <TableHead className="text-[11px] font-medium h-9">UF</TableHead>
                    <TableHead className="text-[11px] font-medium h-9 text-right">Saving</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 7 }).map((_, j) => <TableCell key={j} className="py-2"><Skeleton className="h-4 w-full" /></TableCell>)}
                      </TableRow>
                    ))
                  ) : filteredLaudos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground text-sm">Nenhum laudo encontrado</TableCell>
                    </TableRow>
                  ) : (
                    filteredLaudos.slice(0, 30).map((l) => (
                      <TableRow key={l.id} className="text-[11px]">
                        <TableCell className="py-2"><Badge variant="outline" className="text-[9px] font-normal">{l.seguradora || "-"}</Badge></TableCell>
                        <TableCell className="py-2 font-mono">{l.sinistro || "-"}</TableCell>
                        <TableCell className="py-2 font-mono">{l.placa || "-"}</TableCell>
                        <TableCell className="py-2 max-w-[120px] truncate">{l.oficina || "-"}</TableCell>
                        <TableCell className="py-2">{l.agenteCausa || "-"}</TableCell>
                        <TableCell className="py-2">{l.uf || "-"}</TableCell>
                        <TableCell className="py-2 text-right font-medium text-emerald-600">{formatCurrency((l.savingPecas || 0) + (l.savingMO || 0))}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
