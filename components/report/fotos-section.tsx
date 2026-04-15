"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImagePlus, X, Camera } from "lucide-react"
import type { Foto } from "@/lib/report-data"

interface FotosSectionProps {
  data: Foto[]
  onChange: (fotos: Foto[]) => void
}

export function FotosSection({ data, onChange }: FotosSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    const newFotos: Foto[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Converter para base64 para exibição local
      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      newFotos.push({
        id: `foto-${Date.now()}-${i}`,
        url: base64,
        descricao: "",
      })
    }

    onChange([...data, ...newFotos])
    setIsUploading(false)

    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveFoto = (id: string) => {
    onChange(data.filter((foto) => foto.id !== id))
  }

  const handleDescricaoChange = (id: string, descricao: string) => {
    onChange(
      data.map((foto) =>
        foto.id === id ? { ...foto, descricao } : foto
      )
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {/* Área de upload */}
        <div
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <Camera className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-sm text-muted-foreground mb-2">
            Clique para adicionar fotos ou arraste e solte aqui
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            {isUploading ? "Carregando..." : "Selecionar Fotos"}
          </Button>
        </div>

        {/* Grid de fotos */}
        {data.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((foto) => (
              <div
                key={foto.id}
                className="relative group rounded-lg overflow-hidden border bg-muted/30"
              >
                <img
                  src={foto.url}
                  alt={foto.descricao || "Foto do laudo"}
                  className="w-full h-32 object-cover"
                />
                <button
                  onClick={() => handleRemoveFoto(foto.id)}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="p-2">
                  <Input
                    placeholder="Descrição da foto"
                    value={foto.descricao}
                    onChange={(e) => handleDescricaoChange(foto.id, e.target.value)}
                    className="text-xs h-8"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {data.length > 0 && (
          <p className="text-xs text-muted-foreground mt-4">
            {data.length} foto{data.length !== 1 ? "s" : ""} adicionada{data.length !== 1 ? "s" : ""}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
