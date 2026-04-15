import type { ReportData } from "./report-data"

export function generatePDF(data: ReportData) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (date: string) => {
    if (!date) return "-"
    return new Date(date).toLocaleDateString("pt-BR")
  }

  // Calcular totais
  const totalPecasLiquido = data.pecasGlosadas.reduce((acc, peca) => acc + peca.valorLiquidoTotal, 0)
  const totalPecasNegociado = data.pecasGlosadas.reduce(
    (acc, peca) => acc + peca.valorLiquidoNegociado,
    0
  )
  const totalMODeducao = data.maoDeObra.deducao.reduce((acc, item) => acc + item.valor, 0)
  const totalMOValorizacao = data.maoDeObra.valorizacao.reduce((acc, item) => acc + item.valor, 0)
  const totalHorasDeducao = data.maoDeObra.deducao.reduce((acc, item) => acc + item.horas, 0)
  const totalHorasValorizacao = data.maoDeObra.valorizacao.reduce((acc, item) => acc + item.horas, 0)
  const totalDeducoes = totalPecasLiquido + totalMODeducao + data.servicosTerceiros.deducaoTotal
  const totalValorizacoes = totalMOValorizacao + data.servicosTerceiros.valorizacaoTotal
  const saldoFinal = totalValorizacoes - totalDeducoes

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Laudo de Reinspeção - ${data.header.sinistro || "Sem número"}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 11px;
          line-height: 1.4;
          color: #1a1a1a;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #2563eb;
        }
        .header h1 {
          font-size: 20px;
          color: #2563eb;
          margin-bottom: 5px;
        }
        .header p {
          color: #666;
          font-size: 12px;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          background: #2563eb;
          padding: 8px 12px;
          margin-bottom: 10px;
          border-radius: 4px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        .info-box {
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 12px;
        }
        .info-box h4 {
          font-size: 11px;
          color: #6b7280;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          border-bottom: 1px dotted #e5e7eb;
        }
        .info-item:last-child {
          border-bottom: none;
        }
        .info-label {
          color: #6b7280;
        }
        .info-value {
          font-weight: 500;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        th, td {
          border: 1px solid #e5e7eb;
          padding: 8px;
          text-align: left;
        }
        th {
          background: #f3f4f6;
          font-weight: 600;
          font-size: 10px;
          text-transform: uppercase;
        }
        td {
          font-size: 11px;
        }
        .text-right {
          text-align: right;
        }
        .text-center {
          text-align: center;
        }
        .footer-row {
          background: #f9fafb;
          font-weight: 600;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 20px;
        }
        .summary-box {
          border-radius: 8px;
          padding: 15px;
          text-align: center;
        }
        .summary-box.deducao {
          background: #fef2f2;
          border: 1px solid #fecaca;
        }
        .summary-box.valorizacao {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
        }
        .summary-box.saldo {
          background: ${saldoFinal >= 0 ? "#f0fdf4" : "#fef2f2"};
          border: 1px solid ${saldoFinal >= 0 ? "#bbf7d0" : "#fecaca"};
        }
        .summary-label {
          font-size: 10px;
          color: #6b7280;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .summary-value {
          font-size: 18px;
          font-weight: 700;
        }
        .summary-value.red { color: #dc2626; }
        .summary-value.green { color: #16a34a; }
        .mo-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        .agente-motivo {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 15px;
        }
        .agente-motivo h4 {
          color: #c2410c;
          margin-bottom: 8px;
        }
        @media print {
          body { padding: 10px; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>LAUDO DE REINSPEÇÃO</h1>
        <p>ExpertiseCheck - Relatório de Auditoria</p>
      </div>

      <div class="section">
        <div class="info-grid">
          <div class="info-box">
            <h4>Informações do Sinistro</h4>
            <div class="info-item">
              <span class="info-label">Sinistro:</span>
              <span class="info-value">${data.header.sinistro || "-"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Regulador:</span>
              <span class="info-value">${data.header.regulador || "-"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Perito:</span>
              <span class="info-value">${data.header.perito || "-"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Cidade/Estado:</span>
              <span class="info-value">${data.header.cidade || "-"}/${data.header.estado || "-"}</span>
            </div>
          </div>
          <div class="info-box">
            <h4>Informações do Veículo</h4>
            <div class="info-item">
              <span class="info-label">Marca:</span>
              <span class="info-value">${data.header.marca || "-"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Modelo:</span>
              <span class="info-value">${data.header.modelo || "-"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Placa:</span>
              <span class="info-value">${data.header.placa || "-"}</span>
            </div>
          </div>
          <div class="info-box">
            <h4>Informações da Oficina</h4>
            <div class="info-item">
              <span class="info-label">Oficina:</span>
              <span class="info-value">${data.header.oficina || "-"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Data:</span>
              <span class="info-value">${formatDate(data.header.data)}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Hora Chegada:</span>
              <span class="info-value">${data.header.horaChegada || "-"}</span>
            </div>
          </div>
          <div class="info-box" style="background: #fff7ed; border-color: #fed7aa;">
            <h4 style="color: #c2410c;">Agente da Causa</h4>
            <div class="info-item">
              <span class="info-label">Agente:</span>
              <span class="info-value">${data.header.agenteCausa || "-"}</span>
            </div>
            <div style="margin-top: 8px;">
              <span class="info-label">Motivo:</span>
              <p style="margin-top: 4px; font-size: 10px;">${data.header.motivo || "-"}</p>
            </div>
          </div>
        </div>
      </div>

      ${
        data.pecasGlosadas.length > 0
          ? `
      <div class="section">
        <div class="section-title">Glosas de Peças</div>
        <table>
          <thead>
            <tr>
              <th class="text-center">Qtde</th>
              <th>Código</th>
              <th>Descrição</th>
              <th class="text-right">Valor Bruto</th>
              <th class="text-right">Desconto</th>
              <th class="text-right">Valor Líquido</th>
              <th class="text-right">Negociado</th>
            </tr>
          </thead>
          <tbody>
            ${data.pecasGlosadas
              .map(
                (peca) => `
              <tr>
                <td class="text-center">${peca.quantidade}</td>
                <td>${peca.codigoPeca || "-"}</td>
                <td>${peca.descricao || "-"}</td>
                <td class="text-right">${formatCurrency(peca.valorBrutoUnitario * peca.quantidade)}</td>
                <td class="text-right">${peca.desconto}%</td>
                <td class="text-right">${formatCurrency(peca.valorLiquidoTotal)}</td>
                <td class="text-right">${formatCurrency(peca.valorLiquidoNegociado)}</td>
              </tr>
            `
              )
              .join("")}
            <tr class="footer-row">
              <td colspan="5" class="text-right">Total:</td>
              <td class="text-right">${formatCurrency(totalPecasLiquido)}</td>
              <td class="text-right">${formatCurrency(totalPecasNegociado)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      `
          : ""
      }

      <div class="section">
        <div class="section-title">Glosas de Mão de Obra</div>
        <div class="mo-grid">
          <div>
            <h4 style="margin-bottom: 8px; color: #dc2626;">Dedução</h4>
            <table>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th class="text-right">R$/h</th>
                  <th class="text-right">Horas</th>
                  <th class="text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                ${data.maoDeObra.deducao
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.label}</td>
                    <td class="text-right">${formatCurrency(item.valorHora)}</td>
                    <td class="text-right">${item.horas}h</td>
                    <td class="text-right">${formatCurrency(item.valor)}</td>
                  </tr>
                `
                  )
                  .join("")}
                <tr class="footer-row">
                  <td colspan="2" class="text-right">Total:</td>
                  <td class="text-right">${totalHorasDeducao}h</td>
                  <td class="text-right">${formatCurrency(totalMODeducao)}</td>
                </tr>
              </tbody>
            </table>
            <p style="margin-top: 8px; font-size: 10px;">
              <strong>Serviços de Terceiros:</strong> ${formatCurrency(data.servicosTerceiros.deducaoTotal)}
            </p>
          </div>
          <div>
            <h4 style="margin-bottom: 8px; color: #16a34a;">Valorização</h4>
            <table>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th class="text-right">R$/h</th>
                  <th class="text-right">Horas</th>
                  <th class="text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                ${data.maoDeObra.valorizacao
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.label}</td>
                    <td class="text-right">${formatCurrency(item.valorHora)}</td>
                    <td class="text-right">${item.horas}h</td>
                    <td class="text-right">${formatCurrency(item.valor)}</td>
                  </tr>
                `
                  )
                  .join("")}
                <tr class="footer-row">
                  <td colspan="2" class="text-right">Total:</td>
                  <td class="text-right">${totalHorasValorizacao}h</td>
                  <td class="text-right">${formatCurrency(totalMOValorizacao)}</td>
                </tr>
              </tbody>
            </table>
            <p style="margin-top: 8px; font-size: 10px;">
              <strong>Serviços de Terceiros:</strong> ${formatCurrency(data.servicosTerceiros.valorizacaoTotal)}
            </p>
          </div>
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-box deducao">
          <div class="summary-label">Total Deduções</div>
          <div class="summary-value red">${formatCurrency(totalDeducoes)}</div>
        </div>
        <div class="summary-box valorizacao">
          <div class="summary-label">Total Valorizações</div>
          <div class="summary-value green">${formatCurrency(totalValorizacoes)}</div>
        </div>
        <div class="summary-box saldo">
          <div class="summary-label">Saldo Final</div>
          <div class="summary-value ${saldoFinal >= 0 ? "green" : "red"}">${formatCurrency(saldoFinal)}</div>
        </div>
      </div>

      <div style="margin-top: 40px; text-align: center; color: #9ca3af; font-size: 10px;">
        <p>Documento gerado em ${new Date().toLocaleString("pt-BR")}</p>
        <p>ExpertiseCheck - Sistema de Auditoria de Sinistros</p>
      </div>
    </body>
    </html>
  `

  // Abrir nova janela e imprimir
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
    }
  }
}
