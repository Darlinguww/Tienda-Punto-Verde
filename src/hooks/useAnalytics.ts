import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AnalyticsPayload {
  event_type: string;
  product_id?: string;
  metadata?: Record<string, unknown>;
}

export function useAnalytics() {
  useEffect(() => {
    const sessionId = sessionStorage.getItem('session_id') ||
      (() => {
        const id = Math.random().toString(36).slice(2);
        sessionStorage.setItem('session_id', id);
        return id;
      })();

    const track = async (payload: AnalyticsPayload) => {
      await supabase.from('analytics_events').insert({
        ...payload,
        session_id: sessionId,
      });
    };

    (window as unknown as Record<string, unknown>).trackEvent = track;
  }, []);

  const trackClick = async (productId: string) => {
    await supabase.from('analytics_events').insert({
      event_type: 'whatsapp_click',
      product_id: productId,
      metadata: {},
    });
  };

  return { trackClick };
}
