"use client"

import { useEffect, useState } from "react";
import { alertSmth, BACKEND_API_URL, successSmth, TOKEN_LOCAL_STORAGE } from "../services/nonComponents";

const GOOD_CREATE = "Зала була успішно створена!"
const NEW_HALL = "Нова зала:"
const SUCCESS_DELETE = "Зала була успішно видалена!"
const BAD_DELETE = "Не вдалося видалити залу :("

export default function HallControl({ currentHalls, setCurrentHalls }) {
    const [newHallName, setNewHallName] = useState("");
    const [newHallSize, setNewHallSize] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem(TOKEN_LOCAL_STORAGE);

    async function createHall() {
        if (!newHallName.trim()) return alert("Назва зали не може бути порожньою")

        try {
            setLoading(true);
            const response = await fetch(`${BACKEND_API_URL}/hall/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name: newHallName, size: newHallSize })
            });

            if (!response.ok) {
                const msg = await response.text();
                throw new Error(msg || "Помилка при створенні")
            }

            const created = await response.json()
            setCurrentHalls(prev => [...prev, created])
            setNewHallName("")
            successSmth(GOOD_CREATE)
        } catch (err) {
            alert("Не вдалося створити залу: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    async function deleteHall(id) {
        try {
            const response = await fetch(`${BACKEND_API_URL}/hall/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 204) {
                setCurrentHalls(prev => prev.filter(h => h.id !== id));
                successSmth(SUCCESS_DELETE)
            } else {
                throw new Error(BAD_DELETE);
            }
        } catch (err) {
            alertSmth(err.message);
        }
    }

    return (
        <section className="p-8 rounded-md text-white flex flex-col">
            <div className="mb-4">
                <label className="block mb-1 font-medium text-lg">{NEW_HALL}</label>
                <input
                    type="text"
                    value={newHallName}
                    onChange={e => setNewHallName(e.target.value)}
                    placeholder="Введіть назву зали"
                    className="w-full p-2 rounded text-orange-200 outline-none"
                />
                <input
                    min={3}
                    type="number"
                    value={newHallSize}
                    onChange={e => setNewHallSize(e.target.value)}
                    placeholder="Введіть к-ть місць"
                    className="w-full p-2 rounded text-orange-200 outline-none"
                />
                <button
                    onClick={createHall}
                    disabled={loading}
                    className="mt-2 bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded disabled:opacity-50"
                >
                    {loading ? "Додаємо..." : "Додати залу"}
                </button>
                <hr className="my-4 border-amber-800" />
            </div>

            <h3 className="text-xl font-semibold mb-2">Список залів</h3>
            <ul className="space-y-2">
                {currentHalls.map(hall => (
                    <li
                    key={hall.id}
                    className="bg-[#231f3d94] p-3 rounded flex justify-between items-center"
                >
                    <div className="flex">
                        <span className="xl:mr-3">{hall.name}</span>
                        <span>{`| кількість місць: ${hall.size}`}</span>
                    </div>
                    <button
                        onClick={() => deleteHall(hall.id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Видалити"
                    >
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </li>
                ))}
            </ul>
        </section>
    );
}