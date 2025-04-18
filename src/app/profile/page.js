"use client"

import Header from "@/components/common/Header";
import { useMainContext } from "@/components/contexts/MainContext";
import AdminPanel from "@/components/profile_page/AdminPanel";
import { alertSmth, BACKEND_API_URL, logout, TOKEN_LOCAL_STORAGE } from "@/components/services/nonComponents";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion"

const BG_URL = "/images/2025-04-09_20.36.09.png"
const PROFILE_HEAD = "Профіль"
const LOGOUT = "Вийти"
const BAD_BEHAVIOUR = "Куди-куди, давай без наглості!"
const INTERNET_ERROR = "Помилка!"
const MY_BOOKING = "Мої бронювання"
const EMPTY_BOOKINGS = "Недавні бронювання відсутні!"
const ADMIN_PANEL = "Адмін-панель"

function BookingList({ sessionInfos }) {
return (
    <div className="p-4 space-y-8">
        {sessionInfos && sessionInfos.length > 0 ? (sessionInfos.map((session) => (
        <div
            key={session.id}
            className="bg-[#2d2d2d71] rounded-md shadow-md p-6 border-gray-200"
        >
            <h2 className="text-2xl font-bold mb-2">{session.film.uk_name} ({session.film.release_year})</h2>
            <p className="text-gray-100 mb-4">
            🎬 {session.film.director} • 📅 {new Date(session.date).toLocaleString()} • 🎞 {session.format} • 💺 {session.hall_data.name} • 💵 {session.price_per_sit} грн/місце
            </p>

            <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-gray-700 text-sm">
                <thead className="bg-gray-600">
                <tr>
                    <th className="px-4 py-2 border border-gray-700">#</th>
                    <th className="px-4 py-2 border border-gray-700">Місце</th>
                    <th className="px-4 py-2 border border-gray-700">Час бронювання</th>
                    <th className="px-4 py-2 border border-gray-700">Глядач</th>
                    <th className="px-4 py-2 border border-gray-700">Контакти</th>
                </tr>
                </thead>
                <tbody className="bg-gray-500">
                {session.bookings.map((booking, i) => (
                    <tr key={booking.id} className="hover:bg-gray-800 duration-200">
                    <td className="px-4 py-2 border border-gray-700 text-center">{i + 1}</td>
                    <td className="px-4 py-2 border border-gray-700 text-center">{booking.sit}</td>
                    <td className="px-4 py-2 border border-gray-700">{new Date(booking.bookingTime).toLocaleString()}</td>
                    <td className="px-4 py-2 border border-gray-700">
                        <div className="font-semibold">{booking.cinemaViewer.fullName}</div>
                        <div className="text-sm text-gray-500">{booking.cinemaViewer.email}</div>
                    </td>
                    <td className="px-4 py-2 border border-gray-700">
                        📞 {booking.cinemaViewer.phoneNumber}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        ))) : (
            <h1 className="text-lg font-bold">
                {EMPTY_BOOKINGS}
            </h1>
        )}
    </div>
    );
};

function SmallUser({ user }) {
    return (
        <div className="rounded-md bg-[#000000af] p-3 flex flex-col items-center mb-2">
            {user.photoSrc && <img src={user.photoSrc} className="w-[50%] h-[50%] rounded-full mb-2" />}
            <h1 className="mb-2">{user.username}</h1>
            <h1 className="mb-2">{user.email}</h1>
        </div>
    )
}

function LeftButton({ text, clickHandler, active }) {
    return (
        <button
            onClick={clickHandler} 
            className={`mb-2 duration-500 px-7 py-2 rounded-sm
                        ${active ? " bg-gray-500" : "bg-gray-900 hover:bg-gray-800 cursor-pointer"}
            `}>
        {text}                    
        </button>
    )
}

export default function LoginPage() {
    const router = useRouter()
    const [user, setUser] = useMainContext()
    const [sessionInfos, setSessionInfos] = useState()

    const [selectedCategory, setSelectedCategory] = useState(1)

    useEffect(() => {
        console.log(sessionInfos)
    }, [sessionInfos])

    async function initBookings() {
        try {
            const result = await fetch(`${BACKEND_API_URL}/users/session/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN_LOCAL_STORAGE)}`
                }
            })
            if (result.ok) {
                const data = await result.json()
                setSessionInfos(data)
            }
            else {
                throw new Error("LOL")
            }
        }
        catch {
            alertSmth(INTERNET_ERROR)
        }
    }

    useEffect(() => {
        if (!localStorage.getItem(TOKEN_LOCAL_STORAGE)) {
            router.push("/")
            alertSmth(BAD_BEHAVIOUR)
            return
        }

        initBookings()
    }, [])

    return (
        <div className="bg-cover bg-fixed" style={{ backgroundImage: `url(${BG_URL})`, fontFamily: "var(--font-pt-mono)" }}>
            <div className="min-h-screen backdrop-blur-sm backdrop-contrast-150 text-white flex flex-col">
                <Header headText={PROFILE_HEAD.toUpperCase()} />
                <main className="flex justify-between flex-col xl:flex-row xl:px-20 2xl:px-40 py-10 flex-1">
                    <nav className="flex-1/4 bg-[#43281173] xl:mr-10 rounded-md flex flex-col items-center justify-between p-4">
                        <section>
                            {user && <SmallUser user={user} />}
                            <div className="flex flex-col xl:items-end items-center">
                                <LeftButton active={1 === selectedCategory} 
                                            text={MY_BOOKING} 
                                            clickHandler={() => setSelectedCategory(1)} />
                                {user && user.roles.includes("ADMIN") && 
                                <LeftButton active={99 === selectedCategory} 
                                            text={ADMIN_PANEL}
                                            clickHandler={() => setSelectedCategory(99)} />}
                            </div>
                        </section>
                        <button
                            onClick={() => logout(setUser, router)}
                            className="rounded-lg bg-amber-900 hover:bg-amber-800 duration-500 px-7 py-2 flex justify-between items-center font-semibold">
                            <i className="fa-solid fa-arrow-right-from-bracket mr-3 text-xl"></i>
                            {LOGOUT}
                        </button>
                    </nav>
                    <section className="flex-3/4 bg-[#2e201373] p-4 overflow-hidden rounded-md">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                className="w-full h-full"
                                initial={{ opacity: 0, y: -15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 15 }}
                                transition={{ duration: 0.1, ease: "easeIn" }}
                                key={selectedCategory}>
                                {selectedCategory === 1 && <BookingList sessionInfos={sessionInfos} />}
                                {selectedCategory === 99 && <AdminPanel />}
                            </motion.div>
                        </AnimatePresence>
                    </section>
                </main>
            </div>
        </div>
    )
}