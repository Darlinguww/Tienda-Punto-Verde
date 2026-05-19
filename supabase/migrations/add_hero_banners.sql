-- Tabla para el banner principal del hero
CREATE TABLE hero_banners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Contenido inicial (igual al que estaba hardcodeado)
INSERT INTO hero_banners (title, description, image_url, sort_order) VALUES (
  'Innovación para un Hogar Sostenible',
  'Electrodomésticos de alta eficiencia y tecnología de punta. Envíos inmediatos para equipar tu hogar.',
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200',
  0
);

-- RLS: solo lectura pública para banners activos
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hero banners son públicos" ON hero_banners FOR SELECT USING (is_active = true);
