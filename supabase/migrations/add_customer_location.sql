ALTER TABLE customers
  ADD COLUMN country text NOT NULL DEFAULT 'Colombia',
  ADD COLUMN department text,
  ADD COLUMN city text;
