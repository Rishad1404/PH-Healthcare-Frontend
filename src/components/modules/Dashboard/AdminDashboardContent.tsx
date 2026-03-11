/* eslint-disable react/no-unescaped-entities */
"use client";

import AppointmentBarChart from "@/components/shared/AppointmentBarChart";
import AppointmentPieChart from "@/components/shared/AppointmentPieChart";
import StatsCard from "@/components/shared/StatsCard";
import { getDashboardData } from "@/services/dashboard.services";
import { ApiResponse } from "@/types/api.types";
import { IAdminDashboardData } from "@/types/dashboard.types";
import { useQuery } from "@tanstack/react-query";

const AdminDashboardContent = () => {
  const { data: adminDashboardData, isLoading, isError } = useQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: getDashboardData,
    refetchOnWindowFocus: "always",
  });

  // Handle loading and error states gracefully
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500 animate-pulse">Loading dashboard data...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center text-red-500">
        Failed to load dashboard data. Please try again later.
      </div>
    );
  }

  // Safely cast and extract the data payload
  const dashboardStats = (adminDashboardData as ApiResponse<IAdminDashboardData>)?.data;

  return (
    <div className="space-y-8 p-6 bg-gray-50/50 min-h-screen">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor your clinic's key metrics and appointment trends.
        </p>
      </div>

      {/* Stats Cards - CSS Grid for responsive layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Appointments"
          value={dashboardStats?.appointmentCount || 0}
          iconName="CalendarDays" // Calendar icon for scheduling
          description="Total scheduled"
        />
        <StatsCard
          title="Total Patients"
          value={dashboardStats?.patientCount || 0}
          iconName="HeartPulse" // Medical/health icon for patients
          description="Registered patients"
        />
        <StatsCard
          title="Total Doctors"
          value={dashboardStats?.doctorCount || 0}
          iconName="Stethoscope" // Distinct medical icon for doctors
          description="Active practitioners"
        />
        <StatsCard
          title="Total Users"
          value={dashboardStats?.userCount || 0}
          iconName="ShieldCheck" // Security/Admin icon for general system users
          description="System accounts"
        />
      </div>

      {/* Charts Section - 2 column layout on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Make the bar chart take up more space (2/3) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Appointments Overview</h2>
          <AppointmentBarChart data={dashboardStats?.barChartData || []} />
        </div>

        {/* Pie chart takes up the remaining space (1/3) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Distribution</h2>
          <AppointmentPieChart data={dashboardStats?.pieChartData || []} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardContent;