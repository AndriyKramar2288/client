"use client"

import { useEffect, useState } from "react";
import { alertSmth, BACKEND_API_URL, successSmth, TOKEN_LOCAL_STORAGE } from "../services/nonComponents";

const SESSION_LIST = "Список сеансів"
const SESSIONS_FOR_FILM = "Cеанси для фільму: "
const WARNING_FILM_CHOOSE = "Спершу оберіть фільм на попередній сторінці!"
const BAD_LOADING_SESSIONS_MESSAGE = "Помилка при завантаженні сеансів!"
const FAILED_DELETE_MESSAGE = "Не вдалося видалити сеанс!"
const BAD_CREATING_SESSION = "Не вдалося створити сеанс!"
const SUCCESS_DELETE_SESSION_MESSAGE = "Сеанс був успішно видалений!"
const SUCCESS_CREATE_SESSION = "Сеанс був успішно створений!"

const token = localStorage.getItem(TOKEN_LOCAL_STORAGE);

function SessionList({ sessions, setSessions }) {
    async function deleteSession(id) {
        try {
            const res = await fetch(`${BACKEND_API_URL}/films/session/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.status === 204) {
                setSessions(prev => prev.filter(s => s.id !== id));
                successSmth(SUCCESS_DELETE_SESSION_MESSAGE)
            } else {
                throw new Error(FAILED_DELETE_MESSAGE);
            }
        } catch (err) {
            alertSmth(err.message)
        }
    }

    return (
        <div className="w-full max-w-2xl">
            <h2 className="text-lg font-semibold mb-2">{SESSION_LIST}</h2>
            <ul className="space-y-2">
            <hr className="my-4 border-amber-800" />
                {sessions.map(session => (
                    <li
                        key={session.id}
                        className="flex justify-between items-center bg-[#3d2a1f94] p-3 rounded"
                    >
                        <div>
                            <p><b>Дата:</b> {session.date.replace("T", " ").slice(0, 16)}</p>
                            <p><b>Формат:</b> {session.format}</p>
                            <p><b>Ціна:</b> {session.price_per_sit} грн</p>
                            <p><b>Зала:</b> {session.hall_data.name}</p>
                        </div>
                        <button
                            onClick={() => deleteSession(session.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function AddSessionSection({ newSession, setNewSession, currentHalls, createSession }) {
    return (
        <div className="w-full max-w-md mb-6 bg-[#3e2c2086] p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-2">Додати новий сеанс</h2>

            <label className="block mb-1">Дата та час:</label>
            <input
                type="datetime-local"
                className="w-full rounded px-2 py-1 mb-3 outline-none bg-[#98684670] focus:bg-[#553e2d70]"
                value={newSession.date}
                onChange={e => setNewSession({ ...newSession, date: e.target.value })}
            />

            <label className="block mb-1">Формат (2D / 3D / ...):</label>
            <input
                type="text"
                className="w-full rounded px-2 py-1 mb-3 outline-none bg-[#98684670] focus:bg-[#553e2d70]"
                value={newSession.format}
                onChange={e => setNewSession({ ...newSession, format: e.target.value })}
            />

            <label className="block mb-1">Ціна за місце:</label>
            <input
                type="number"
                min={5}
                className="w-fullrounded px-2 py-1 mb-3 outline-none bg-[#98684670] focus:bg-[#553e2d70]"
                value={newSession.price_per_sit}
                onChange={e => setNewSession({ ...newSession, price_per_sit: e.target.value })}
            />

            <label className="block mb-1">Зала:</label>
            <select
                className="w-full rounded px-2 py-1 mb-3 outline-none bg-[#98684670] focus:bg-[#553e2d70]"
                value={newSession.hall_id}
                onChange={e => setNewSession({ ...newSession, hall_id: e.target.value })}
            >
                <option value="">Оберіть залу</option>
                {currentHalls.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                ))}
            </select>

            <button
                onClick={createSession}
                className="bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded w-full"
            >
                Додати сеанс
            </button>
        </div>
    )
}

export default function SessionControl({ creationSessionFilm, currentHalls }) {
    const [sessions, setSessions] = useState([]);
    const [newSession, setNewSession] = useState({
        date: "",
        format: "",
        price_per_sit: "",
        hall_id: ""
    });

    useEffect(() => {
        if (creationSessionFilm) {
            fetchSessions();
        }
    }, [creationSessionFilm]);

    async function fetchSessions() {
        try {
            const response = await fetch(`${BACKEND_API_URL}/films/session/${creationSessionFilm.id}`);
            const data = await response.json();
            setSessions(data);
        } catch (err) {
            alertSmth(BAD_LOADING_SESSIONS_MESSAGE);
        }
    }

    async function createSession() {
        try {
            const payload = {
                ...newSession,
                film_id: creationSessionFilm.id,
                price_per_sit: parseInt(newSession.price_per_sit),
                hall_id: parseInt(newSession.hall_id)
            };

            const res = await fetch(`${BACKEND_API_URL}/films/session/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error(await res.text());

            const created = await res.json();
            setSessions(prev => [...prev, created]);
            setNewSession({ date: "", format: "", price_per_sit: "", hall_id: "" });
            successSmth(SUCCESS_CREATE_SESSION)
        } catch (err) {
            alertSmth(BAD_CREATING_SESSION);
        }
    }

    if (!creationSessionFilm) {
        return (
            <section>
                <h1 className="text-white font-bold p-8 rounded-md text-center">
                    {WARNING_FILM_CHOOSE.toUpperCase()}
                </h1>
            </section>
        );
    }

    return (
        <section className="flex flex-col items-center p-8 rounded-md text-white">
            <AddSessionSection newSession={newSession} setNewSession={setNewSession} currentHalls={currentHalls} createSession={createSession} />
            {sessions.length > 0 && <SessionList sessions={sessions} setSessions={setSessions} />}
        </section>
    );
}