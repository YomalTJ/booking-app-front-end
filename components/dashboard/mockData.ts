import { Booking } from "./types";

// Sample booking data
export const mockBookings: Booking[] = [
  {
    id: 1,
    package: "Package 01",
    status: "Accepted",
    startDate: "07/05/2025",
    endDate: "10/05/2025",
    price: "LKR 150000.00",
    fullName: "Shehara Thrimavithana",
    company: "Era Biz",
    telephone: "0767199756",
    email: "thrima.work@gmail.com",
    address: "Manampita, Meetiyagoda.",
  },
  {
    id: 2,
    package: "Package 02",
    status: "Pending",
    startDate: "07/05/2025",
    endDate: "31/05/2025",
    price: "LKR 500000.00",
    fullName: "Shehara Thrimavithana",
    company: "Era Biz",
    telephone: "0767199756",
    email: "thrima.work@gmail.com",
    address: "Manampita, Meetiyagoda.",
  },
];
