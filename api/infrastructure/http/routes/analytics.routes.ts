import { Router } from "express";
import { AnalyticsController } from "../controllers/AnalyticsController.js";
import { RegisterClickUseCase } from "../../../use-cases/RegisterClickUseCase.js";
import { ConsoleAnalyticsRepository } from "../../repositories/ConsoleAnalyticsRepository.js";

const router = Router();

// Factoría y configuración de Inyección de Dependencias
const repository = new ConsoleAnalyticsRepository();
const useCase = new RegisterClickUseCase(repository);
const controller = new AnalyticsController(useCase);

// Rutas
router.post("/click", controller.registerClick.bind(controller));

export default router;
