// TODO: consider user's preferred first day of week
// This method currently assumes Sunday as the first day of the week
export function getCurrentWeekStartISO(date: Date): string {
    // const now = new Date();
    const dayOfWeek = date.getDay();
    const diffToSunday = date.getDate() - dayOfWeek;
    const sunday = new Date(date.setDate(diffToSunday));
    sunday.setHours(0, 0, 0, 0);
    return sunday.toISOString().split('T')[0];
}