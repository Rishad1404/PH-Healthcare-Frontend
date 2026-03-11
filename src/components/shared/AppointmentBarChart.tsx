/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // Required for Recharts in Next.js App Router

import { BarChartData } from "@/types/dashboard.types";
import { format } from "date-fns";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface AppointmentBarChartProps {
  data: BarChartData[];
}

// Custom Tooltip for a premium, glassy look
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl ring-1 ring-slate-900/5">
        <p className="text-sm font-semibold text-slate-800 mb-1">{label}</p>
        <div className="flex items-center gap-2">
          {/* Legend dot */}
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
          <p className="text-sm text-slate-600">
            Appointments: <span className="font-semibold text-slate-900">{payload[0].value}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const AppointmentBarChart = ({ data }: AppointmentBarChartProps) => {
  // 1. Handle Invalid Data State
  if (!data || !Array.isArray(data)) {
    return (
      <Card className="h-full border-none shadow-none bg-transparent">
        <CardContent className="flex flex-col items-center justify-center min-h-87.5 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
            <span className="text-slate-400 text-xl">!</span>
          </div>
          <p className="text-sm font-medium text-slate-900">Invalid data provided</p>
          <p className="text-sm text-slate-500 mt-1">Unable to generate the chart.</p>
        </CardContent>
      </Card>
    );
  }

  // 2. Format Data Safely
  const formattedData = data.map((item) => {
    // Safely parse the date, falling back to a raw string if format fails
    let monthLabel = "";
    try {
      const dateObj = typeof item.month === "string" ? new Date(item.month) : item.month;
      monthLabel = format(dateObj, "MMM yyyy");
    } catch (error) {
      monthLabel = String(item.month);
    }

    return {
      month: monthLabel,
      appointments: Number(item.count) || 0,
    };
  });

  // 3. Handle Empty Data State
  if (!formattedData.length || formattedData.every(item => item.appointments === 0)) {
    return (
      <Card className="h-full border-none shadow-none bg-transparent">
        <CardContent className="flex flex-col items-center justify-center min-h-87.5 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-900">No appointments yet</p>
          <p className="text-sm text-slate-500 mt-1">Data will appear here once appointments are booked.</p>
        </CardContent>
      </Card>
    );
  }

  // 4. Render the Professional Chart
  return (
    // Note: Removed col-span-4, let the parent grid handle sizing. 
    // Added h-full and removed borders/shadows if the parent already has a card wrapper.
    <Card className="w-full h-full border-0 shadow-none bg-transparent">
      {/* Optional: If your parent component already has a title, you can remove this CardHeader entirely */}
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg font-semibold text-slate-800">Appointment Trends</CardTitle>
        <CardDescription className="text-slate-500">Monthly Appointment Statistics</CardDescription>
      </CardHeader>
      
      <CardContent className="px-0 pb-0">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={formattedData} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            {/* Subtle horizontal grid lines only */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            
            <XAxis 
              dataKey="month" 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
              dy={10} // Adds a little padding below the axis
            />
            
            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              dx={-10} // Adds a little padding to the left
            />
            
            {/* Inject our beautiful custom tooltip */}
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: '#f8fafc' }} // Subtle background highlight on hover
            />
            
            {/* Legend removed for cleaner look if there's only one metric, 
                but you can add it back if you plan to compare multiple datasets */}
            
            <Bar
              dataKey="appointments"
              fill="#2563eb" // A professional, trustworthy blue (Tailwind blue-600)
              radius={[6, 6, 0, 0]} // Softer, modern rounded top corners
              maxBarSize={48} // Slightly thinner bars look more elegant
              animationDuration={1500} // Smooth entry animation
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AppointmentBarChart;