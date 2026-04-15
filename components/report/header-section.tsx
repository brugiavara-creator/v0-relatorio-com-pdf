"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import type { ReportHeader } from "@/lib/report-data"
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
    <div className="grid gap-6 md:grid-cols-2">
      {/* Informações do Sinistro */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-blue-500" />
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
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Car className="h-5 w-5 text-green-500" />
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
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5 text-amber-500" />
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
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Agente da Causa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="agenteCausa">Agente da Causa</FieldLabel>
              <Input
                id="agenteCausa"
                value={data.agenteCausa}
                onChange={(e) => handleChange("agenteCausa", e.target.value)}
                placeholder="Identificação do agente"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="motivo">Motivo</FieldLabel>
              <Textarea
                id="motivo"
                value={data.motivo}
                onChange={(e) => handleChange("motivo", e.target.value)}
                placeholder="Descreva o motivo do sinistro..."
                rows={3}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}
