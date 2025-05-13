export const generateCalendarDays = (month: string, year: number) => {
  const monthNames = [
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

  const monthIndex = monthNames.indexOf(month);
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

  const prevMonth = monthIndex === 0 ? 11 : monthIndex - 1;
  const prevMonthYear = monthIndex === 0 ? year - 1 : year;
  const lastDayOfPrevMonth = new Date(prevMonthYear, monthIndex, 0);

  // Get current date for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const prevMonthDays = [];
  const currentMonthDays = [];
  const nextMonthDays = [];

  // Fill previous month days
  const startingDayOfWeek = firstDayOfMonth.getDay() || 7; // Adjust for Monday start
  for (let i = 1; i < startingDayOfWeek; i++) {
    const dayOfMonth = lastDayOfPrevMonth.getDate() - startingDayOfWeek + i + 1;
    const date = new Date(prevMonthYear, prevMonth, dayOfMonth);

    prevMonthDays.push({
      day: dayOfMonth,
      month: monthNames[prevMonth],
      isCurrentMonth: false,
      isPastDate: date < today,
      isToday: false,
    });
  }

  // Fill current month days
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const date = new Date(year, monthIndex, day);

    currentMonthDays.push({
      day,
      month: month,
      isCurrentMonth: true,
      isPastDate: date < today,
      isToday:
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear(),
    });
  }

  // Fill next month days to complete the grid
  const totalDays = prevMonthDays.length + currentMonthDays.length;
  const remainingDays = 42 - totalDays; // 6 rows * 7 days

  const nextMonth = monthIndex === 11 ? 0 : monthIndex + 1;
  const nextMonthYear = monthIndex === 11 ? year + 1 : year;

  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(nextMonthYear, nextMonth, day);

    nextMonthDays.push({
      day,
      month: monthNames[nextMonth],
      isCurrentMonth: false,
      isPastDate: date < today,
      isToday: false,
    });
  }

  return { prevMonthDays, currentMonthDays, nextMonthDays };
};
