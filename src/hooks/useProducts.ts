import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

export function useProducts(categorySlug?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let query = supabase
      .from('v_products_full')
      .select('id, name, description, description_short, price, compare_at_price, images, eco_features, featured, promotion, category, category_slug');

    if (categorySlug && categorySlug !== 'promociones') {
      query = query.eq('category_slug', categorySlug);
    }

    if (categorySlug === 'promociones') {
      query = query.eq('on_sale', true);
    }

    query.order('category_slug').order('featured', { ascending: false });

    query.then(({ data, error }) => {
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      const mapped: Product[] = (data || []).map((p: Record<string, unknown>) => ({
        id: p.id as string,
        name: p.name as string,
        description: (p.description_short || p.description) as string,
        price: p.price as number,
        category: p.category as string,
        image: ((p.images as string[]) || [])[0] || '',
        featured: p.featured as boolean,
        promotion: p.promotion ? (p.promotion as { label: string }).label : undefined,
      }));
      setProducts(mapped);
      setLoading(false);
    });
  }, [categorySlug]);

  return { products, loading, error };
}
