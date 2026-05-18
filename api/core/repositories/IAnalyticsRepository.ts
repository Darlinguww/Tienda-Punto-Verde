import { AnalyticsEvent } from "../entities/AnalyticsEvent.js";

export interface IAnalyticsRepository {
  save(event: AnalyticsEvent): Promise<void>;
}
