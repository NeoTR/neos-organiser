import dayjs from "dayjs";

export const generateDate = (
  month = dayjs().month(),

  year = dayjs().year()
) => {
  const firstDateOfMonth = dayjs().month(month).year(year).startOf("month");

  const lastDateOfMonth = dayjs().month(month).year(year).endOf("month");

  const arrayOfDate = [];

  for (let i = 0; i < firstDateOfMonth.day(); i++) {
    arrayOfDate.push({ currentMonth: false, date: firstDateOfMonth.day(i) });
  }

  for (let i = firstDateOfMonth.date(); i <= lastDateOfMonth.date(); i++) {
    arrayOfDate.push({ today: firstDateOfMonth.date(i).toDate().toDateString() === dayjs().toDate().toDateString(), currentMonth: true, date: firstDateOfMonth.date(i) });
  }

  const remaining = 42 - arrayOfDate.length;

  for (let i = lastDateOfMonth.date() + 1; i <= lastDateOfMonth.date() + remaining; i++) {
    arrayOfDate.push({ cureentMonth: true, date: lastDateOfMonth.date(i) });
  }

  return arrayOfDate;
};
