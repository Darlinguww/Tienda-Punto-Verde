-- Agregar columna destacado a productos
ALTER TABLE products ADD COLUMN destacado boolean NOT NULL DEFAULT false;

-- Recrear la vista para incluir la nueva columna
DROP VIEW v_products_full;
CREATE VIEW v_products_full AS
SELECT
  p.id, p.name, p.slug, p.description, p.description_short,
  p.price, p.compare_at_price, p.sku, p.images, p.eco_features,
  p.specifications, p.stock, p.featured, p.destacado, p.promotion, p.sort_order,
  c.name AS category, c.slug AS category_slug,
  CASE WHEN p.promotion IS NOT NULL THEN true ELSE false END AS on_sale
FROM products p
LEFT JOIN categories c ON c.id = p.category_id
WHERE p.is_active = true
ORDER BY c.sort_order, p.sort_order;
