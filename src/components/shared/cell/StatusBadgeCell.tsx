import { Badge } from "@/components/ui/badge";
import { UserStatus } from "@/types/doctor.types";

interface IStatusBadgeCellProps {
  status: UserStatus;
}

const StatusBadgeCell = ({ status }: IStatusBadgeCellProps) => {
  // Map your statuses to specific Tailwind background colors
  const statusColorMap: Record<UserStatus, string> = {
    [UserStatus.ACTIVE]: "bg-blue-500 hover:bg-blue-600 text-white",
    [UserStatus.BLOCKED]: "bg-red-500 hover:bg-red-600 text-white", // You could also just use variant="destructive" for this
    [UserStatus.DELETED]: "bg-slate-500 hover:bg-slate-600 text-white", // Pick whatever color you want for deleted
  };

  return (
    <Badge 
      // We pass the mapped color directly to the className
      className={statusColorMap[status]}
    >
      <span className="text-sm capitalize">{status.toLowerCase()}</span>
    </Badge>
  );
};

export default StatusBadgeCell;