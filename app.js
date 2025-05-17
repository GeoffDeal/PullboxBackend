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
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use((req, res, next) => {
  const isPublic = req.path.startsWith("/api/webhooks/");
  if (isPublic) return next();
  return clerkMiddleware({ apiKey: process.env.CLERK_SECRET_KEY })(
    req,
    res,
    next
  );
});
app.use("/api/webhooks", express.raw({ type: "application/json" }));
app.use("/api/webhooks", webhookRouter);

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

process.on("SIGINT", () => closePool("SIGINT")); //Close pool on exit
process.on("SIGTERM", () => closePool("SIGTERM"));

// Routes

app.use("/products/", productRouter);

app.use("/users/", userRouter);

app.use("/subs/", subscriptionRouter);

app.use("/pulls/", pullRouter);

app.use("/notifications", notificationRouter);

app.use("/storeinfo", storeInfoRouter);

app.use("/priceadjustments", priceAdjustmentRouter);

const port = process.env.PORT || 3000; // Listening
app.listen(port, () => {
  console.log("Server running");
});

tableCheck(); // Look for tables, create if missing
