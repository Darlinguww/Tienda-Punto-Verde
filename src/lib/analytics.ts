import { supabase } from './supabase';

export type EventType = 'registration' | 'product_view' | 'whatsapp_click' | 'search';

export interface AnalyticsEvent {
  type: EventType;
  data?: string;
  timestamp: string;
}

export interface AnalyticsStats {
  registrations: number;
  whatsappClicks: number;
  totalViews: number;
  searches: number;
  topSearches: Record<string, number>;
  topProducts: Record<string, number>;
}

export const trackEvent = (type: EventType, data?: string) => {
  try {
    const events: AnalyticsEvent[] = JSON.parse(localStorage.getItem('pv_analytics') || '[]');
    events.push({ type, data, timestamp: new Date().toISOString() });
    localStorage.setItem('pv_analytics', JSON.stringify(events));
  } catch {
    // ignore
  }

  const metadata: Record<string, string> = {};
  if (data) {
    if (type === 'search') metadata.term = data;
    else if (type === 'product_view') metadata.slug = data;
  }

  supabase.from('analytics_events').insert({ event_type: type, metadata }).then(() => {});
};

export const getAnalyticsEvents = (): AnalyticsEvent[] => {
  try {
    return JSON.parse(localStorage.getItem('pv_analytics') || '[]');
  } catch {
    return [];
  }
};

function aggregate(rows: { event_type: string; metadata: Record<string, string> }[]): AnalyticsStats {
  const stats: AnalyticsStats = {
    registrations: 0,
    whatsappClicks: 0,
    totalViews: 0,
    searches: 0,
    topSearches: {},
    topProducts: {},
  };

  for (const e of rows) {
    if (e.event_type === 'registration') stats.registrations++;
    if (e.event_type === 'whatsapp_click') stats.whatsappClicks++;
    if (e.event_type === 'search') {
      stats.searches++;
      const term = e.metadata?.term;
      if (term) stats.topSearches[term] = (stats.topSearches[term] || 0) + 1;
    }
    if (e.event_type === 'product_view') {
      stats.totalViews++;
      const slug = e.metadata?.slug;
      if (slug) stats.topProducts[slug] = (stats.topProducts[slug] || 0) + 1;
    }
  }

  return stats;
}

export const getAnalyticsStats = (): AnalyticsStats => {
  const events = getAnalyticsEvents();
  return aggregate(
    events.map(e => ({
      event_type: e.type,
      metadata: e.data
        ? e.type === 'search' ? { term: e.data } : { slug: e.data }
        : {},
    }))
  );
};

export const getAnalyticsStatsFromDB = async (): Promise<AnalyticsStats> => {
  const { data, error } = await supabase
    .from('analytics_events')
    .select('event_type, metadata');

  if (error || !data) return getAnalyticsStats();

  return aggregate(data as { event_type: string; metadata: Record<string, string> }[]);
};
