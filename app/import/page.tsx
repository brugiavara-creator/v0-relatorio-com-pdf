"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Upload, FileJson, Loader2, CheckCircle2, AlertCircle, ArrowLeft, BarChart3, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"

const SEGURADORAS = [
  { value: "ALLIANZ", label: "ALLIANZ SEGUROS" },
  { value: "MAPFRE", label: "MAPFRE SEGUROS" },
  { value: "PIER", label: "PIER SEGUROS" },
]

export default function ImportPage() {
  const [seguradora, setSeguradora] = useState("")
  const [jsonData, setJsonData] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [seguradoraToDelete, setSeguradoraToDelete] = useState("")
  const [result, setResult] = useState<{
    success: boolean
    message: string
    inserted?: number
    totalRecords?: number
    errors?: string[]
  } | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setJsonData(content)
      toast.success(`Arquivo "${file.name}" carregado com sucesso!`)
    }
    reader.onerror = () => {
      toast.error("Erro ao ler o arquivo")
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (!seguradora) {
      toast.error("Selecione a seguradora")
      return
    }

    if (!jsonData.trim()) {
      toast.error("Cole ou carregue os dados JSON")
      return
    }

    let parsedData: any[]
    try {
      parsedData = JSON.parse(jsonData)
      if (!Array.isArray(parsedData)) {
        throw new Error("Os dados devem ser um array JSON")
      }
    } catch (error) {
      toast.error("JSON inválido. Verifique o formato dos dados.")
      return
    }

    setIsImporting(true)
    setResult(null)

    try {
      const response = await fetch("/api/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seguradora,
          data: parsedData,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          inserted: data.inserted,
          totalRecords: data.totalRecords,
          errors: data.errors,
        })
        toast.success(data.message)
      } else {
        setResult({
          success: false,
          message: data.error || "Erro na importação",
        })
        toast.error(data.error || "Erro na importação")
      }
    } catch (error) {
      console.error("Erro:", error)
      setResult({
        success: false,
        message: "Erro de conexão com o servidor",
      })
      toast.error("Erro de conexão com o servidor")
    } finally {
      setIsImporting(false)
    }
  }

  const handleClear = () => {
    setJsonData("")
    setResult(null)
  }

  const handleDeleteBySeguradora = async (seg: string) => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/laudos/delete?seguradora=${seg}`, {
        method: "DELETE",
      })
      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        setResult({
          success: true,
          message: data.message,
        })
      } else {
        toast.error(data.error)
        setResult({
          success: false,
          message: data.error,
        })
      }
    } catch (error) {
      toast.error("Erro ao deletar dados")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteAll = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch("/api/laudos/delete?all=true", {
        method: "DELETE",
      })
      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        setResult({
          success: true,
          message: data.message,
        })
      } else {
        toast.error(data.error)
        setResult({
          success: false,
          message: data.error,
        })
      }
    } catch (error) {
      toast.error("Erro ao deletar dados")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ControlExpert_a_solvd_group_company_left%20%283%29-wC5qwyBGMnRbrukfXswRCWNGb6TI62.png"
              alt="ControlExpert"
              className="h-10 w-auto"
            />
            <div className="h-8 w-px bg-border" />
            <h1 className="text-xl font-bold text-primary">Importar Dados JSON</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Instruções */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="h-5 w-5 text-primary" />
                Importar Relatórios JSON
              </CardTitle>
              <CardDescription>
                Importe dados de relatórios analíticos das seguradoras para o banco de dados.
                Os dados serão automaticamente mapeados e disponibilizados no Dashboard.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Formulário */}
          <Card>
            <CardContent className="pt-6 space-y-6">
              {/* Seleção de Seguradora */}
              <div className="space-y-2">
                <Label htmlFor="seguradora">Seguradora</Label>
                <Select value={seguradora} onValueChange={setSeguradora}>
                  <SelectTrigger id="seguradora">
                    <SelectValue placeholder="Selecione a seguradora" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEGURADORAS.map((seg) => (
                      <SelectItem key={seg.value} value={seg.value}>
                        {seg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Upload de arquivo */}
              <div className="space-y-2">
                <Label>Carregar Arquivo JSON</Label>
                <div className="flex items-center gap-4">
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-primary/50 bg-primary/5 px-4 py-3 transition-colors hover:bg-primary/10">
                    <Upload className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-primary">Selecionar arquivo .json</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Área de texto para JSON */}
              <div className="space-y-2">
                <Label htmlFor="jsonData">Dados JSON</Label>
                <Textarea
                  id="jsonData"
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                  placeholder='Cole aqui o conteúdo JSON ou carregue um arquivo acima...

Exemplo:
[
  {"Data": 46020, "Sinistro": "123456", "Placa": "ABC-1234", ...},
  ...
]'
                  className="min-h-[200px] font-mono text-xs"
                />
                {jsonData && (
                  <p className="text-xs text-muted-foreground">
                    {(() => {
                      try {
                        const parsed = JSON.parse(jsonData)
                        return Array.isArray(parsed)
                          ? `${parsed.length} registros detectados`
                          : "Formato inválido - deve ser um array"
                      } catch {
                        return "JSON inválido"
                      }
                    })()}
                  </p>
                )}
              </div>

              {/* Botões */}
              <div className="flex gap-3">
                <Button
                  onClick={handleImport}
                  disabled={isImporting || !seguradora || !jsonData}
                  className="flex-1"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Importar Dados
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleClear} disabled={isImporting}>
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resultado */}
          {result && (
            <Card className={result.success ? "border-green-500" : "border-red-500"}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-red-500 shrink-0" />
                  )}
                  <div className="space-y-2">
                    <p className={`font-medium ${result.success ? "text-green-700" : "text-red-700"}`}>
                      {result.message}
                    </p>
                    {result.success && result.inserted !== undefined && (
                      <p className="text-sm text-muted-foreground">
                        {result.inserted} de {result.totalRecords} registros importados com sucesso.
                      </p>
                    )}
                    {result.errors && result.errors.length > 0 && (
                      <div className="mt-2 rounded-lg bg-red-50 p-3">
                        <p className="text-sm font-medium text-red-700">Erros encontrados:</p>
                        <ul className="mt-1 list-inside list-disc text-xs text-red-600">
                          {result.errors.map((err, idx) => (
                            <li key={idx}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Excluir Dados */}
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Excluir Dados Importados
              </CardTitle>
              <CardDescription>
                Remova os dados importados do banco de dados. Esta acao nao pode ser desfeita.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Excluir por Seguradora */}
              <div className="space-y-2">
                <Label>Excluir por Seguradora</Label>
                <div className="flex gap-2">
                  <Select value={seguradoraToDelete} onValueChange={setSeguradoraToDelete}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecione a seguradora" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEGURADORAS.map((seg) => (
                        <SelectItem key={seg.value} value={seg.value}>
                          {seg.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        disabled={!seguradoraToDelete || isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusao</AlertDialogTitle>
                        <AlertDialogDescription>
                          Voce tem certeza que deseja excluir todos os dados da seguradora{" "}
                          <strong>{seguradoraToDelete}</strong>? Esta acao nao pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteBySeguradora(seguradoraToDelete)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Sim, excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Excluir Todos */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-600">Excluir TODOS os dados</p>
                    <p className="text-sm text-muted-foreground">
                      Remove todos os laudos de todas as seguradoras
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={isDeleting}>
                        {isDeleting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Excluir Tudo
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusao total</AlertDialogTitle>
                        <AlertDialogDescription>
                          <strong className="text-red-600">ATENCAO!</strong> Voce tem certeza que deseja excluir{" "}
                          <strong>TODOS</strong> os dados de laudos do banco de dados? Esta acao e irreversivel
                          e removera todos os registros de todas as seguradoras.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAll}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Sim, excluir TUDO
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mapeamento de campos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mapeamento de Campos por Seguradora</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold text-primary mb-2">ALLIANZ</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>Sinistro → sinistro</li>
                    <li>Placa → placa</li>
                    <li>Terceiro/Segurado → tipo_cliente</li>
                    <li>Oficina → oficina</li>
                    <li>Referenciada/Cadastrada/DRP → credenciamento</li>
                    <li>UF → estado</li>
                    <li>Regulador → regulador</li>
                    <li>Perito → perito</li>
                    <li>Valor Orçamento → valor_inicial</li>
                  </ul>
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold text-primary mb-2">MAPFRE</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>Nº. Sinistro → sinistro</li>
                    <li>Placa → placa</li>
                    <li>Modelo → modelo</li>
                    <li>UF → estado</li>
                    <li>Reguladora - Regulador → regulador</li>
                    <li>Analista → perito</li>
                    <li>Valot total → valor_inicial</li>
                    <li>Observações → observacao</li>
                  </ul>
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold text-primary mb-2">PIER</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>Nº. Sinistro → sinistro</li>
                    <li>Placa → placa</li>
                    <li>Modelo → modelo</li>
                    <li>Tipo de cliente → tipo_cliente</li>
                    <li>Oficina → oficina</li>
                    <li>Tipo de cadastro → credenciamento</li>
                    <li>UF → estado</li>
                    <li>Reguladora - Regulador → regulador</li>
                    <li>Analista → perito</li>
                    <li>Valor total → valor_inicial</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
