import { Request, Response } from "express";
import { InsightsService } from "../services/insightsService";
import { ErrorReadingFile } from "../customErrors/ErrorReadingFile";

export class InsightsController {
    constructor(private readonly insightsService: InsightsService) {
        this.insightsService = insightsService;
    }

    public getExpiringLeases = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const expiringLeases =
                await this.insightsService.getExpiringLeases();
            res.status(200).json(expiringLeases);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    public getExtremeVacancy = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const extremeVacancy =
                await this.insightsService.getExtremeVacancy();
            res.status(200).json(extremeVacancy);
        } catch (error) {
            if (error instanceof ErrorReadingFile) {
                res.status(error.statusCode).json({ error: error.message });
            } else if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: "An unknown error occurred" });
            }
        }
    }
}
