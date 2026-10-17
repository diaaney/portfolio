const activityDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Tijuana",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function activityDateKey(date: Date) {
  const parts = Object.fromEntries(
    activityDateFormatter.formatToParts(date).map(({ type, value }) => [type, value]),
  );

  return `${parts.year}-${parts.month}-${parts.day}`;
}
