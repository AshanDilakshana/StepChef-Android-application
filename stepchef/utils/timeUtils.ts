export const formatTime = (dateStr: string | null | Date): string => {
  if (!dateStr) return '--:--';
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDuration = (minutes: number): string => {
  if (!minutes || minutes <= 0) return '0 min';
  if (minutes < 1) return `${Math.round(minutes * 60)} sec`;
  return `${minutes.toFixed(1)} min`;
};

export const minutesToSeconds = (minutes: number): number => Math.round(minutes * 60);