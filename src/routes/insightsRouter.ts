import { Router } from "express";
import { InsightsController } from "../controllers/insightsController";
import { InsightsService } from "../services/insightsService";
import { CsvService } from "../services/csvService";

export const createInsightsRouter = (): Router => {
    const router: Router = Router();
    const filesService = new CsvService();
    const insightsService = new InsightsService(filesService);
    const insightsController = new InsightsController(insightsService);

    router.get("/expiring-leases", insightsController.getExpiringLeases);
    router.get("/extreme-vacancy", insightsController.getExtremeVacancy);
    return router;
};
