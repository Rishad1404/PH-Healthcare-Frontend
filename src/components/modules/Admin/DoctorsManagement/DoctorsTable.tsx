"use client";

import DataTable from "@/components/shared/table/DataTable";
import { getDoctors } from "@/services/doctor.services";
import { IDoctor } from "@/types/doctor.types";
import { useQuery } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { doctorsColumns } from "./doctorsColumns";

const DoctorsTable = ({ initialQueryString }: { initialQueryString: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const queryString = searchParams.toString() || initialQueryString;

  const sortingStateFromUrl = useMemo<SortingState>(() => {
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");

    if (!sortBy || (sortOrder !== "asc" && sortOrder !== "desc")) {
      return [];
    }

    return [{ id: sortBy, desc: sortOrder === "desc" }];
  }, [searchParams]);

  const [optimisticSortingState, setOptimisticSortingState] = useState<SortingState>(sortingStateFromUrl);

  const { data: doctorDataResponse, isLoading } = useQuery({
    queryKey: ["doctors", queryString],
    queryFn: () => getDoctors(queryString),
  });

  const doctors = doctorDataResponse?.data ?? [];

  const handleSortingChange = useCallback((state: SortingState) => {
    setOptimisticSortingState(state); // update arrow immediately

    const params = new URLSearchParams(window.location.search);

    if (state[0]) {
      params.set("sortBy", state[0].id);
      params.set("sortOrder", state[0].desc ? "desc" : "asc");
    } else {
      params.delete("sortBy");
      params.delete("sortOrder");
    }

    window.history.pushState(null, "", `${pathname}?${params.toString()}`); // URL updates immediately

    startTransition(() => {
      router.refresh(); // triggers server re-fetch, isPending = true during this
    });
  }, [pathname, router]);

  const handleView = (doctor: IDoctor) => console.log(doctor);
  const handleEdit = (doctor: IDoctor) => console.log(doctor);
  const handleDelete = (doctor: IDoctor) => console.log(doctor);

  return (
    <DataTable
      data={doctors}
      columns={doctorsColumns}
      isLoading={isLoading || isPending} // overlay shows while server re-fetches
      emptyMessage="No doctors found."
      sorting={{
        state: optimisticSortingState,
        onSortingChange: handleSortingChange,
      }}
      actions={{
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
      }}
    />
  );
};

export default DoctorsTable;