"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"

const PHOTOS_INTERVAL_VALUE = 5000

const LOOK_FOR_WATCHS_TEXT = "Переглянути сенси"
const DESCRIPTION_H1 = "Опис"
const IMDB_SVG_SRC = "https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"

const DETAILS_LIST_ITEM_TEXTS = {
    director: { text: "Режисер", icon: "fa-solid fa-user-tie" },
    duration: { text: "Тривалість", icon: "fa-solid fa-film" },
    countries: { text: "Країни", icon: "fa-solid fa-font-awesome" },
    voice_acting: { text: "Дубляж", icon: "fa-solid fa-quote-right" },
    actors: { text: "Актори", icon: "fa-solid fa-quote-right" }
};


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

function DetailsListItem({first, last, icon_class}) {
    return (
        <li className="flex items-center mb-3">
            <i className={`mr-2 text-xs ${icon_class}`}></i>
            <span className="font-extrabold mr-2">{first}:</span>
            {last}
        </li>
    )
}

function FilmDetails({ film, currentPhoto }) {
    return (
        <motion.div
            className="bg-cover bg-center rounded-2xl ml-4"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.75, delay: 0.25 } }}
            exit={{ opacity: 0, x: 100, transition: { duration: 0.25 } }}
            style={{ fontFamily: "var(--font-pt-mono)", backgroundImage: `url(${film.src_photos[currentPhoto]})` }}>

            <motion.div className="backdrop-sepia-50 h-full flex p-2 rounded-2xl"
                        key={currentPhoto}
                        initial={{ backdropFilter: "blur(100px)" }}
                        animate={{ backdropFilter: "blur(4px)", transition: { duration: 0.7, ease: "easeOut" } }}
                        exit={{ backdropFilter: "blur(100px)", transition: { duration: 0.1, ease: "easeIn" } }}>
                <div className="flex flex-col p-1 max-w-[50vw]">
                    <ul className="bg-[#00000088] p-5 rounded-lg">
                        <DetailsListItem 
                            first={DETAILS_LIST_ITEM_TEXTS["director"].text} 
                            last={film.director} 
                            icon_class={DETAILS_LIST_ITEM_TEXTS["director"].icon} 
                            />

                        <DetailsListItem 
                            first={DETAILS_LIST_ITEM_TEXTS["duration"].text} 
                            last={`${film.duration} хв`} 
                            icon_class={DETAILS_LIST_ITEM_TEXTS["duration"].icon} 
                            />

                        <DetailsListItem 
                            first={DETAILS_LIST_ITEM_TEXTS["countries"].text} 
                            last={film.countries.join(", ")} 
                            icon_class={DETAILS_LIST_ITEM_TEXTS["countries"].icon} 
                            />

                        <DetailsListItem 
                            first={DETAILS_LIST_ITEM_TEXTS["voice_acting"].text} 
                            last={film.voice_acting} 
                            icon_class={DETAILS_LIST_ITEM_TEXTS["voice_acting"].icon} 
                            />

                        <DetailsListItem 
                            first={DETAILS_LIST_ITEM_TEXTS["actors"].text} 
                            last={film.actors.join(", ")} 
                            icon_class={DETAILS_LIST_ITEM_TEXTS["actors"].icon} 
                            />
                    </ul>

                    <div>
                        <h1 className="mt-6 font-bold text-center">{DESCRIPTION_H1}</h1>
                        <p className="text-sm bg-[#000000cf] p-5 rounded-lg mt-2">{film.about}</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}





export default function MovieCard({ film, hide_details_other_card, extanded, visible, card_index }) {
    function toggleExtanded() {
        hide_details_other_card(card_index)
    }

    const [photosIntr, setPhotosIntr] = useState()
    const [currentPhoto, setCurrentPhoto] = useState(0)

    useEffect(() => {
        if (extanded) {
            setPhotosIntr(setInterval(() => {
                setCurrentPhoto(prev => prev + 1 === film.src_photos.length ? 0 : prev + 1)
            }, PHOTOS_INTERVAL_VALUE))

            return () => {
                clearInterval(photosIntr)
            }
        }
        else {
            clearInterval(photosIntr)
        }
    }, [extanded])

    return (
        <AnimatePresence mode="wait">
        {visible && (
            <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: extanded ? "100%" : "50%", transition: { duration: 0.7 } }}
                exit={{ opacity: 0, width: 0, transition: { duration: 0.7 } }}
                className="flex text-amber-100 my-4 overflow-hidden items-start"
                key={card_index}>
                <div onClick={(e) => toggleExtanded()} className="bg-[#585858d3] rounded-tl-2xl flex justify-center items-center cursor-pointer duration-300 hover:bg-amber-700">
                    <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.15 } }}
                        exit={{ opacity: 0, transition: { duration: 0.5 } }}
                        key={film.src_poster}
                        src={film.src_poster} alt="poster" className="shadow-xl shadow-black max-h-[70lvh] rounded-md m-2.5 contain-content" />
                </div>
                <div style={{ fontFamily: "var(--font-cormorant)" }} className="flex flex-col bg-[#38383862] rounded-br-2xl">
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
                    <MovieCardButton text={LOOK_FOR_WATCHS_TEXT} />
                </div>
                {extanded && (
                    <FilmDetails currentPhoto={currentPhoto} film={film} />
                )}
            </motion.div>
        )}
        </AnimatePresence>
    )
}