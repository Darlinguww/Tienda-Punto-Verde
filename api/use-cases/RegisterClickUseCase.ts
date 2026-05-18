import { AnalyticsEvent } from "../core/entities/AnalyticsEvent.js";
import { IAnalyticsRepository } from "../core/repositories/IAnalyticsRepository.js";

export class RegisterClickUseCase {
  constructor(private readonly repository: IAnalyticsRepository) {}

  async execute(productId: string, timestamp: string): Promise<void> {
    if (!productId) {
      throw new Error("El productId es requerido");
    }
    
    // Si no se provee timestamp, creamos uno
    const event = new AnalyticsEvent(productId, timestamp || new Date().toISOString());
    
    await this.repository.save(event);
  }
}
