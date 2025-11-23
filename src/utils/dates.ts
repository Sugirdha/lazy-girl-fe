// TODO: consider user's preferred first day of week
// This method currently assumes Sunday as the first day of the week
export function getCurrentWeekStartISO(): string {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToSunday = now.getDate() - dayOfWeek;
    const sunday = new Date(now.setDate(diffToSunday));
    sunday.setHours(0, 0, 0, 0);
    return sunday.toISOString().split('T')[0];
}