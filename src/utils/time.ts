export function getYearMonthDay(date = new Date()) {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  }
}

export function getMonthStartDay(date: Date, index = 1) {
  const { year, month } = getYearMonthDay(date)
  const monthStartDay = new Date(year, month, index)
  return monthStartDay
}

export function isCurrentMonthAndDay(year: number, month: number, day: number) {
  const { year: cyear, month: cmonth, day: cday } = getYearMonthDay()
  return {
    isCurrentDay: cyear === year && cmonth === month && cday === day,
    isCurrentMonth: cyear === year && cmonth === month,
  }
}
