"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HeaderSection } from "@/components/report/header-section"
import { PecasSection } from "@/components/report/pecas-section"
import { MaoDeObraSection } from "@/components/report/mao-de-obra-section"
import { SummarySection } from "@/components/report/summary-section"
import { emptyReportData, type ReportData } from "@/lib/report-data"
import { generatePDF } from "@/lib/pdf-generator"
import { FileDown, FileText, RotateCcw } from "lucide-react"

export default function ReportPage() {
  const [reportData, setReportData] = useState<ReportData>(emptyReportData)

  const handleReset = () => {
    if (confirm("Deseja limpar todos os dados do relatório?")) {
      setReportData(emptyReportData)
    }
  }

  const handleGeneratePDF = () => {
    generatePDF(reportData)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">ExpertiseCheck</h1>
              <p className="text-xs text-muted-foreground">Laudo de Reinspeção</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Limpar
            </Button>
            <Button size="sm" onClick={handleGeneratePDF}>
              <FileDown className="mr-2 h-4 w-4" />
              Gerar PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <div className="space-y-8">
          {/* Informações Gerais */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">Informações Gerais</h2>
            <HeaderSection
              data={reportData.header}
              onChange={(header) => setReportData({ ...reportData, header })}
            />
          </section>

          {/* Glosas de Peças */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">Itens Glosados</h2>
            <PecasSection
              data={reportData.pecasGlosadas}
              onChange={(pecasGlosadas) => setReportData({ ...reportData, pecasGlosadas })}
            />
          </section>

          {/* Mão de Obra */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">Mão de Obra</h2>
            <MaoDeObraSection
              data={reportData.maoDeObra}
              servicosTerceiros={reportData.servicosTerceiros}
              onChange={(maoDeObra) => setReportData({ ...reportData, maoDeObra })}
              onServicosTerceirosChange={(servicosTerceiros) =>
                setReportData({ ...reportData, servicosTerceiros })
              }
            />
          </section>

          {/* Resumo */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">Resumo</h2>
            <SummarySection data={reportData} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>ExpertiseCheck - Sistema de Auditoria de Sinistros</p>
        </div>
      </footer>
    </div>
  )
}
