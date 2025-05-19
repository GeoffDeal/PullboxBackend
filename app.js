import express from "express";
import productRouter from "./src/routes/productRoutes.js";
import userRouter from "./src/routes/userRoutes.js";
import subscriptionRouter from "./src/routes/subscriptionRoutes.js";
import pullRouter from "./src/routes/pullRoutes.js";
import notificationRouter from "./src/routes/notificationRoutes.js";
import storeInfoRouter from "./src/routes/storeInfoRoutes.js";
import priceAdjustmentRouter from "./src/routes/priceAdjustmentRoutes.js";
import webhookRouter from "./src/routes/webhookRoutes.js";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { closePool, tableCheck } from "./src/utils/utilityFunctions.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

process.on("SIGINT", () => closePool("SIGINT")); //Close pool on exit
process.on("SIGTERM", () => closePool("SIGTERM"));

// Public Routes
const publicRouter = express.Router();

publicRouter.use("/webhooks", express.raw({ type: "application/json" }));

publicRouter.use("/webhooks", webhookRouter);

app.use("/api", publicRouter);

// Protected Routes

const protectedRouter = express.Router();
protectedRouter.use(clerkMiddleware({ apiKey: process.env.CLERK_SECRET_KEY }));
protectedRouter.use(express.json());

protectedRouter.use("/products", productRouter);

protectedRouter.use("/users", userRouter);

protectedRouter.use("/subs", subscriptionRouter);

protectedRouter.use("/pulls", pullRouter);

protectedRouter.use("/notifications", notificationRouter);

protectedRouter.use("/storeinfo", storeInfoRouter);

protectedRouter.use("/priceadjustments", priceAdjustmentRouter);

app.use("/", protectedRouter);

// Listening

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running");
});

tableCheck(); // Look for tables, create if missing
