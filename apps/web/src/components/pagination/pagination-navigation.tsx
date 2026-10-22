import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import PageNumbers from "./page-numbers";

interface PaginationNavigationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function PaginationNavigation({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationNavigationProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isLoading}
        variant="secondary"
        size="sm"
      >
        <ChevronLeft size={16} />
        <span>Previous</span>
      </Button>

      <PageNumbers
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isLoading={isLoading}
      />

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isLoading}
        variant="secondary"
        size="sm"
        className="flex items-center"
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
