import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Benefit } from '../types';
import { BENEFITS } from '../constants';

export function useBenefits() {
  const [benefits, setBenefits] = useState<Benefit[]>(BENEFITS);

  useEffect(() => {
    supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'benefits')
      .single()
      .then(({ data }) => {
        if (Array.isArray(data?.value) && data.value.length > 0) {
          setBenefits(data.value as Benefit[]);
        }
      });
  }, []);

  return benefits;
}
