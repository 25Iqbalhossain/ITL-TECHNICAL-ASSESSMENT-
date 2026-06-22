"use client";

import { useState, useEffect, useMemo } from "react";
import styles from "./page.module.css";

interface Employee {
  id: number;
  name: string;
  department: string;
  salary: string | number;
  joining_date: string;
}

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "online" | "offline">("checking");

  // Fetch employees from FastAPI backend
  const fetchEmployees = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
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
      setIsRefreshing(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Compute list of unique departments for the filter dropdown
  const departments = useMemo(() => {
    const depts = new Set<string>();
    employees.forEach((emp) => {
      if (emp.department) depts.add(emp.department);
    });
    return ["All", ...Array.from(depts)];
  }, [employees]);

  // Compute dashboard metrics
  const metrics = useMemo(() => {
    if (employees.length === 0) {
      return { total: 0, avgSalary: "$0.00", deptCount: 0 };
    }

    const total = employees.length;
    const sumSalary = employees.reduce((sum, emp) => sum + Number(emp.salary), 0);
    const avg = sumSalary / total;
    const uniqueDepts = new Set(employees.map((emp) => emp.department)).size;

    return {
      total,
      avgSalary: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(avg),
      deptCount: uniqueDepts,
    };
  }, [employees]);

  // Filter employees based on search query and selected department
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept = selectedDepartment === "All" || emp.department === selectedDepartment;
      
      return matchesSearch && matchesDept;
    });
  }, [employees, searchQuery, selectedDepartment]);

  // Format currency helper
  const formatSalary = (salary: string | number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(salary));
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Use fallback if invalid date
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Department CSS class helper for badges
  const getDeptClass = (dept: string) => {
    const normalized = dept.toLowerCase();
    if (normalized.includes("engineering")) return styles.engineering;
    if (normalized.includes("resources") || normalized.includes("hr")) return styles.hr;
    if (normalized.includes("marketing") || normalized.includes("sales")) return styles.marketing;
    if (normalized.includes("finance") || normalized.includes("admin")) return styles.finance;
    return "";
  };

  return (
    <div className={`${styles.container} animate-fade-in`}>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Employee Directory</h1>
          <p>Real-time corporate roster and analytical database</p>
        </div>
        <div className={styles.actions}>
          <div className={styles.statusBadge}>
            <span 
              className={`${styles.statusIndicator} ${
                connectionStatus === "online" ? styles.online : connectionStatus === "offline" ? styles.offline : ""
              }`}
            />
            {connectionStatus === "online" ? "API Connected" : connectionStatus === "offline" ? "API Disconnected" : "Checking API..."}
          </div>
          <button 
            id="refresh-btn"
            className={styles.btnSecondary}
            onClick={() => fetchEmployees(true)}
            disabled={loading || isRefreshing}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "10px", cursor: "pointer" }}
            title="Refresh Data"
          >
            <svg 
              className={isRefreshing ? styles.spinner : ""} 
              style={{ width: "16px", height: "16px", animation: isRefreshing ? "spin 1s linear infinite" : "none" }}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3" />
            </svg>
            Refresh
          </button>
        </div>
      </header>

      {/* Dashboard Analytics Section */}
      <section className={styles.statsGrid} aria-label="Dashboard Statistics">
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Total Personnel</div>
          <div className={styles.statValue}>
            {loading ? <div className={`${styles.skeletonCell} shimmer`} style={{ width: "80px", height: "36px" }} /> : metrics.total}
          </div>
          <div className={styles.statSubtitle}>Active records in system</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Average Compensation</div>
          <div className={styles.statValue}>
            {loading ? <div className={`${styles.skeletonCell} shimmer`} style={{ width: "150px", height: "36px" }} /> : metrics.avgSalary}
          </div>
          <div className={styles.statSubtitle}>Annual gross calculation</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTitle}>Unique Departments</div>
          <div className={styles.statValue}>
            {loading ? <div className={`${styles.skeletonCell} shimmer`} style={{ width: "60px", height: "36px" }} /> : metrics.deptCount}
          </div>
          <div className={styles.statSubtitle}>Organizational divisions</div>
        </div>
      </section>

      {/* Control Panel (Search & Filter) */}
      <section className={styles.controls} aria-label="Table Controls">
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="search-input"
            type="text"
            placeholder="Search by employee name or department..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading || !!error}
          />
        </div>
        
        <select
          id="dept-filter"
          className={styles.filterSelect}
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          disabled={loading || !!error || departments.length <= 1}
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept === "All" ? "All Departments" : dept}
            </option>
          ))}
        </select>
      </section>

      {/* Content Area */}
      <main className={styles.tableContainer}>
        {loading && !isRefreshing ? (
          /* Initial Loading State */
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Salary</th>
                  <th>Joining Date</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className={styles.skeletonRow}>
                    <td>
                      <div className={`${styles.skeletonCell} shimmer`} style={{ width: "160px" }} />
                    </td>
                    <td>
                      <div className={`${styles.skeletonCell} shimmer`} style={{ width: "120px" }} />
                    </td>
                    <td>
                      <div className={`${styles.skeletonCell} shimmer`} style={{ width: "80px" }} />
                    </td>
                    <td>
                      <div className={`${styles.skeletonCell} shimmer`} style={{ width: "100px" }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.loadingContainer}>
              <div className={styles.spinner} />
              <p>Retrieving directory assets from registry...</p>
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div className={styles.errorCard}>
            <div className={styles.errorIcon}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className={styles.errorTitle}>Database Synchronization Failed</div>
            <p className={styles.errorText}>
              An error occurred while establishing a bridge with the REST API servers. Check if your local database credentials are correct and if your server is running.
            </p>
            <div className={styles.errorDetails}>{error}</div>
            <button 
              id="retry-btn"
              className={styles.btnPrimary} 
              onClick={() => fetchEmployees()}
            >
              Retry Connection
            </button>
          </div>
        ) : filteredEmployees.length === 0 ? (
          /* Empty State (Filter or Search match zero) */
          <div className={styles.emptyCard}>
            <div className={styles.emptyTitle}>No Records Found</div>
            <p>No employees match your search criteria "{searchQuery}" or department filter.</p>
            <button 
              id="clear-btn"
              className={styles.btnSecondary} 
              onClick={() => {
                setSearchQuery("");
                setSelectedDepartment("All");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Success Data Table */
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Salary</th>
                  <th>Joining Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td className={styles.employeeName}>{emp.name}</td>
                    <td>
                      <span className={`${styles.departmentBadge} ${getDeptClass(emp.department)}`}>
                        {emp.department}
                      </span>
                    </td>
                    <td className={styles.salaryText}>{formatSalary(emp.salary)}</td>
                    <td className={styles.dateText}>{formatDate(emp.joining_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
