export function parseDate(date: string): Date {
  if (!date) return new Date("Invalid Date");

  // 1. If it contains a slash, parse it using your original DD/MM/YYYY logic
  if (date.includes("/")) {
    const [day, month, year] = date.split("/").map(Number);
    return new Date(year, month - 1, day);
  }

  // 2. Otherwise, let JavaScript handle the ISO string natively
  const nativeDate = new Date(date);

  // Return the native date if valid, otherwise fallback to an Invalid Date object
  return isNaN(nativeDate.getTime()) ? new Date("Invalid Date") : nativeDate;
}

export function calculateAge(dateOfBirth: string): number {
  const dob = parseDate(dateOfBirth);

  // Guard clause: If the date is invalid, return NaN instead of breaking the app
  if (isNaN(dob.getTime())) return NaN;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}
