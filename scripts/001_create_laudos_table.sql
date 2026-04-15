-- Tabela para armazenar os laudos gerados
CREATE TABLE IF NOT EXISTS public.laudos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Informações do Sinistro
  sinistro TEXT,
  tipo_cliente TEXT,
  regulador TEXT,
  perito TEXT,
  cidade TEXT,
  estado TEXT,
  
  -- Informações do Veículo
  marca TEXT,
  modelo TEXT,
  placa TEXT,
  chassi TEXT,
  
  -- Informações da Oficina
  oficina TEXT,
  tipo_oficina TEXT,
  credenciamento TEXT,
  data_inspecao DATE,
  hora_chegada TIME,
  
  -- Agente e Motivo
  agente_causa TEXT,
  motivo TEXT,
  
  -- Valores do Orçamento
  valor_inicial_orcamento DECIMAL(12,2) DEFAULT 0,
  franquia DECIMAL(12,2) DEFAULT 0,
  
  -- Totais Calculados
  total_pecas_deduzidas DECIMAL(12,2) DEFAULT 0,
  total_pecas_negociadas DECIMAL(12,2) DEFAULT 0,
  total_mo_deduzida DECIMAL(12,2) DEFAULT 0,
  total_mo_incluida DECIMAL(12,2) DEFAULT 0,
  total_servicos_terceiros_deducao DECIMAL(12,2) DEFAULT 0,
  total_servicos_terceiros_inclusao DECIMAL(12,2) DEFAULT 0,
  total_deducoes DECIMAL(12,2) DEFAULT 0,
  total_inclusoes DECIMAL(12,2) DEFAULT 0,
  saldo_final DECIMAL(12,2) DEFAULT 0,
  
  -- Observações
  observacao TEXT,
  
  -- Dados completos em JSON para referência
  dados_completos JSONB
);

-- Tabela para armazenar as peças glosadas de cada laudo
CREATE TABLE IF NOT EXISTS public.laudos_pecas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  laudo_id UUID NOT NULL REFERENCES public.laudos(id) ON DELETE CASCADE,
  quantidade INTEGER DEFAULT 1,
  codigo TEXT,
  descricao TEXT,
  valor_unitario DECIMAL(12,2) DEFAULT 0,
  valor_total DECIMAL(12,2) DEFAULT 0,
  valor_negociado DECIMAL(12,2) DEFAULT 0,
  valor_liquido DECIMAL(12,2) DEFAULT 0
);

-- Tabela para armazenar as glosas de mão de obra
CREATE TABLE IF NOT EXISTS public.laudos_mao_de_obra (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  laudo_id UUID NOT NULL REFERENCES public.laudos(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL, -- 'deducao' ou 'inclusao'
  categoria TEXT NOT NULL, -- 'servicos_gerais', 'pintura', 'recuperacao'
  descricao TEXT,
  valor_hora DECIMAL(12,2) DEFAULT 0,
  horas DECIMAL(8,2) DEFAULT 0,
  valor_total DECIMAL(12,2) DEFAULT 0
);

-- Tabela para armazenar as fotos dos laudos
CREATE TABLE IF NOT EXISTS public.laudos_fotos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  laudo_id UUID NOT NULL REFERENCES public.laudos(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhorar performance das consultas do Power BI
CREATE INDEX IF NOT EXISTS idx_laudos_created_at ON public.laudos(created_at);
CREATE INDEX IF NOT EXISTS idx_laudos_sinistro ON public.laudos(sinistro);
CREATE INDEX IF NOT EXISTS idx_laudos_placa ON public.laudos(placa);
CREATE INDEX IF NOT EXISTS idx_laudos_oficina ON public.laudos(oficina);
CREATE INDEX IF NOT EXISTS idx_laudos_agente_causa ON public.laudos(agente_causa);
CREATE INDEX IF NOT EXISTS idx_laudos_motivo ON public.laudos(motivo);
CREATE INDEX IF NOT EXISTS idx_laudos_pecas_laudo_id ON public.laudos_pecas(laudo_id);
CREATE INDEX IF NOT EXISTS idx_laudos_mao_de_obra_laudo_id ON public.laudos_mao_de_obra(laudo_id);
CREATE INDEX IF NOT EXISTS idx_laudos_fotos_laudo_id ON public.laudos_fotos(laudo_id);

-- Habilitar RLS (Row Level Security) - permitir acesso público para este caso
ALTER TABLE public.laudos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laudos_pecas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laudos_mao_de_obra ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laudos_fotos ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público (sem autenticação necessária para este caso de uso)
CREATE POLICY "Allow public read access on laudos" ON public.laudos FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on laudos" ON public.laudos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on laudos" ON public.laudos FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on laudos_pecas" ON public.laudos_pecas FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on laudos_pecas" ON public.laudos_pecas FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on laudos_mao_de_obra" ON public.laudos_mao_de_obra FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on laudos_mao_de_obra" ON public.laudos_mao_de_obra FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on laudos_fotos" ON public.laudos_fotos FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on laudos_fotos" ON public.laudos_fotos FOR INSERT WITH CHECK (true);
