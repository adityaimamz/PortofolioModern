-- Aktifkan ekstensi pgvector
create extension if not exists vector;

-- Buat tabel untuk menyimpan dokumen portofolio dan embedding-nya
create table if not exists documents (
  id bigserial primary key,
  content text, -- Isi teks dokumen (misal: pengalaman kerja, project)
  metadata jsonb, -- Metadata tambahan (misal: jenis dokumen, URL, dll)
  embedding vector(3072) -- 768 dimensi karena kita menggunakan model embedding dari Google (misal: text-embedding-004)
);

-- Buat fungsi untuk melakukan similarity search (pencarian konteks yang relevan)
create or replace function match_documents (
  query_embedding vector(3072),
  match_count int default null,
  match_threshold float default 0.3,
  filter jsonb default '{}'
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
    and 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
