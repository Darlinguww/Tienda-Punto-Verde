import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useBusinessEmail() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'business_info')
      .single()
      .then(({ data }) => {
        const raw = data?.value as { email?: string } | null;
        if (raw?.email) {
          setEmail(raw.email);
        }
      });
  }, []);

  return email;
}