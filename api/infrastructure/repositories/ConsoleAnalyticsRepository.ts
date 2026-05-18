import { AnalyticsEvent } from "../../core/entities/AnalyticsEvent.js";
import { IAnalyticsRepository } from "../../core/repositories/IAnalyticsRepository.js";

export class ConsoleAnalyticsRepository implements IAnalyticsRepository {
  async save(event: AnalyticsEvent): Promise<void> {
    // Por ahora simulamos guardarlo logueando en consola
    // Más adelante aquí se puede implementar la llamada a Supabase o cualquier BD
    console.log(
      `[Clean Architecture - Analytics] Evento '${event.type}' registrado para producto ${event.productId} a las ${event.timestamp}`
    );
  }
}
