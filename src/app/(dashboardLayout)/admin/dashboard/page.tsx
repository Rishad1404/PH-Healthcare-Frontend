import AdminDashboardContent from "@/components/modules/Dashboard/AdminDashboardContent";
import { getDashboardData } from "@/services/dashboard.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function AdminDashboardPage() {
  const queryClient=new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['admin-dashboard-data'],
    queryFn: getDashboardData,
    staleTime:30*1000,
    gcTime:5*60*1000
  })

  // const dashboardData=await queryClient.getQueryData(['admin-dashboard-data']) as ApiResponse<IAdminDashboardData>;
  // console.log("dashboardData",dashboardData);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminDashboardContent/>
    </HydrationBoundary>
  );
}