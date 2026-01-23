import { Router } from "express";
import { DashboardService } from "../services/DashboardService";

const router = Router();

/**
 * GET /api/dashboard/summary
 * (POLLING)
 */
router.get("/summary", (req, res) => {
  const data = DashboardService.getSummary();
  res.json(data);
});

/**
 * GET /api/dashboard/monthly-sales
 */
router.get("/monthly-sales", (req, res) => {
  const data = DashboardService.getMonthlySales();
  res.json(data);
});

/**
 * GET /api/dashboard/target
 */
router.get("/target", (req, res) => {
  const data = DashboardService.getTarget();
  res.json(data);
});

/**
 * GET /api/dashboard/statistics/:type
 * type = monthly | quarterly | annually
 */
router.get("/statistics/:type", (req, res) => {
  const type = req.params.type as "monthly" | "quarterly" | "annually";
  const data = DashboardService.getStatistics(type);
  res.json(data);
});

/**
 * GET /api/dashboard/stream
 * (SERVER-SENT EVENTS)
 */
router.get("/stream", (req, res) => {
  // Required SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering

  // Send all dashboard data
  const sendData = () => {
    try {
      const summary = DashboardService.getSummary();
      const monthlySales = DashboardService.getMonthlySales();
      const target = DashboardService.getTarget();
      
      const payload = {
        summary,
        monthlySales,
        target,
        timestamp: new Date().toISOString()
      };
      
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    } catch (error) {
      console.error("SSE Error:", error);
    }
  };

  // Send initial data immediately
  sendData();

  // Send updates every 3 seconds
  const intervalId = setInterval(sendData, 3000);

  // Cleanup when client disconnects
  req.on("close", () => {
    console.log("Client disconnected from SSE");
    clearInterval(intervalId);
    res.end();
  });
});

/**
 * POST /api/dashboard
 */
router.post("/", (req, res) => {
  DashboardService.updateDashboard(req.body);
  res.json({ message: "Dashboard updated successfully" });
});

export default router;