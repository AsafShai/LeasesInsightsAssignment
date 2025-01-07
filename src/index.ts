import express from "express";
import cors from  "cors";
import { createUploadFileRouter } from "./routes/uploadFileRoutes";
import { createInsightsRouter } from "./routes/insightsRouter";

const app = express();
app.use(express.json());
app.use(cors());

const uploadFileRouter = createUploadFileRouter();
const insightsRouter = createInsightsRouter();

app.use("/api/", uploadFileRouter);
app.use("/api/insights/", insightsRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})