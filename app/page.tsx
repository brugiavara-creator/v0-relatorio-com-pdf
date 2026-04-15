"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HeaderSection } from "@/components/report/header-section"
import { PecasSection } from "@/components/report/pecas-section"
import { MaoDeObraSection } from "@/components/report/mao-de-obra-section"
import { ObservacaoSection } from "@/components/report/observacao-section"
import { SummarySection } from "@/components/report/summary-section"
import { emptyReportData, type ReportData } from "@/lib/report-data"
import { generatePDF } from "@/lib/pdf-generator"
import { FileDown, RotateCcw } from "lucide-react"

export default function ReportPage() {
  const [reportData, setReportData] = useState<ReportData>(emptyReportData)

  const handleReset = () => {
    if (confirm("Deseja limpar todos os dados do relatório?")) {
      setReportData(emptyReportData)
    }
  }

  const [isGenerating, setIsGenerating] = useState(false)

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    try {
      await generatePDF(reportData)
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
      alert("Erro ao gerar PDF. Tente novamente.")
    } finally {
      setIsGenerating(false)
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
              className="h-8 w-auto"
            />
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-lg font-semibold text-primary">Laudo de Reinspeção</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Limpar
            </Button>
            <Button 
              size="sm" 
              onClick={handleGeneratePDF} 
              className="bg-primary hover:bg-primary/90"
              disabled={isGenerating}
            >
              <FileDown className="mr-2 h-4 w-4" />
              {isGenerating ? "Gerando..." : "Gerar PDF"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <div className="space-y-8">
          {/* Informações Gerais */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Informações Gerais</h2>
            <HeaderSection
              data={reportData.header}
              onChange={(header) => setReportData({ ...reportData, header })}
            />
          </section>

          {/* Glosas de Peças */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Itens Glosados</h2>
            <PecasSection
              data={reportData.pecasGlosadas}
              onChange={(pecasGlosadas) => setReportData({ ...reportData, pecasGlosadas })}
            />
          </section>

          {/* Mão de Obra */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Mão de Obra</h2>
            <MaoDeObraSection
              data={reportData.maoDeObra}
              servicosTerceiros={reportData.servicosTerceiros}
              onChange={(maoDeObra) => setReportData({ ...reportData, maoDeObra })}
              onServicosTerceirosChange={(servicosTerceiros) =>
                setReportData({ ...reportData, servicosTerceiros })
              }
            />
          </section>

          {/* Observações */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Observações</h2>
            <ObservacaoSection
              value={reportData.observacao}
              onChange={(observacao) => setReportData({ ...reportData, observacao })}
            />
          </section>

          {/* Resumo */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Resumo</h2>
            <SummarySection data={reportData} />
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
