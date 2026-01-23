import fs from "fs";
import path from "path";
import { DashboardData } from "../models/common/Dashboard";

const dbPath = path.join(__dirname, "database.json");

// -------------------------------
// Helper functions
// -------------------------------
function readDB(): DashboardData {
  const raw = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(raw);
}

function writeDB(data: DashboardData): void {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// -------------------------------
// AUTO UPDATE LOGIC 
// -------------------------------
function startAutoUpdate() {
  setInterval(() => {
    const data = readDB();

    // Random change for customers
    const customerDelta = Math.floor(Math.random() * 5) - 2; // -2 to +2
    data.summary.customers.count += customerDelta;
    data.summary.customers.changePercent =
      Number((Math.random() * 5 + 5).toFixed(2)); // 5% - 10%

    // Random change for orders
    const orderDelta = Math.floor(Math.random() * 7) - 3; // -3 to +3
    data.summary.orders.count += orderDelta;
    data.summary.orders.changePercent =
      Number((Math.random() * -10).toFixed(2)); // negative %

    writeDB(data);
  }, 3000); // every 3 seconds
}

// Start auto update ONCE
startAutoUpdate();

// REPO CLASS
// -------------------------------
export class DashboardRepo {
  static read(): DashboardData {
    return readDB();
  }

  static write(data: DashboardData): void {
    writeDB(data);
  }
}
