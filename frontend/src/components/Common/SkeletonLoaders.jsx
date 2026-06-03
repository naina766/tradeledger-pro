import React from 'react';

export const MetricCardSkeleton = () => {
  return (
    <div className="glass-panel rounded-xl p-6 shadow-premium relative overflow-hidden space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-4 w-24 rounded animate-shimmer"></div>
        <div className="h-8 w-8 rounded-lg animate-shimmer"></div>
      </div>
      <div className="space-y-2">
        <div className="h-8 w-32 rounded animate-shimmer"></div>
        <div className="h-3 w-40 rounded animate-shimmer"></div>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 6 }) => {
  return (
    <div className="glass-panel rounded-xl p-6 shadow-premium relative overflow-hidden space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 rounded animate-shimmer"></div>
        <div className="h-8 w-48 rounded animate-shimmer"></div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="py-3 px-4">
                  <div className="h-4 w-16 rounded animate-shimmer"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-slate-800/50">
                {Array.from({ length: cols }).map((_, colIndex) => (
                  <td key={colIndex} className="py-4 px-4">
                    <div className="h-4 w-20 rounded animate-shimmer"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className="glass-panel rounded-xl p-6 shadow-premium relative overflow-hidden space-y-4">
      <div className="h-5 w-40 rounded animate-shimmer mb-6"></div>
      <div className="h-64 w-full rounded animate-shimmer"></div>
    </div>
  );
};
