"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare } from "lucide-react"

interface ObservacaoSectionProps {
  value: string
  onChange: (value: string) => void
}

export function ObservacaoSection({ value, onChange }: ObservacaoSectionProps) {
  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5 text-primary" />
          Observações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Adicione observações relevantes sobre o laudo..."
          rows={4}
          className="resize-none"
        />
      </CardContent>
    </Card>
  )
}
