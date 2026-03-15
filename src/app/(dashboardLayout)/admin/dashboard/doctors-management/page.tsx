
import DoctorsTable from "@/components/modules/Admin/DoctorsManagement/DoctorsTable";
import { getDoctors } from "@/services/doctor.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function DoctorsManagement({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queryParamsObjects = await searchParams;

  const queryString = Object.keys(queryParamsObjects)
    .map((key) => {
      const value = queryParamsObjects[key];
      if (Array.isArray(value)) {
        return value.map((item) => `${key}=${item}`).join("&");
      }
      return `${key}=${value}`;
    })
    .join("&");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    // queryParamsObjects now includes sortBy/sortOrder automatically
    // since they come from searchParams — no extra work needed
    queryKey: ["doctors", queryParamsObjects],
    queryFn: () => getDoctors(queryString),
    staleTime: 60 * 60 * 1000,
    gcTime: 6 * 60 * 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorsTable initialQueryString={queryString} />
    </HydrationBoundary>
  );
}