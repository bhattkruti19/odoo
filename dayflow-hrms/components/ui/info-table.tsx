import React from 'react';
import { cn } from '@/lib/utils';

interface InfoTableRow {
  label: string;
  value: string | React.ReactNode;
}

interface InfoTableProps {
  rows: InfoTableRow[];
  className?: string;
}

export function InfoTable({ rows, className }: InfoTableProps) {
  return (
    <div className={cn('divide-y divide-gray-100 dark:divide-gray-800', className)}>
      {rows.map((row, index) => (
        <div
          key={index}
          className="grid grid-cols-3 gap-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-lg px-2"
        >
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {row.label}
          </div>
          <div className="col-span-2 text-sm text-gray-900 dark:text-gray-100">
            {row.value}
          </div>
        </div>
      ))}
    </div>
  );
}
