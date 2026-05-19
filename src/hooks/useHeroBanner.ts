import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface HeroBanner {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

export function useHeroBanner() {
  const [banner, setBanner] = useState<HeroBanner | null>(null);

  useEffect(() => {
    supabase
      .from('hero_banners')
      .select('id, title, description, image_url')
      .eq('is_active', true)
      .order('sort_order')
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setBanner(data as HeroBanner);
      });
  }, []);

  return banner;
}
