import { Request, Response, Router } from "express";
import { upload } from "../middlewares/multerMiddleware";

export const createUploadFileRouter = (): Router => {
    const router = Router();

    router.post(
        "/upload",
        upload.single("file"),
        (req: Request, res: Response): void => {
            try {
                if (!req.file) {
                    res.status(400).json({ error: "No file uploaded" });
                    return;
                }
                res.status(200).json({ message: "File uploaded successfully" });
            } catch (error) {
                res.status(500).json({ error: "Error uploading file" });
            }
        }
    );
    return router;
};
