export interface CalendarHeaderProps {
  currentMonth: string;
  currentYear: number;
  onNextMonth: () => void;
}

export interface CalendarGridProps {
  currentMonth: string;
  currentYear: number;
  selectedDate: number | null;
  onDateClick: (day: number) => void;
  selectedRoomId?: string;
}

export interface TimeSlotsProps {
  onClose: () => void;
  selectedDate: number | null;
  selectedRoomId?: string;
  onTimeSlotConfirm: (data: {
    startTime: string;
    endTime: string;
    isFullDay: boolean;
  }) => void;
}

export interface AvailableOfficesProps {
  selectedDate: string | null; // Changed to string (YYYY-MM-DD format)
  onClose: () => void;
  bookingData?: {
    startTime: string;
    endTime: string;
    isFullDay: boolean;
  };
}

export interface CustomTimeModalProps {
  onClose: () => void;
  onConfirm: (inTime: string, outTime: string) => void;
}

export interface Office {
  id: number;
  name: string;
  capacity: number;
  floor: number;
}
