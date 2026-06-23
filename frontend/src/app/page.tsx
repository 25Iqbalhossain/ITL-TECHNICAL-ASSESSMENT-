"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { useEmployees } from "../hooks/useEmployees";
import { formatSalary, formatDate } from "../utils/formatters";
import type { Employee, DashboardMetrics } from "../types/employee";

export default function Home() {
  const {
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
  } = useEmployees();

  return (
    <div className={`${styles.container} animate-fade-in`}>
      <Header
        connectionStatus={connectionStatus}
      />

      <StatsGrid metrics={metrics} loading={loading} />

      <Controls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        departments={departments}
        loading={loading}
        hasError={!!error}
      />

      <main className={styles.tableContainer}>
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} onRetry={() => fetchEmployees()} />
        ) : filteredEmployees.length === 0 ? (
          <EmptyState
            searchQuery={searchQuery}
            onReset={() => {
              setSearchQuery("");
              setSelectedDepartment("All");
            }}
          />
        ) : (
          <EmployeeTable employees={filteredEmployees} />
        )}
      </main>
    </div>
  );
}

// --- Sub-components ---

function Header({ connectionStatus }: { connectionStatus: string }) {
  return (
    <header className={styles.header}>
      <div className={styles.titleSection}>
        <h1>Employee Directory</h1>
        <p>Real-time corporate roster and analytical database</p>
      </div>
      <div className={styles.actions}>
        <div className={styles.statusBadge}>
          <span
            className={`${styles.statusIndicator} ${
              connectionStatus === "online"
                ? styles.online
                : connectionStatus === "offline"
                ? styles.offline
                : ""
            }`}
          />
          {connectionStatus === "online"
            ? "API Connected"
            : connectionStatus === "offline"
            ? "API Disconnected"
            : "Checking API..."}
        </div>
      </div>
    </header>
  );
}

function StatsGrid({ metrics, loading }: { metrics: DashboardMetrics; loading: boolean }) {
  return (
    <section className={styles.statsGrid} aria-label="Dashboard Statistics">
      <StatCard title="Total Personnel" subtitle="Active records in system">
        {loading ? <Skeleton width="80px" height="36px" /> : metrics.total}
      </StatCard>
      <StatCard title="Average Compensation" subtitle="Annual gross calculation">
        {loading ? <Skeleton width="150px" height="36px" /> : metrics.avgSalary}
      </StatCard>
      <StatCard title="Unique Departments" subtitle="Organizational divisions">
        {loading ? <Skeleton width="60px" height="36px" /> : metrics.deptCount}
      </StatCard>
    </section>
  );
}

function StatCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statTitle}>{title}</div>
      <div className={styles.statValue}>{children}</div>
      <div className={styles.statSubtitle}>{subtitle}</div>
    </div>
  );
}

function Controls({
  searchQuery,
  setSearchQuery,
  selectedDepartment,
  setSelectedDepartment,
  departments,
  loading,
  hasError,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  departments: string[];
  loading: boolean;
  hasError: boolean;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(`.${styles.customSelectContainer}`)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const disabled = loading || hasError;

  return (
    <section className={styles.controls} aria-label="Table Controls">
      <div className={styles.searchWrapper}>
        <svg
          className={styles.searchIcon}
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          id="search-input"
          type="text"
          placeholder="Search by employee name or department..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className={styles.customSelectContainer}>
        <button
          id="dept-filter"
          className={`${styles.filterSelect} ${isDropdownOpen ? styles.open : ""}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={disabled || departments.length <= 1}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
        >
          {selectedDepartment === "All" ? "All Departments" : selectedDepartment}
          <svg
            className={styles.dropdownIcon}
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isDropdownOpen && (
          <ul className={styles.dropdownMenu} role="listbox">
            {departments.map((dept) => (
              <li
                key={dept}
                role="option"
                aria-selected={selectedDepartment === dept}
                className={`${styles.dropdownOption} ${
                  selectedDepartment === dept ? styles.selected : ""
                }`}
                onClick={() => {
                  setSelectedDepartment(dept);
                  setIsDropdownOpen(false);
                }}
              >
                {dept === "All" ? "All Departments" : dept}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function EmployeeTable({ employees }: { employees: Employee[] }) {
  return (
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
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td className={styles.employeeName}>{emp.name}</td>
              <td>
                <span>{emp.department}</span>
              </td>
              <td className={styles.salaryText}>{formatSalary(emp.salary)}</td>
              <td className={styles.dateText}>{formatDate(emp.joining_date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LoadingState() {
  return (
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
              <td><Skeleton width="160px" /></td>
              <td><Skeleton width="120px" /></td>
              <td><Skeleton width="80px" /></td>
              <td><Skeleton width="100px" /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Retrieving directory assets from registry...</p>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className={styles.errorCard}>
      <div className={styles.errorIcon}>
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div className={styles.errorTitle}>Database Synchronization Failed</div>
      <p className={styles.errorText}>
        An error occurred while establishing a bridge with the REST API servers. Check if your local
        database credentials are correct and if your server is running.
      </p>
      <div className={styles.errorDetails}>{error}</div>
      <button id="retry-btn" className={styles.btnPrimary} onClick={onRetry}>
        Retry Connection
      </button>
    </div>
  );
}

function EmptyState({ searchQuery, onReset }: { searchQuery: string; onReset: () => void }) {
  return (
    <div className={styles.emptyCard}>
      <div className={styles.emptyTitle}>No Records Found</div>
      <p>No employees match your search criteria "{searchQuery}" or department filter.</p>
      <button id="clear-btn" className={styles.btnSecondary} onClick={onReset}>
        Reset Filters
      </button>
    </div>
  );
}

function Skeleton({ width, height = "18px" }: { width: string; height?: string }) {
  return <div className={`${styles.skeletonCell} shimmer`} style={{ width, height }} />;
}
