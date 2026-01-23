import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/AuthRoutes";
import routes from "./routes";
import { connectMongo } from "./db/mongo";

const app = express();

// =======================
// DATABASE
// =======================
connectMongo();

// =======================
// MIDDLEWARE
// =======================
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

app.use(express.json());

// =======================
// ROUTES
// =======================
app.use("/api/auth", authRoutes);
app.use("/api", routes);

// ✅ DEFAULT EXPORT
export default app;