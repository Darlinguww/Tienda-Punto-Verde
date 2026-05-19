import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useWhatsAppNumber() {
  const [number, setNumber] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'whatsapp_number')
      .single()
      .then(({ data }) => {
        const raw = (data?.value as { number?: string; enabled?: boolean } | null);
        if (raw?.enabled && raw.number) {
          setNumber(raw.number.replace('+', ''));
        }
      });
  }, []);

  return number;
}
