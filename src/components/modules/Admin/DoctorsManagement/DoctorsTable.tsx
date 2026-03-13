/* eslint-disable react-hooks/incompatible-library */
"use client";

import { getDoctors } from "@/services/doctor.services";
import { useQuery } from "@tanstack/react-query";

import { IDoctor } from "@/types/doctor.types";
import DataTable from "@/components/shared/table/DataTable";
import { doctorsColumns } from "./doctorsColumns";

const DoctorsTable = () => {

  const { data: doctorDataResponse,isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
  });

  // console.log(data?.data.map((doctor)=>doctor.name));

  const { data: doctors } = doctorDataResponse! || [];

  const handleView = (doctor: IDoctor) => {
    console.log(doctor);
  };

  const handleEdit = (doctor: IDoctor) => {
    console.log(doctor);
  };

  const handleDelete = (doctor: IDoctor) => {
    console.log(doctor);
  };

  // const { getHeaderGroups, getRowModel } = useReactTable({
  //   data: doctors,
  //   columns: doctorsColumns,
  //   getCoreRowModel: getCoreRowModel(),
  // });

  console.log(doctors);

  // return (
  //   <Table>
  //     <TableHeader>
  //       {getHeaderGroups().map((hg) => (
  //         <TableRow key={hg.id}>
  //           {hg.headers.map((header) => (
  //             <TableHead key={header.id}>
  //               {flexRender(header.column.columnDef.header, header.getContext())}
  //             </TableHead>
  //           ))}
  //         </TableRow>
  //       ))}
  //     </TableHeader>
  //     <TableBody>
  //       {getRowModel().rows.map((row) => (
  //         <TableRow key={row.id}>
  //           {row.getVisibleCells().map((cell) => (
  //             <TableCell key={cell.id}>
  //               {flexRender(cell.column.columnDef.cell, cell.getContext())}
  //             </TableCell>
  //           ))}
  //         </TableRow>
  //       ))}
  //     </TableBody>
  //   </Table>
  // );

  return (
    <DataTable
      data={doctors}
      columns={doctorsColumns}
      isLoading={isLoading}
      emptyMessage="No doctors found"
      actions={
        {
          onView: handleView,
          onEdit: handleEdit,
          onDelete: handleDelete,
        }
      }
    />
  )
};

export default DoctorsTable;
