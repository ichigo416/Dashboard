import { Router } from "express";
import DashboardRoutes from "./DashboardRoutes";
import CustomerRoutes from "./CustomerRoutes";
import AuthRoutes from "./AuthRoutes";

const router = Router();

// Auth (login / signup / role-based auth)
router.use("/auth", AuthRoutes);

// Existing routes (UNCHANGED)
router.use("/dashboard", DashboardRoutes);
router.use("/customers", CustomerRoutes);

export default router;