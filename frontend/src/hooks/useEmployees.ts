import { useState, useEffect, useMemo, useCallback } from "react";
import type { Employee, DashboardMetrics } from "../types/employee";

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "online" | "offline">("checking");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
      const res = await fetch(`${apiUrl}/employees`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 404) {
          setEmployees([]);
          throw new Error("No employee records found in the database.");
        }
        throw new Error(`API error: Server returned status code ${res.status}`);
      }

      const data = await res.json();
      setEmployees(data);
      setConnectionStatus("online");
    } catch (err: any) {
      console.error("Error fetching employees:", err);
      setError(err.message || "Failed to connect to the backend server. Make sure the FastAPI server is running.");
      setConnectionStatus("offline");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Compute list of unique departments
  const departments = useMemo(() => {
    const depts = new Set<string>();
    employees.forEach((emp) => {
      if (emp.department) depts.add(emp.department);
    });
    return ["All", ...Array.from(depts)];
  }, [employees]);

  // Compute metrics
  const metrics: DashboardMetrics = useMemo(() => {
    if (employees.length === 0) {
      return { total: 0, avgSalary: "৳0.00", deptCount: 0 };
    }

    const total = employees.length;
    const sumSalary = employees.reduce((sum, emp) => sum + Number(emp.salary), 0);
    const avg = sumSalary / total;
    const uniqueDepts = new Set(employees.map((emp) => emp.department)).size;

    return {
      total,
      avgSalary: "৳" + new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0,
      }).format(avg),
      deptCount: uniqueDepts,
    };
  }, [employees]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept = selectedDepartment === "All" || emp.department === selectedDepartment;
      
      return matchesSearch && matchesDept;
    });
  }, [employees, searchQuery, selectedDepartment]);

  return {
    employees,
    filteredEmployees,
    loading,
    error,
    connectionStatus,
    fetchEmployees,
    searchQuery,
    setSearchQuery,
    selectedDepartment,
    setSelectedDepartment,
    departments,
    metrics,
  };
};
