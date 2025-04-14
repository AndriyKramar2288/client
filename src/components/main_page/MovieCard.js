"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import FilmDetails from "../common/FilmDetails"

const LOOK_FOR_WATCHS_TEXT = "Переглянути сенси"
const IMDB_SVG_SRC = "https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
const BOOKING_PATH = "/booking"

function MovieCardButton({ clickHandler, text }) {
    return (
        <div className="group flex m-4">
            <div className="w-0 group-hover:pr-2 duration-300 bg-amber-700" />
            <button onClick={clickHandler} style={{ fontFamily: "var(--font-pt-mono)" }} className="cursor-pointer bg-amber-700 hover:bg-amber-800 duration-300 px-3 group-hover:px-1 py-2 whitespace-nowrap">
                {text}
            </button>
            <div className="w-0 group-hover:pl-2 duration-300 bg-amber-700" />
        </div>
    )
}

export default function MovieCard({ film, card_index, cardDetailsVisible, setCardDetailsVisible }) {
    function toggleExtanded() {
        if (cardDetailsVisible === card_index) {
            setCardDetailsVisible(-1)
        }
        else {
            setCardDetailsVisible(card_index)
        }
    }

    const route = useRouter()
    const sectionRef = useRef(null);

    const [extanded, setExtanded] = useState(false)
    const [visible, setVisible] = useState(true)

    const [init, setInit] = useState(true)
    useEffect(() => {
        setInit(false)
    }, [init])

    function isScreenXL() {
        return (window.innerWidth >= 1280)
    }

    useEffect(() => {
        setExtanded(cardDetailsVisible === card_index)
        
        if (isScreenXL()) {
            setVisible(!(card_index % 2 ? cardDetailsVisible + 1 === card_index : cardDetailsVisible - 1 === card_index))
        }
    }, [cardDetailsVisible])

    useEffect(() => {
        if (extanded) {
            sectionRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [extanded])

    return (
        <AnimatePresence mode="wait">
        {visible && (
            <motion.div 
                initial={{ opacity: 0, width: init ? "50%" : 0 }}
                animate={{ opacity: 1, width: (extanded ? "100%" : "50%"), transition: { duration: init ? 0.25 : 0.7 } }}
                exit={{ opacity: 0, width: 0, transition: { duration: 0.7 } }}
                className="flex text-amber-100 my-4 overflow-hidden items-center lg:items-start flex-col lg:flex-row xl:mx-0 mx-4"
                key={card_index}>
                <div className="flex flex-col md:flex-row my-3 lg:my-0 items-center md:items-start">
                    <div onClick={(e) => toggleExtanded()} className="xl:bg-[#585858d3] lg:bg-none bg-[#232323d3] not-xl:rounded-sm xl:rounded-tl-2xl flex justify-center items-center cursor-pointer duration-300 hover:bg-amber-700">
                        <motion.img
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.15 } }}
                            exit={{ opacity: 0, transition: { duration: 0.5 } }}
                            key={film.src_poster}
                            src={film.src_poster} alt="poster" className="xl:shadow-xl shadow-black max-h-[70lvh] rounded-md m-2.5 contain-content" />
                    </div>
                    <div style={{ fontFamily: "var(--font-cormorant)" }} className="my-3 lg:my-0 flex flex-col items-center sm:items-start bg-[#38383862] not-xl:rounded-2xl xl:rounded-br-2xl">
                        <h1 className="m-3 text-3xl">{film.uk_name}</h1>
                        <h1 className="text-xl mx-3 my-0.5 italic text-amber-200">{film.en_name}</h1>
                        <div className="flex mx-3 my-0.5 items-center">
                            <h1 className="font-bold text-2xl">{film.age_limit}</h1>
                            {film.genres.map((genre, index) => <h1 key={index} className="font-bold text-xl ml-2">{`${genre.toLowerCase()}${index !== film.genres.length-1 ? "," : ""}`}</h1>)}
                        </div>
                        <h1 className="text-xl mx-3 my-0.5 text-amber-200">{film.release_year}</h1>
                        <div className="flex items-center mx-3">
                            <img src={IMDB_SVG_SRC} className="max-h-5" />
                            <h1 className="text-xl m-3 text-amber-200">{film.rating.imdb}</h1>
                        </div>
                        <MovieCardButton text={LOOK_FOR_WATCHS_TEXT} clickHandler={() => route.push(`${BOOKING_PATH}/${film.id}`)} />
                    </div>
                </div>
                {extanded && (
                    <FilmDetails film={film} ref={sectionRef} />
                )}
            </motion.div>
        )}
        </AnimatePresence>
    )
}