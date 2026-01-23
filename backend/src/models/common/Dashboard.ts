export interface DashboardData {
  summary: {
    customers: {
      count: number;
      changePercent: number;
    };
    orders: {
      count: number;
      changePercent: number;
    };
  };
  monthlySales: {
    month: string;
    value: number;
  }[];
  target: {
    targetPercent: number;
    todayRevenue: number;
    comparison: string;
  };
  statistics: {
    monthly: number[];
    quarterly: number[];
    annually: number[];
  };
}
export interface Dashboard {
  getDashboardData(): Promise<DashboardData>;
}