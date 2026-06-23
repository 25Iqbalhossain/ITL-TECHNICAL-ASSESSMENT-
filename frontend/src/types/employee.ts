export interface Employee {
  id: number;
  name: string;
  department: string;
  salary: string | number;
  joining_date: string;
}

export interface DashboardMetrics {
  total: number;
  avgSalary: string;
  deptCount: number;
}
