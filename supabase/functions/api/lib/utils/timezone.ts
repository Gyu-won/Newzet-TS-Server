export function convertToSeoulTime(date: Date): Date {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const kstOffset = 32400000; // 9 * 60 * 60 * 1000
  return new Date(utc + kstOffset);
}
