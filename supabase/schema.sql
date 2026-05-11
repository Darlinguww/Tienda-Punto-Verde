-- ============================================================
-- PUNTO VERDE — Supabase Schema
-- Tienda de electrodomésticos eco-eficientes
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
create type order_status as enum ('pending', 'confirmed', 'in_progress', 'delivered', 'cancelled');
create type contact_type as enum ('whatsapp_inquiry', 'whatsapp_order', 'general');

-- ============================================================
-- TABLES
-- ============================================================

-- Perfil de negocio (configuración general de la tienda)
create table store_settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value jsonb not null default '{}',
  updated_at timestamptz default now()
);
insert into store_settings (key, value) values
  ('whatsapp_number', '{"number": "+573001234567", "enabled": true}'),
  ('business_info', '{"name": "Punto Verde S.A.S.", "nit": "901.455.122-1", "address": "", "email": ""}'),
  ('contact_hours', '{"start": "08:00", "end": "18:00", "timezone": "America/Bogota"}');

-- Categorías de productos
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  icon text,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);
insert into categories (name, slug, description, icon, sort_order) values
  ('Ventiladores', 'ventiladores', 'Ventilación inteligente y aire puro', 'Fan', 1),
  ('TV & Audio', 'tv-audio', 'Televisores y sistemas de audio eco-eficientes', 'Tv', 2),
  ('Lavado Eco', 'lavado-eco', 'Lavadoras de bajo consumo de agua y energía', 'WashingMachine', 3),
  ('Refrigeración', 'refrigeracion', 'Neveras y congeladores inverter', 'Refrigerator', 4),
  ('Promociones', 'promociones', 'Ofertas y descuentos especiales', 'Tag', 0);

-- Productos
create table products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  description text,
  description_short text,
  price numeric(12, 0) not null check (price >= 0),
  compare_at_price numeric(12, 0) check (compare_at_price >= price),
  sku text unique,
  images text[] default '{}',
  eco_features jsonb default '[]',
  specifications jsonb default '{}',
  stock integer default 0 check (stock >= 0),
  featured boolean default false,
  promotion jsonb,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Generación de slugs
create function generate_slug(name text)
returns text as $$
  select lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'));
$$ language sql immutable;

-- Clientes (perfil para WhatsApp y pedidos)
create table customers (
  id uuid primary key default uuid_generate_v4(),
  whatsapp text unique,
  name text,
  email text,
  address text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Pedidos (generados via WhatsApp o catálogo)
create table orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references customers(id) on delete set null,
  order_number text unique not null,
  status order_status default 'pending',
  items jsonb not null default '[]',
  subtotal numeric(12, 0) not null default 0,
  total numeric(12, 0) not null default 0,
  notes text,
  source text default 'web',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Mensajes de contacto WhatsApp
create table contacts (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references customers(id) on delete set null,
  type contact_type default 'whatsapp_inquiry',
  product_id uuid references products(id) on delete set null,
  customer_name text,
  customer_whatsapp text,
  message text not null,
  read boolean default false,
  replied boolean default false,
  created_at timestamptz default now()
);

-- Eventos analíticos (clicks, vistas, interacciones)
create table analytics_events (
  id uuid primary key default uuid_generate_v4(),
  event_type text not null,
  product_id uuid references products(id) on delete set null,
  session_id text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- ============================================================
-- FUNCIONES UTILITARIAS
-- ============================================================

-- Generar número de pedido secuencial
create function generate_order_number()
returns text as $$
  declare
    count_val integer;
  begin
    select count(*) + 1 into count_val from orders;
    return 'PV-' || to_char(now(), 'YYYY') || '-' || lpad(count_val::text, 6, '0');
  end;
$$ language plpgsql;

-- Actualizar updated_at automáticamente
create function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at before update on orders
  for each row execute function update_updated_at();
create trigger customers_updated_at before update on customers
  for each row execute function update_updated_at();

-- ============================================================
-- SEED DATA — Productos de ejemplo
-- ============================================================
do $$
declare
  cat_ventiladores uuid := (select id from categories where slug = 'ventiladores');
  cat_tv uuid := (select id from categories where slug = 'tv-audio');
  cat_lavado uuid := (select id from categories where slug = 'lavado-eco');
  cat_ref uuid := (select id from categories where slug = 'refrigeracion');
begin
  insert into products (category_id, name, slug, description, description_short, price, compare_at_price, sku, images, eco_features, specifications, featured, promotion) values
  (cat_ventiladores, 'Purificador de Aire Pro', 'purificador-de-aire-pro',
   'Ventilación inteligente y aire puro para tu hogar. Filtros HEPA de alta eficiencia.',
   'Aire puro con tecnología de filtrado avanzado.', 299000, null, 'PV-FAN-001',
   array['https://images.unsplash.com/photo-1591290619615-585808298715?auto=format&fit=crop&q=80&w=400'],
   '["Filtro HEPA", "Bajo consumo", "Silencioso"]', '{"potencia": "50W", "area": "30m2"}', true, null),

  (cat_tv, 'Smart TV 4K 55"', 'smart-tv-4k-55',
   'Resolución cinematográfica y eficiencia energética. Panel OLED con Dolby Vision.',
   '4K OLED con eficiencia energética clase A.', 1200000, 2000000, 'PV-TV-001',
   array['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400'],
   '["Clase A", "HDR Dolby Vision", "Smart"]', '{"pulgadas": "55", "resolucion": "4K"}', false,
   '{"label": "-40% LIQUIDACIÓN", "discount_percent": 40}'),

  (cat_lavado, 'Lavadora Eco-Wash', 'lavadora-eco-wash',
   'Ahorro de agua extremo y motores silenciosos. Tecnologia inverter.',
   'Lavadora inverter de bajo consumo.', 1500000, null, 'PV-LAV-001',
   array['https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&q=80&w=400'],
   '["Inverter", "Bajo consumo agua", "Silencioso"]', '{"capacidad": "8kg", "rpm": "1200"}', true, null),

  (cat_ref, 'Nevera Inverter Duo', 'nevera-inverter-duo',
   'Frío envolvente con consumo mínimo de energía. Doble puerta con dispensador.',
   'Nevera inverter con dispensador de agua.', 2500000, null, 'PV-REF-001',
   array['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400'],
   '["Inverter", "Clase A++", "No Frost"]', '{"capacidad": "450L", "puertas": "2"}', false, null);
end $$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table store_settings enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table contacts enable row level security;
alter table analytics_events enable row level security;

-- Productos: lectura pública para web
create policy "Productos son públicos" on products
  for select using (is_active = true);
create policy "Categorías son públicas" on categories
  for select using (is_active = true);

-- Analytics: solo inserción pública (tracking)
create policy "Tracking público" on analytics_events
  for insert with check (true);

-- Contacts: solo inserción pública (formulario/whatsapp)
create policy "Contactos vía web" on contacts
  for insert with check (true);

-- store_settings: lectura pública
create policy "Settings público" on store_settings
  for select using (true);

-- ============================================================
-- VISTAS ÚTILES
-- ============================================================

-- Vista de productos activos con categoría
create view v_products_full as
select
  p.id, p.name, p.slug, p.description, p.description_short,
  p.price, p.compare_at_price, p.sku, p.images, p.eco_features,
  p.specifications, p.stock, p.featured, p.promotion, p.sort_order,
  c.name as category, c.slug as category_slug,
  case when p.promotion is not null then true else false end as on_sale
from products p
left join categories c on c.id = p.category_id
where p.is_active = true
order by c.sort_order, p.sort_order;

-- Pedidos pendientes
create view v_orders_pending as
select
  o.id, o.order_number, o.status, o.total, o.created_at,
  c.name as customer, c.whatsapp
from orders o
left join customers c on c.id = o.customer_id
where o.status = 'pending'
order by o.created_at desc;
