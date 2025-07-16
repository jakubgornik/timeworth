import { Button } from "../ui/button";

interface PageNumbersProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function PageNumbers({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PageNumbersProps) {
  const getVisiblePages = () => {
    const maxVisible = 5;
    const pages: number[] = [];

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center space-x-1">
      {visiblePages.map((pageNumber) => (
        <Button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          disabled={isLoading}
          variant="secondary"
          size="sm"
          className={`${
            currentPage === pageNumber
              ? "bg-secondary text-primary border"
              : "text-secondary bg-background border"
          }`}
        >
          {pageNumber}
        </Button>
      ))}
    </div>
  );
}
