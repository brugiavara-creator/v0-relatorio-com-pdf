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
import { FileDown, RotateCcw, Save, Loader2, BarChart3 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

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
        // Gerar PDF após salvar
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-6">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ControlExpert_a_solvd_group_company_left%20%283%29-wC5qwyBGMnRbrukfXswRCWNGb6TI62.png" 
              alt="ControlExpert"
              className="h-12 w-auto"
            />
            <div className="h-10 w-px bg-border" />
            <div>
              <h1 className="text-2xl font-bold text-primary">LAUDO DE REINSPEÇÃO</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Limpar
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleGeneratePDF} 
            >
              <FileDown className="mr-2 h-4 w-4" />
              Gerar PDF
            </Button>
            <Button 
              size="sm" 
              onClick={handleSaveToDatabase} 
              className="bg-primary hover:bg-primary/90"
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isSaving ? "Salvando..." : "Salvar e Gerar PDF"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <div className="space-y-8">
          {/* Informações Gerais */}
          <section>
            <HeaderSection
              data={reportData.header}
              onChange={(header) => setReportData({ ...reportData, header })}
            />
          </section>

          {/* Glosas de Peças */}
          <section>
            <div className="mb-4 rounded-lg bg-primary px-4 py-3">
              <h2 className="text-xl font-bold text-primary-foreground uppercase tracking-wide">GLOSAS DE PEÇAS</h2>
            </div>
            <PecasSection
              data={reportData.pecasGlosadas}
              onChange={(pecasGlosadas) => setReportData({ ...reportData, pecasGlosadas })}
            />
          </section>

          {/* Mão de Obra */}
          <section>
            <div className="mb-4 rounded-lg bg-primary px-4 py-3">
              <h2 className="text-xl font-bold text-primary-foreground uppercase tracking-wide">GLOSAS DE MÃO DE OBRA</h2>
            </div>
            <MaoDeObraSection
              data={reportData.maoDeObra}
              servicosTerceiros={reportData.servicosTerceiros}
              onChange={(maoDeObra) => setReportData({ ...reportData, maoDeObra })}
              onServicosTerceirosChange={(servicosTerceiros) =>
                setReportData({ ...reportData, servicosTerceiros })
              }
            />
          </section>

          {/* Fotos */}
          <section>
            <div className="mb-4 rounded-lg bg-primary px-4 py-3">
              <h2 className="text-xl font-bold text-primary-foreground uppercase tracking-wide">FOTOS</h2>
            </div>
            <FotosSection
              data={reportData.fotos}
              onChange={(fotos) => setReportData({ ...reportData, fotos })}
            />
          </section>

          {/* Observações */}
          <section>
            <div className="mb-4 rounded-lg bg-muted px-4 py-3">
              <h2 className="text-xl font-bold text-foreground uppercase tracking-wide">OBSERVAÇÕES</h2>
            </div>
            <ObservacaoSection
              value={reportData.observacao}
              onChange={(observacao) => setReportData({ ...reportData, observacao })}
            />
          </section>

          {/* Resumo */}
          <section>
            <div className="mb-4 rounded-lg bg-primary px-4 py-3">
              <h2 className="text-xl font-bold text-primary-foreground uppercase tracking-wide">RESUMO</h2>
            </div>
            <SummarySection 
              data={reportData} 
              onOrcamentoChange={(valorInicialOrcamento) => setReportData({ ...reportData, valorInicialOrcamento })}
              onFranquiaChange={(franquia) => setReportData({ ...reportData, franquia })}
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          <p>ControlExpert - Sistema de Auditoria de Sinistros</p>
        </div>
      </footer>
    </div>
  )
}
