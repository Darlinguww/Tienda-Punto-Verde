export type EventType = 'registration' | 'product_view' | 'whatsapp_click' | 'search';

export interface AnalyticsEvent {
  type: EventType;
  data?: string;
  timestamp: string;
}

export const trackEvent = (type: EventType, data?: string) => {
  try {
    const events: AnalyticsEvent[] = JSON.parse(localStorage.getItem('pv_analytics') || '[]');
    events.push({ type, data, timestamp: new Date().toISOString() });
    localStorage.setItem('pv_analytics', JSON.stringify(events));
  } catch (err) {
    console.error('Error tracking event', err);
  }
};

export const getAnalyticsEvents = (): AnalyticsEvent[] => {
  try {
    return JSON.parse(localStorage.getItem('pv_analytics') || '[]');
  } catch (err) {
    return [];
  }
};

export const getAnalyticsStats = () => {
  const events = getAnalyticsEvents();
  
  const stats = {
    registrations: 0,
    whatsappClicks: 0,
    totalViews: 0,
    searches: 0,
    topSearches: {} as Record<string, number>,
    topProducts: {} as Record<string, number>,
  };

  events.forEach(event => {
    if (event.type === 'registration') stats.registrations++;
    if (event.type === 'whatsapp_click') stats.whatsappClicks++;
    if (event.type === 'search') {
      stats.searches++;
      if (event.data) {
        stats.topSearches[event.data] = (stats.topSearches[event.data] || 0) + 1;
      }
    }
    if (event.type === 'product_view') {
      stats.totalViews++;
      if (event.data) {
        stats.topProducts[event.data] = (stats.topProducts[event.data] || 0) + 1;
      }
    }
  });

  return stats;
};
