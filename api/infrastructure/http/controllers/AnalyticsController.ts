import { Request, Response } from "express";
import { RegisterClickUseCase } from "../../../use-cases/RegisterClickUseCase.js";

export class AnalyticsController {
  constructor(private readonly registerClickUseCase: RegisterClickUseCase) {}

  async registerClick(req: Request, res: Response): Promise<void> {
    try {
      const { productId, timestamp } = req.body;
      
      await this.registerClickUseCase.execute(productId, timestamp);
      
      res.json({ 
        status: "success", 
        message: "Click registrado usando Clean Architecture" 
      });
    } catch (error: any) {
      res.status(400).json({ 
        status: "error", 
        message: error.message 
      });
    }
  }
}
