-- Adicionar coluna seguradora na tabela laudos
ALTER TABLE laudos ADD COLUMN IF NOT EXISTS seguradora TEXT;
