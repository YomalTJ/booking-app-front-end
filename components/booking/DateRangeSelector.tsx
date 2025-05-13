"use client";

import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import DateInput from "./DateInput";

interface DateRangeSelectorProps {
  startDate: string;
  endDate: string;
  setStartDate: (value: string) => void;
  setEndDate: (value: string) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* Start Date */}
      <DateInput label="Start Date" value={startDate} onChange={setStartDate} />

      {/* End Date */}
      <DateInput label="End Date" value={endDate} onChange={setEndDate} />
    </div>
  );
};

export default DateRangeSelector;
