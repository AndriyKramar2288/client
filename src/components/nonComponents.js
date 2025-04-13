import { toast } from "react-toastify";

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

export function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function isValidPhoneNumber(phone) {
    const regex = /^\+?\d{7,15}$/;
    return regex.test(phone);
}

export function alertSmth(message) {
    toast.error(message, {
        style: {
            background: "#000000",
            color: "#cd812f",
            fontFamily: "var(--font-pt-mono)"
        }
    })
}

export function successSmth(message) {
    toast.success(message, {
        style: {
            background: "#000000",
            color: "#cd812f",
            fontFamily: "var(--font-pt-mono)"
        }
    })
}