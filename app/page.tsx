"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HeaderSection } from "@/components/report/header-section"
import { PecasSection } from "@/components/report/pecas-section"
import { MaoDeObraSection } from "@/components/report/mao-de-obra-section"
import { FotosSection } from "@/components/report/fotos-section"
import { ObservacaoSection } from "@/components/report/observacao-section"
import { SummarySection } from "@/components/report/summary-section"
import { emptyReportData, type ReportData } from "@/lib/report-data"
import { generatePDF } from "@/lib/pdf-generator"
import { FileDown, RotateCcw, Save, Loader2, BarChart3, Upload, FileText } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportPage() {
  const [reportData, setReportData] = useState<ReportData>(emptyReportData)
  const [isSaving, setIsSaving] = useState(false)

  const handleReset = () => {
    if (confirm("Deseja limpar todos os dados do relatório?")) {
      setReportData(emptyReportData)
    }
  }

  const handleGeneratePDF = () => {
    generatePDF(reportData)
  }

  const handleSaveToDatabase = async () => {
    if (!reportData.header.sinistro) {
      toast.error("Por favor, preencha o número do sinistro antes de salvar.")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/laudos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success("Laudo salvo com sucesso no banco de dados!")
        generatePDF(reportData)
      } else {
        toast.error(result.error || "Erro ao salvar o laudo")
      }
    } catch (error) {
      console.error("Erro ao salvar:", error)
      toast.error("Erro ao conectar com o servidor")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-xl dark:bg-slate-950/80">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ControlExpert_a_solvd_group_company_left%20%283%29-wC5qwyBGMnRbrukfXswRCWNGb6TI62.png" 
                alt="ControlExpert"
                className="h-8 w-auto"
              />
              <div className="hidden sm:block h-6 w-px bg-border" />
              <div className="hidden sm:flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-semibold text-primary">Laudo de Monitoria</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/import">
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <Upload className="mr-2 h-4 w-4" />
                  Importar
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Limpar</span>
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleGeneratePDF} 
              >
                <FileDown className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">PDF</span>
              </Button>
              <Button 
                size="sm" 
                onClick={handleSaveToDatabase} 
                className="bg-primary hover:bg-primary/90"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span className="hidden sm:inline ml-2">{isSaving ? "Salvando..." : "Salvar"}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Title Section */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
            LAUDO DE MONITORIA
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Preencha os dados do laudo abaixo
          </p>
        </div>

        <div className="space-y-6">
          {/* Informacoes Gerais */}
          <Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur">
            <CardContent className="p-4 md:p-6">
              <HeaderSection
                data={reportData.header}
                onChange={(header) => setReportData({ ...reportData, header })}
              />
            </CardContent>
          </Card>

          {/* Glosas - Tabs */}
          <Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur overflow-hidden">
            <Tabs defaultValue="pecas" className="w-full">
              <div className="bg-primary px-4 py-3">
                <TabsList className="bg-primary/20 border-0">
                  <TabsTrigger 
                    value="pecas" 
                    className="data-[state=active]:bg-white data-[state=active]:text-primary text-white/80"
                  >
                    Glosas de Pecas
                  </TabsTrigger>
                  <TabsTrigger 
                    value="maoDeObra"
                    className="data-[state=active]:bg-white data-[state=active]:text-primary text-white/80"
                  >
                    Glosas de Mao de Obra
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="pecas" className="p-4 md:p-6 mt-0">
                <PecasSection
                  data={reportData.pecasGlosadas}
                  onChange={(pecasGlosadas) => setReportData({ ...reportData, pecasGlosadas })}
                />
              </TabsContent>
              <TabsContent value="maoDeObra" className="p-4 md:p-6 mt-0">
                <MaoDeObraSection
                  data={reportData.maoDeObra}
                  servicosTerceiros={reportData.servicosTerceiros}
                  onChange={(maoDeObra) => setReportData({ ...reportData, maoDeObra })}
                  onServicosTerceirosChange={(servicosTerceiros) =>
                    setReportData({ ...reportData, servicosTerceiros })
                  }
                />
              </TabsContent>
            </Tabs>
          </Card>

          {/* Fotos */}
          <Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur overflow-hidden">
            <div className="bg-primary px-4 py-3">
              <h2 className="text-base font-semibold text-white uppercase tracking-wide">Fotos</h2>
            </div>
            <CardContent className="p-4 md:p-6">
              <FotosSection
                data={reportData.fotos}
                onChange={(fotos) => setReportData({ ...reportData, fotos })}
              />
            </CardContent>
          </Card>

          {/* Observacoes */}
          <Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur overflow-hidden">
            <div className="bg-slate-600 px-4 py-3">
              <h2 className="text-base font-semibold text-white uppercase tracking-wide">Observacoes</h2>
            </div>
            <CardContent className="p-4 md:p-6">
              <ObservacaoSection
                value={reportData.observacao}
                onChange={(observacao) => setReportData({ ...reportData, observacao })}
              />
            </CardContent>
          </Card>

          {/* Resumo */}
          <Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur overflow-hidden">
            <div className="bg-primary px-4 py-3">
              <h2 className="text-base font-semibold text-white uppercase tracking-wide">Resumo</h2>
            </div>
            <CardContent className="p-4 md:p-6">
              <SummarySection 
                data={reportData} 
                onOrcamentoChange={(valorInicialOrcamento) => setReportData({ ...reportData, valorInicialOrcamento })}
                onFranquiaChange={(franquia) => setReportData({ ...reportData, franquia })}
              />
            </CardContent>
          </Card>

          {/* Action Buttons Mobile */}
          <div className="flex gap-2 md:hidden">
            <Button 
              className="flex-1" 
              variant="outline"
              onClick={handleGeneratePDF}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Gerar PDF
            </Button>
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleSaveToDatabase}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 bg-white/50 dark:bg-slate-950/50 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground">
          <p>ControlExpert - Sistema de Monitoria de Sinistros</p>
        </div>
      </footer>
    </div>
  )
}
