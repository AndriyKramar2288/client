"use client"

import { motion } from "framer-motion";
import { useMainContext } from "../contexts/MainContext";
import { alertSmth, BACKEND_API_URL, successSmth, TOKEN_LOCAL_STORAGE } from "../services/nonComponents";

const EMPTY_BOOKINGS = "Бронювання відсутні!"
const JUST_ERROR = "Помилка сервера (походу)"
const SUCCESS_DELETED = "Бронювання успішно видалено!"
const BOOKINGS_NOT_PRESENT = "Бронювання відсутні!"

export default function BookingList({ sessionInfos, setSessionInfos, full = false }) {

    const [user, setUser] = useMainContext()

    async function performSuicide(booking_id) {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE)
        if (token && booking_id) {
            try {
                const result = await fetch(`${BACKEND_API_URL}/booking/${booking_id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    method: "DELETE"
                })
                if (result.status === 204) {
                    setSessionInfos(prev => prev.map(each => 
                        ({...each, bookings: each.bookings.filter(b => b.id !== booking_id)})
                    ))
                    successSmth(SUCCESS_DELETED)
                }
                else {
                    const text = await result.text()
                    throw new Error(text)
                }
            }
            catch (error) {
                alertSmth(`${JSON.parse(error.message).message ?? 'LOL'}`)
            }
        }
        else {
            alertSmth(BAD_CLIENT_DELETE)
        }
    }

    return (
        <div className="p-4 space-y-8">
            {sessionInfos && sessionInfos.length > 0 ? (sessionInfos.map((session) => ( 
            <div
                key={session.id}
                className="flex flex-col items-center border-gray-200"
            >
                <div className="bg-[#2d2d2d71] rounded-md shadow-md p-2 flex flex-col items-center mb-3">
                    <h2 className="text-2xl font-bold mb-2">{session.film.uk_name} ({session.film.release_year})</h2>
                    <div className="text-gray-100 mb-4 justify-around flex items-end flex-col md:flex-row">
                        <p>
                        🎬 {session.film.director} • 
                        </p>
                        <p>
                        📅 {new Date(session.date).toLocaleString()} •
                        </p>
                        <p>
                        🎞 {session.format} •
                        </p>
                        <p>
                        💺 {session.hall_data.name} •
                        </p>
                        <p>
                        💵 {session.price_per_sit} грн/місце • 
                        </p>
                    </div>
                    <hr className="my-2 border-orange-500 w-full" />
                </div>
                {session.bookings.length !== 0 ? (
                    <table className="min-w-full table-auto border-gray-700 text-sm">
                    <thead className="bg-gray-600">
                    <tr className="hidden lg:table-row">
                        <th className="px-4 py-2 border border-gray-700">Місце</th>
                        <th className="px-4 py-2 border border-gray-700">Час бронювання</th>
                        <th className="px-4 py-2 border border-gray-700">Глядач</th>
                        <th className="px-4 py-2 border border-gray-700">Контакти</th>
                        {full && <th className="px-4 py-2 border border-gray-700 hidden lg:table-cell">Обліковий запис</th>}
                    </tr>
                    </thead>
                    <tbody className="bg-gray-600">
                    {session.bookings.map((booking, i) => (
                        <motion.tr 
                            key={booking.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.1, ease: "easeIn", delay: 0.025 * i }}
                            className="hover:bg-gray-800 duration-200 lg:table-row bg-gray-500">

                            <td className="hidden lg:table-cell px-4 py-2 border border-gray-700 text-center">{booking.sit}</td>
                            <td className="lg:px-4 px-1 py-2 border border-gray-700">{new Date(booking.bookingTime).toLocaleString()}</td>
                            <td className="lg:px-4 px-1 py-2 border border-gray-700">
                                <div className="font-semibold">{booking.cinemaViewer.fullName}</div>
                                <div className="text-sm text-gray-700">{booking.cinemaViewer.email}</div>
                            </td>
                            <td className="px-4 py-2 border border-gray-700">
                                <p className="whitespace-nowrap">📞 {booking.cinemaViewer.phoneNumber}</p>
                            </td>
                            {full && (
                                <td className="lg:px-4 hidden lg:table-cell px-1 py-2 border border-gray-700">{booking.cinemaUser?.email ?? "-"}</td> 
                            )}
                            {full && user && user.roles.includes("ADMIN") && (
                                <td className="lg:px-4 px-1 py-2 border border-gray-700">
                                    <button className="p-2 rounded-md bg-red-700 hover:bg-red-900 duration-200"
                                            onClick={() => performSuicide(booking.id)}>
                                        <i className="fa-solid fa-trash text-teal-50" />
                                    </button>
                                </td> 
                            )}
                        </motion.tr>
                    ))}
                    </tbody>
                </table>
                ) : (
                    <div className="text-lg bg-gray-600 hover:bg-gray-700 duration-500 px-5 py-3 rounded-md mb-4">
                        {BOOKINGS_NOT_PRESENT}
                    </div>
                )}
            </div>
            ))) : (
                <h1 className="text-lg font-bold">
                    {EMPTY_BOOKINGS}
                </h1>
            )}
        </div>
    );
};