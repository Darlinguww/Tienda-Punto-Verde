import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, DbCategory } from '../types';
import { supabase } from '../lib/supabase';

interface ProductContextType {
  products: Product[];
  categories: DbCategory[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => void;
  removeProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStarted = { current: false };

    const fetchData = async () => {
      if (fetchStarted.current) return;
      fetchStarted.current = true;

      try {
        const [categoriesRes, productsRes] = await Promise.all([
          supabase
            .from('categories')
            .select('id, name, slug, icon, sort_order')
            .eq('is_active', true)
            .order('sort_order'),
          supabase
            .from('v_products_full')
            .select('id, name, slug, description, description_short, price, images, featured, destacado, interes, promotion, category, category_slug')
            .order('category_slug')
            .order('featured', { ascending: false }),
        ]);

        if (!isMounted) return;

        if (categoriesRes.data) {
          setCategories(categoriesRes.data as DbCategory[]);
        }

        if (productsRes.data) {
          setProducts(
            productsRes.data.map((p) => ({
              id: p.id as string,
              name: p.name as string,
              slug: p.slug as string,
              description: (p.description_short || p.description) as string,
              price: p.price as number,
              category: p.category as string,
              category_slug: p.category_slug as string,
              image: ((p.images as string[]) || [])[0] || '',
              featured: p.featured as boolean,
              destacado: p.destacado as boolean,
              interes: p.interes as number,
              promotion: p.promotion ? (p.promotion as { label: string }).label : undefined,
            }))
          );
        }
      } catch {
        // ignore fetch errors
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updatedData: Omit<Product, 'id'>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...updatedData, id } : p)));
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, categories, loading, addProduct, updateProduct, removeProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductsContext() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductsContext debe usarse dentro de ProductProvider');
  }
  return context;
}
