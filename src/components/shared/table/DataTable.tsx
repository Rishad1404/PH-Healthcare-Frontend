import { ColumnDef } from "@tanstack/react-table";

interface DataTableActions<TData> {
    onView: (data: TData) => void;  
    onEdit: (data: TData) => void;
    onDelete: (data: TData) => void;
}

interface DataTableProps<TData> {
    data: TData[];
    columns:ColumnDef<TData>[];
    actions?:DataTableActions<TData>;
    emptyMessage?: string;
    isLoading?: boolean;
}

const DataTable = <TData,>({data,columns,actions,emptyMessage,isLoading}: DataTableProps<TData>) => {
  return (
    <div>
      <h1>This is DataTable page</h1>
    </div>
  );
};

export default DataTable;