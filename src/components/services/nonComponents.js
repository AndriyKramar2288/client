import { toast } from "react-toastify";

export const BACKEND_API_URL = "http://localhost:8080/api"
export const GOOGLE_CLIENT_ID = "687579243762-scb4sm0ddqfo9qpl6g17dra648g5jipu.apps.googleusercontent.com"
export const TOKEN_LOCAL_STORAGE = "access_token"

// -- //

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

export function emptyListSplitter(string, splitter) {
    return string.trim() ? string.split(splitter) : []
}

export function logout(setUsr, router) {
    setUsr(null)
    localStorage.removeItem(TOKEN_LOCAL_STORAGE)
    router.push("/")
}

export function isDev() {
    return (process.env.NODE_ENV === 'development')
}