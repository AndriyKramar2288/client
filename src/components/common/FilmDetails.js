"use client"

import { motion } from "framer-motion"
import React, { useEffect, useState } from "react";

const PHOTOS_INTERVAL_VALUE = 5000
const DESCRIPTION_H1 = "Опис"
const DETAILS_LIST_ITEM_TEXTS = {
    director: { text: "Режисер", icon: "fa-solid fa-user-tie" },
    duration: { text: "Тривалість", icon: "fa-solid fa-film" },
    countries: { text: "Країни", icon: "fa-solid fa-font-awesome" },
    voice_acting: { text: "Дубляж", icon: "fa-solid fa-quote-right" },
    actors: { text: "Актори", icon: "fa-solid fa-user-secret" }
};

function DetailsListItem({first, last, icon_class}) {
    return (
        <li className="flex items-center flex-col sm:flex-row mb-3">
            <div className="flex items-center">
                <i className={`mr-2 text-xs ${icon_class}`}></i>
                <span className="font-extrabold mr-2">{first}:</span>
            </div>
            {last}
        </li>
    )
}

const FilmDetails = React.forwardRef(({film}, ref) => {

    const [photosIntr, setPhotosIntr] = useState()
    const [currentPhoto, setCurrentPhoto] = useState(0)

    useEffect(() => {
        setPhotosIntr(setInterval(() => {
            setCurrentPhoto(prev => prev + 1 === film.src_photos.length ? 0 : prev + 1)
        }, PHOTOS_INTERVAL_VALUE))

        return () => {
            clearInterval(photosIntr)
            setPhotosIntr(null)
        }
    }, [])

    return (
        <motion.div
            ref={ref}
            className="bg-cover bg-center rounded-2xl lg:ml-4"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.75, delay: 0.25 } }}
            exit={{ opacity: 0, x: 100, transition: { duration: 0.25 } }}
            style={{ fontFamily: "var(--font-pt-mono)", backgroundImage: `url(${film.src_photos[currentPhoto]})` }}>

            <motion.div className="backdrop-sepia-50 h-full flex p-2 rounded-2xl"
                        key={currentPhoto}
                        initial={{ backdropFilter: "blur(100px)" }}
                        animate={{ backdropFilter: "blur(4px)", transition: { duration: 0.7, ease: "easeOut" } }}
                        exit={{ backdropFilter: "blur(100px)", transition: { duration: 0.1, ease: "easeIn" } }}>
                <div className="flex flex-col p-1 lg:max-w-[50vw]">
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
                        <p className="text-xs sm:text-sm text-center sm:text-left bg-[#000000cf] p-5 rounded-lg mt-2">{film.about}</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}) 

export default FilmDetails