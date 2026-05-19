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

const SELECT_COLS = 'id, name, slug, description, description_short, price, images, featured, destacado, interes, promotion, category, category_slug';

function mapRow(p: Record<string, unknown>): Product {
  return {
    id: p.id as string,
    name: p.name as string,
    slug: p.slug as string,
    description: ((p.description_short || p.description) as string),
    price: p.price as number,
    category: p.category as string,
    category_slug: p.category_slug as string,
    image: ((p.images as string[]) || [])[0] || '',
    featured: p.featured as boolean,
    destacado: p.destacado as boolean,
    interes: p.interes as number,
    promotion: p.promotion ? (p.promotion as { label: string }).label : undefined,
  };
}

function makeSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-') + '-' + Date.now();
}

async function refetch(): Promise<Product[]> {
  const { data } = await supabase
    .from('v_products_full')
    .select(SELECT_COLS)
    .order('category_slug')
    .order('featured', { ascending: false });
  return (data ?? []).map(p => mapRow(p as Record<string, unknown>));
}

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
            .select(SELECT_COLS)
            .order('category_slug')
            .order('featured', { ascending: false }),
        ]);

        if (!isMounted) return;

        if (categoriesRes.data) setCategories(categoriesRes.data as DbCategory[]);
        if (productsRes.data) setProducts(productsRes.data.map(p => mapRow(p as Record<string, unknown>)));
      } catch {
        // ignore fetch errors
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const tempId = `temp-${Date.now()}`;
    setProducts(prev => [{ ...product, id: tempId }, ...prev]);

    const cat = categories.find(c => c.name === product.category || c.slug === product.category_slug);

    supabase.from('products').insert({
      category_id: cat?.id ?? null,
      name: product.name,
      slug: makeSlug(product.name),
      description: product.description,
      price: product.price,
      images: product.image ? [product.image] : [],
      promotion: product.promotion ? { label: product.promotion } : null,
      featured: product.featured ?? false,
      is_active: true,
    }).select('id').single().then(({ data, error }) => {
      if (error) {
        setProducts(prev => prev.filter(p => p.id !== tempId));
      } else if (data) {
        setProducts(prev => prev.map(p => p.id === tempId ? { ...p, id: (data as { id: string }).id } : p));
      }
    });
  };

  const updateProduct = (id: string, updatedData: Omit<Product, 'id'>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...updatedData, id } : p));

    const cat = categories.find(c => c.name === updatedData.category || c.slug === updatedData.category_slug);

    supabase.from('products').update({
      category_id: cat?.id ?? null,
      name: updatedData.name,
      description: updatedData.description,
      price: updatedData.price,
      images: updatedData.image ? [updatedData.image] : [],
      promotion: updatedData.promotion ? { label: updatedData.promotion } : null,
      featured: updatedData.featured ?? false,
    }).eq('id', id).then(({ error }) => {
      if (error) refetch().then(setProducts);
    });
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));

    supabase.from('products').update({ is_active: false }).eq('id', id).then(({ error }) => {
      if (error) refetch().then(setProducts);
    });
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
