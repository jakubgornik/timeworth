import { Table } from "@tanstack/react-table";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PageSizeSelectorProps<TData> {
  table: Table<TData>;
  pageSizeOptions: number[];
  isLoading?: boolean;
}

export default function PageSizeSelector<TData>({
  table,
  pageSizeOptions,
  isLoading = false,
}: PageSizeSelectorProps<TData>) {
  const pageSize = table.getState().pagination.pageSize;

  return (
    <div className="flex items-center space-x-2">
      <Label>Items per page:</Label>
      <Select
        value={pageSize.toString()}
        onValueChange={(value) => table.setPageSize(Number(value))}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[65px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {pageSizeOptions.map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
