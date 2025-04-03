import { format, differenceInSeconds } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const dateUtils = {
  // Format date to "qua., 2 de abr. de 2025"
  formatDate(date) {
    return format(date, "eee'., 'd' de 'MMM'.' yyyy", {
      locale: ptBR,
    }).toLowerCase();
  },

  // Format time in seconds to HH:MM:SS
  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const pad = (num) => String(num).padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
  },

  // Calculate elapsed time between two dates in seconds
  getElapsedTime(startDate, endDate = new Date()) {
    return differenceInSeconds(endDate, startDate);
  },

  // Get current time in HH:MM format
  getCurrentTime() {
    return format(new Date(), 'HH:mm');
  },

  // Check if a date is today
  isToday(date) {
    const today = new Date();
    return format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  },

  // Parse ISO string to Date object
  parseDate(dateString) {
    return new Date(dateString);
  },

  // Format date to ISO string
  toISOString(date) {
    return date.toISOString();
  }
};

export default dateUtils;