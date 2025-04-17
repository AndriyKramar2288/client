"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import FilmControl from "./FilmControl"
import SessionControl from "./SessionControl"
import { alertSmth, BACKEND_API_URL, isDev, TOKEN_LOCAL_STORAGE } from "../services/nonComponents"
import HallControl from "./HallControl"

const FILMS_H = "Фільми"
const SESSIONS_H = "Сеанси"
const HALLS_H = "Зали"
const LOADING_ERROR = "Помилка завантаження!"
const ERR_T = "Помилка при завантаженні залів"

function NavigationButton({ text, clickHandler, active }) {
    return (
        <button
            onClick={clickHandler} 
            className={`mx-2 duration-500 px-7 py-2 rounded-sm
                        ${active ? " bg-gray-500" : "bg-gray-900 hover:bg-gray-800 cursor-pointer"}
            `}>
        {text.toUpperCase()}                    
        </button>
    )
}

export default function AdminPanel() {

    async function initFilms() {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE)
        if (token) {
            try {
                const gettedFilms = await fetch(`${BACKEND_API_URL}/films/`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                if (gettedFilms.ok) {
                    const gettedJson = await gettedFilms.json()
                    setCurrentFilms(gettedJson)
                }
                else {
                    throw new Error("LOL")
                }
            }
            catch (error) {
                alertSmth(isDev() ? `${error}` : LOADING_ERROR)
            }
        }
    }

    async function fetchHalls() {
        try {
            const response = await fetch(`${BACKEND_API_URL}/films/hall/`)
            const data = await response.json()
            setCurrentHalls(data)
        } catch (err) {
            alert(ERR_T)
        }
    }

    function createSession(film) {
        setCreationSessionFilm(film)
        setSelectedCategory(2)
    }

    useEffect(() => {
        initFilms()
        fetchHalls()
    }, [])

    const [creationSessionFilm, setCreationSessionFilm] = useState()
    const [currentHalls, setCurrentHalls] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(1)
    const [currentFilms, setCurrentFilms] = useState([])

    return (
        <div className="flex flex-col">
            <nav className="bg-[#18173e55] flex justify-start rounded-sm mb-5">
                <NavigationButton text={FILMS_H} clickHandler={() => setSelectedCategory(1)} active={1 === selectedCategory} />
                <NavigationButton text={SESSIONS_H} clickHandler={() => setSelectedCategory(2)} active={2 === selectedCategory} />
                <NavigationButton text={HALLS_H} clickHandler={() => setSelectedCategory(3)} active={3 === selectedCategory} />
            </nav>
            <AnimatePresence mode="wait">
                <motion.section className="bg-[#18173e55]"
                                initial={{ opacity: 0, y: -15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 15 }}
                                transition={{ duration: 0.1, ease: "easeIn" }}
                                key={selectedCategory}>
                        {selectedCategory === 1 && <FilmControl currentFilms={currentFilms} setCurrentFilms={setCurrentFilms} createSession={createSession} />}
                        {selectedCategory === 2 && <SessionControl creationSessionFilm={creationSessionFilm} currentHalls={currentHalls} />}   
                        {selectedCategory === 3 && <HallControl currentHalls={currentHalls} setCurrentHalls={setCurrentHalls} />}   
                </motion.section>
            </AnimatePresence>
        </div>
    )
}