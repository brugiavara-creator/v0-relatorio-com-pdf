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

  // Cores da marca ControlExpert
  const brandBlue = "#0066a1"
  const brandGreen = "#5a9a7a"
  const lightBlue = "#e8f4fc"
  const lightGreen = "#e8f5ef"

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
          background: #fff;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 3px solid ${brandBlue};
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .header img {
          height: 45px;
          width: auto;
        }
        .header-title {
          border-left: 2px solid ${brandGreen};
          padding-left: 15px;
        }
        .header h1 {
          font-size: 18px;
          color: ${brandBlue};
          margin-bottom: 3px;
          font-weight: 600;
        }
        .header p {
          color: #666;
          font-size: 11px;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 12px;
          font-weight: 600;
          color: #fff;
          background: ${brandBlue};
          padding: 8px 12px;
          margin-bottom: 12px;
          border-radius: 4px;
        }
        .section-title.green {
          background: ${brandGreen};
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .info-box {
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 12px;
          background: #fafafa;
        }
        .info-box.highlight {
          background: ${lightBlue};
          border-color: ${brandBlue}40;
        }
        .info-box.warning {
          background: #fff8f0;
          border-color: #f59e0b40;
        }
        .info-box h4 {
          font-size: 10px;
          color: ${brandBlue};
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
          border-bottom: 1px solid ${brandBlue}30;
          padding-bottom: 5px;
        }
        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          border-bottom: 1px dotted #e0e0e0;
        }
        .info-item:last-child {
          border-bottom: none;
        }
        .info-label {
          color: #666;
          font-size: 10px;
        }
        .info-value {
          font-weight: 500;
          font-size: 11px;
          color: #333;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        th, td {
          border: 1px solid #e0e0e0;
          padding: 8px;
          text-align: left;
        }
        th {
          background: ${lightBlue};
          font-weight: 600;
          font-size: 9px;
          text-transform: uppercase;
          color: ${brandBlue};
        }
        td {
          font-size: 10px;
        }
        .text-right {
          text-align: right;
        }
        .text-center {
          text-align: center;
        }
        .footer-row {
          background: ${lightBlue};
          font-weight: 600;
        }
        .footer-row td {
          color: ${brandBlue};
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
          border: 2px solid #fecaca;
        }
        .summary-box.valorizacao {
          background: ${lightGreen};
          border: 2px solid ${brandGreen}60;
        }
        .summary-box.saldo {
          background: ${saldoFinal >= 0 ? lightGreen : "#fef2f2"};
          border: 2px solid ${saldoFinal >= 0 ? brandGreen : "#fecaca"};
        }
        .summary-label {
          font-size: 9px;
          color: #666;
          text-transform: uppercase;
          margin-bottom: 5px;
          letter-spacing: 0.5px;
        }
        .summary-value {
          font-size: 18px;
          font-weight: 700;
        }
        .summary-value.red { color: #dc2626; }
        .summary-value.green { color: ${brandGreen}; }
        .mo-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        .mo-section h4 {
          margin-bottom: 10px;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 10px;
          border-radius: 4px;
        }
        .mo-section.deducao h4 {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }
        .mo-section.valorizacao h4 {
          background: ${lightGreen};
          color: ${brandGreen};
          border: 1px solid ${brandGreen}60;
        }
        .observacao-box {
          background: ${lightBlue};
          border: 1px solid ${brandBlue}30;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 20px;
        }
        .observacao-box h4 {
          font-size: 10px;
          color: ${brandBlue};
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }
        .observacao-box p {
          font-size: 11px;
          color: #333;
          white-space: pre-wrap;
          line-height: 1.5;
        }
        .page-footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 2px solid ${brandBlue};
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .page-footer p {
          color: #888;
          font-size: 9px;
        }
        .page-footer img {
          height: 25px;
          opacity: 0.7;
        }
        @media print {
          body { padding: 15px; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-left">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ControlExpert_a_solvd_group_company_left%20%283%29-wC5qwyBGMnRbrukfXswRCWNGb6TI62.png" alt="ControlExpert" />
          <div class="header-title">
            <h1>LAUDO DE REINSPEÇÃO</h1>
            <p>Relatório de Auditoria de Sinistros</p>
          </div>
        </div>
        <div style="text-align: right; font-size: 10px; color: #666;">
          <p><strong>Data:</strong> ${new Date().toLocaleDateString("pt-BR")}</p>
          <p><strong>Sinistro:</strong> ${data.header.sinistro || "-"}</p>
        </div>
      </div>

      <div class="section">
        <div class="info-grid">
          <div class="info-box highlight">
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
          <div class="info-box warning">
            <h4 style="color: #c2410c; border-color: #f59e0b30;">Agente da Causa / Motivo</h4>
            <div class="info-item">
              <span class="info-label">Agente:</span>
              <span class="info-value">${data.header.agenteCausa || "-"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Motivo:</span>
              <span class="info-value">${data.header.motivo || "-"}</span>
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
              <th class="text-center" style="width: 50px;">Qtde</th>
              <th style="width: 100px;">Código</th>
              <th>Descrição</th>
              <th class="text-right" style="width: 90px;">Valor Bruto</th>
              <th class="text-right" style="width: 70px;">Desconto</th>
              <th class="text-right" style="width: 90px;">Valor Líquido</th>
              <th class="text-right" style="width: 90px;">Negociado</th>
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
              <td colspan="5" class="text-right"><strong>Total:</strong></td>
              <td class="text-right"><strong>${formatCurrency(totalPecasLiquido)}</strong></td>
              <td class="text-right"><strong>${formatCurrency(totalPecasNegociado)}</strong></td>
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
          <div class="mo-section deducao">
            <h4>Dedução</h4>
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
                  <td colspan="2" class="text-right"><strong>Total:</strong></td>
                  <td class="text-right"><strong>${totalHorasDeducao}h</strong></td>
                  <td class="text-right"><strong>${formatCurrency(totalMODeducao)}</strong></td>
                </tr>
              </tbody>
            </table>
            <p style="margin-top: 8px; font-size: 10px; color: #666;">
              <strong>Serviços de Terceiros:</strong> ${formatCurrency(data.servicosTerceiros.deducaoTotal)}
            </p>
          </div>
          <div class="mo-section valorizacao">
            <h4>Valorização</h4>
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
                  <td colspan="2" class="text-right"><strong>Total:</strong></td>
                  <td class="text-right"><strong>${totalHorasValorizacao}h</strong></td>
                  <td class="text-right"><strong>${formatCurrency(totalMOValorizacao)}</strong></td>
                </tr>
              </tbody>
            </table>
            <p style="margin-top: 8px; font-size: 10px; color: #666;">
              <strong>Serviços de Terceiros:</strong> ${formatCurrency(data.servicosTerceiros.valorizacaoTotal)}
            </p>
          </div>
        </div>
      </div>

      ${
        data.observacao
          ? `
      <div class="section">
        <div class="observacao-box">
          <h4>Observações</h4>
          <p>${data.observacao}</p>
        </div>
      </div>
      `
          : ""
      }

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

      <div class="page-footer">
        <div>
          <p>Documento gerado em ${new Date().toLocaleString("pt-BR")}</p>
          <p>ControlExpert - Sistema de Auditoria de Sinistros</p>
        </div>
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ControlExpert_a_solvd_group_company_left%20%283%29-wC5qwyBGMnRbrukfXswRCWNGb6TI62.png" alt="ControlExpert" />
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
