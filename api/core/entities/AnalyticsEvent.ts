export class AnalyticsEvent {
  constructor(
    public readonly productId: string,
    public readonly timestamp: string,
    public readonly type: string = "whatsapp_click"
  ) {}
}
