"use client";

import React from "react";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const badgeClasses =
    status === "Accepted"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-yellow-100 text-yellow-700 border-yellow-200";

  return (
    <span className={`px-4 py-1 rounded-full text-sm border ${badgeClasses}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
