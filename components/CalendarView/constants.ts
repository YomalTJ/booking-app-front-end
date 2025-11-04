import { Office } from "./types";

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const WEEK_DAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

export const TIME_SLOTS = [
  "8:00 am - 10:00 am",
  "10:00 am - 12:00 pm",
  "12:00 pm - 2:00 pm",
  "2:00 pm - 4:00 pm",
  "4:00 pm - 6:00 pm",
];

export const AVAILABILITY_STATUS: Record<number, string> = {
  3: "available",
  4: "available",
  5: "booked",
  6: "booked",
  7: "booked",
  8: "available",
  9: "available",
  10: "available",
  11: "partially",
  12: "available",
  13: "available",
  14: "available",
  15: "available",
  16: "available",
  17: "available",
  18: "available",
  19: "available",
  20: "available",
  21: "available",
  22: "available",
  23: "available",
  24: "available",
  25: "available",
  26: "available",
  27: "available",
  28: "available",
  29: "available",
  30: "available",
};

export const MOCK_OFFICES: Office[] = [
  { id: 1, name: "Conference Room A", capacity: 10, floor: 2 },
  { id: 2, name: "Meeting Room B", capacity: 6, floor: 3 },
  { id: 3, name: "Board Room", capacity: 20, floor: 4 },
  { id: 4, name: "Collaboration Space", capacity: 8, floor: 2 },
];
