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

function BookingList({ bookings }) {
    return (
        <div>
            {bookings && bookings.length ? (
                <ul>
                    {bookings.map((booking, key) => (
                        <li key={key}>
                            {booking.viewSession.film.en_name}
                        </li>
                    ))}
                </ul>
            ) : (
                <h1 className="text-lg font-bold">
                    {EMPTY_BOOKINGS}
                </h1>
            )}
        </div>
    )
}

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
    const [bookings, setBookings] = useState()

    const [selectedCategory, setSelectedCategory] = useState(1)

    async function initBookings() {
        try {
            const result = await fetch(`${BACKEND_API_URL}/users/booking/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN_LOCAL_STORAGE)}`
                }
            })
            if (result.ok) {
                const data = await result.json()
                setBookings(data)
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

    useEffect(() => {
        console.log(user)
    }, [user])

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
                                {selectedCategory === 1 && <BookingList bookings={bookings} />}
                                {selectedCategory === 99 && <AdminPanel />}
                            </motion.div>
                        </AnimatePresence>
                    </section>
                </main>
            </div>
        </div>
    )
}