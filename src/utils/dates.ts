/**
 * Returns the date in YYYY-MM-DD format in local timezone
 * @param date The date to format
 * @returns String in YYYY-MM-DD format
 */
export function getCurrentWeekStartISO(date: Date): string {
    // Get local date parts to handle timezone correctly
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}