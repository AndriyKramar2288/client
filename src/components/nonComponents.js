export function formatUkrainianDate(isoString) {
    const date = new Date(isoString);
  
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
    };
  
    const formatter = new Intl.DateTimeFormat('uk-UA', options);
    const formatted = formatter.format(date); // "10 квітня 2025 р. о 14:30"
  
    // Розбиваємо, щоб переставити частини
    const [datePart, timePart] = formatted.split(' о ');
    return [timePart + ", ", datePart.replace(' р.', '')];
  }

export function range(start, end, step = 1) {
    const result = [];
    for (let i = start; i < end; i += step) {
        result.push(i);
    }
    return result;
}