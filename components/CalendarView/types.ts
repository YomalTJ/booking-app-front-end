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
}

export interface TimeSlotsProps {
    onClose: () => void;
}

export interface AvailableOfficesProps {
    selectedDate: number | null;
    onClose: () => void;
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