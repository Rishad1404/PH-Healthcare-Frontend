/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getDoctors } from "@/app/(commonLayout)/consultation/_actions";
import { useQuery } from "@tanstack/react-query";

const DoctorsList = () => {
  const { data } = useQuery({
    queryKey: ['doctors'],
    queryFn: ()=>getDoctors(),
  })
  return (
    <div>
      <h1>{data?.data.map((doc: any) => 
        <div key={doc.id}>{doc.name}</div>
    )}</h1>
    </div>
  );
};

export default DoctorsList;
