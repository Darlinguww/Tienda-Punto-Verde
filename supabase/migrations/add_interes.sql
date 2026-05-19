-- Columna de interés (se incrementa cuando el carrito se envía por WhatsApp)
ALTER TABLE products ADD COLUMN interes integer NOT NULL DEFAULT 0;

-- Recrear la vista incluyendo interes y destacado
DROP VIEW v_products_full;
CREATE VIEW v_products_full AS
SELECT
  p.id, p.name, p.slug, p.description, p.description_short,
  p.price, p.compare_at_price, p.sku, p.images, p.eco_features,
  p.specifications, p.stock, p.featured, p.destacado, p.interes, p.promotion, p.sort_order,
  c.name AS category, c.slug AS category_slug,
  CASE WHEN p.promotion IS NOT NULL THEN true ELSE false END AS on_sale
FROM products p
LEFT JOIN categories c ON c.id = p.category_id
WHERE p.is_active = true
ORDER BY c.sort_order, p.sort_order;

-- Función atómica para incrementar interes sin race conditions.
-- SECURITY DEFINER permite actualizarla con la anon key sin abrir UPDATE en RLS.
CREATE OR REPLACE FUNCTION increment_interes(product_id uuid, amount integer)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE products SET interes = interes + amount WHERE id = product_id;
$$;

GRANT EXECUTE ON FUNCTION increment_interes(uuid, integer) TO anon;
