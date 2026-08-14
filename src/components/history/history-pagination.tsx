"use client";

import { Button } from "@/components/ui/button";

interface HistoryPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function HistoryPagination({ page, totalPages, onPageChange }: HistoryPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        ‹
      </Button>
      {Array.from({ length: totalPages }, (_, index) => index).map((pageIndex) => (
        <Button
          key={pageIndex}
          variant={pageIndex === page ? "default" : "ghost"}
          size="sm"
          onClick={() => onPageChange(pageIndex)}
        >
          {pageIndex + 1}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="sm"
        disabled={page === totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        ›
      </Button>
    </div>
  );
}
