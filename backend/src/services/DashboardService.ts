import { DashboardRepo } from "../repos/DashboardRepo";

export class DashboardService {
  static getSummary() {
    return DashboardRepo.read().summary;
  }

  static getMonthlySales() {
    return DashboardRepo.read().monthlySales;
  }

  static getTarget() {
    return DashboardRepo.read().target;
  }

  static getStatistics(type: "monthly" | "quarterly" | "annually") {
    return DashboardRepo.read().statistics[type];
  }

  static updateDashboard(data: any) {
    DashboardRepo.write(data);
  }
}
