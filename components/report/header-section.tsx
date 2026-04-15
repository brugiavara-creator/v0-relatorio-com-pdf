"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ReportHeader } from "@/lib/report-data"
import { AGENTES_CAUSA, MOTIVOS, TIPOS_CLIENTE, TIPOS_OFICINA, CREDENCIAMENTOS } from "@/lib/report-data"
import { FileText, Car, Building2, AlertCircle } from "lucide-react"

interface HeaderSectionProps {
  data: ReportHeader
  onChange: (data: ReportHeader) => void
}

export function HeaderSection({ data, onChange }: HeaderSectionProps) {
  const handleChange = (field: keyof ReportHeader, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Logo e Título */}
      <div className="flex items-center gap-6 pb-4 border-b border-border">
        <img 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ControlExpert_a_solvd_group_company_left%20%283%29-wC5qwyBGMnRbrukfXswRCWNGb6TI62.png" 
          alt="ControlExpert - a solvd group company"
          className="h-12 w-auto"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações do Sinistro */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Informações do Sinistro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="sinistro">Sinistro</FieldLabel>
                <Input
                  id="sinistro"
                  value={data.sinistro}
                  onChange={(e) => handleChange("sinistro", e.target.value)}
                  placeholder="Número do sinistro"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="tipoCliente">Tipo de Cliente</FieldLabel>
                <Select
                  value={data.tipoCliente}
                  onValueChange={(value) => handleChange("tipoCliente", value)}
                >
                  <SelectTrigger id="tipoCliente">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_CLIENTE.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="regulador">Regulador</FieldLabel>
                <Input
                  id="regulador"
                  value={data.regulador}
                  onChange={(e) => handleChange("regulador", e.target.value)}
                  placeholder="Nome do regulador"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="perito">Perito</FieldLabel>
                <Input
                  id="perito"
                  value={data.perito}
                  onChange={(e) => handleChange("perito", e.target.value)}
                  placeholder="Nome do perito"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="cidade">Cidade</FieldLabel>
                  <Input
                    id="cidade"
                    value={data.cidade}
                    onChange={(e) => handleChange("cidade", e.target.value)}
                    placeholder="Cidade"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="estado">Estado</FieldLabel>
                  <Input
                    id="estado"
                    value={data.estado}
                    onChange={(e) => handleChange("estado", e.target.value)}
                    placeholder="UF"
                  />
                </Field>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Informações do Veículo */}
        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Car className="h-5 w-5 text-secondary" />
              Informações do Veículo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="marca">Marca</FieldLabel>
                <Input
                  id="marca"
                  value={data.marca}
                  onChange={(e) => handleChange("marca", e.target.value)}
                  placeholder="Marca do veículo"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="modelo">Modelo</FieldLabel>
                <Input
                  id="modelo"
                  value={data.modelo}
                  onChange={(e) => handleChange("modelo", e.target.value)}
                  placeholder="Modelo do veículo"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="placa">Placa</FieldLabel>
                <Input
                  id="placa"
                  value={data.placa}
                  onChange={(e) => handleChange("placa", e.target.value)}
                  placeholder="ABC-1234"
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Informações da Oficina */}
        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-accent-foreground" />
              Informações da Oficina
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="oficina">Oficina</FieldLabel>
                <Input
                  id="oficina"
                  value={data.oficina}
                  onChange={(e) => handleChange("oficina", e.target.value)}
                  placeholder="Nome da oficina"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="tipoOficina">Tipo da Oficina</FieldLabel>
                  <Select
                    value={data.tipoOficina}
                    onValueChange={(value) => handleChange("tipoOficina", value)}
                  >
                    <SelectTrigger id="tipoOficina">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_OFICINA.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="credenciamento">Credenciamento</FieldLabel>
                  <Select
                    value={data.credenciamento}
                    onValueChange={(value) => handleChange("credenciamento", value)}
                  >
                    <SelectTrigger id="credenciamento">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {CREDENCIAMENTOS.map((cred) => (
                        <SelectItem key={cred} value={cred}>
                          {cred}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="data">Data</FieldLabel>
                  <Input
                    id="data"
                    type="date"
                    value={data.data}
                    onChange={(e) => handleChange("data", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="horaChegada">Hora Chegada</FieldLabel>
                  <Input
                    id="horaChegada"
                    type="time"
                    value={data.horaChegada}
                    onChange={(e) => handleChange("horaChegada", e.target.value)}
                  />
                </Field>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Agente da Causa e Motivo */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Agente da Causa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="agenteCausa">Agente da Causa</FieldLabel>
                <Select
                  value={data.agenteCausa}
                  onValueChange={(value) => handleChange("agenteCausa", value)}
                >
                  <SelectTrigger id="agenteCausa">
                    <SelectValue placeholder="Selecione o agente" />
                  </SelectTrigger>
                  <SelectContent>
                    {AGENTES_CAUSA.map((agente) => (
                      <SelectItem key={agente} value={agente}>
                        {agente}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="motivo">Motivo</FieldLabel>
                <Select
                  value={data.motivo}
                  onValueChange={(value) => handleChange("motivo", value)}
                >
                  <SelectTrigger id="motivo">
                    <SelectValue placeholder="Selecione o motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOTIVOS.map((motivo) => (
                      <SelectItem key={motivo} value={motivo}>
                        {motivo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
