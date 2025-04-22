"use state"

import { motion } from "framer-motion";
import { useEffect, useState } from 'react'
import AddFilmSection from './AddFilmSection';
import { alertSmth, BACKEND_API_URL, isDev, successSmth, TOKEN_LOCAL_STORAGE } from '../services/nonComponents';

const JUST_ERROR = "Помилка сервера (походу)"
const SUCCESS_DELETED = "Фільм успішно видалено!"
const SUCCESS_ADDED = "Фільм успішно додано!"
const BAD_REQUEST = "Ви забули вказати деякі дані!"
const CURRENT_FILMS = "Додані фільми"
const BAD_CLIENT_DELETE = "Помилка клієнта. Перезавантажте сторінку, будь ласочка... 😭"
const PARSING_HEAD = "Парсинг UAKINO"
const WAIT_PLEASE = "Почекайте трошки"
const SUCCESS_PARSE = "Фільми одержано!"
const REQUEST_CANNOT_BE_EMPTY = "Запит не може бути пустим!"

const initialFilm = {
    uk_name: "",
    en_name: "",
    release_year: "",
    countries: "",
    genres: "",
    director: "",
    src_poster: "",
    src_photos: "",
    actors: "",
    duration: "",
    voice_acting: "",
    imdb: "",
    age_limit: "",
    about: "",
}

function FilmCardButton({ iconClass, clickHandler }) {
    return (
        <button className='group bg-[#ab6d2155] rounded-md mx-1 hover:bg-[#ab6d21b3] cursor-pointer p-2' onClick={clickHandler}>
            <i className={`text-red-500 duration-200 group-hover:text-red-900 ${iconClass}`}></i>
        </button>
    )
}

function FilmCard ({ children, film }) {
    return (
        <motion.li
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.1, ease: "easeIn" }}
            className="flex flex-1/3 bg-[#855d2586] hover:bg-[#604d3eb9] p-4 m-3 rounded-xl transition-all duration-300">
                <div className='flex flex-col items-center justify-between mr-3'>
                    <img
                    src={film.src_poster ? film.src_poster : "[нема]"}
                    alt={`${film.uk_name} poster`}
                    className="max-w-24 max-h-36 mb-4 object-cover rounded-md"
                    />
                    <div className='flex'>
                        {children}
                    </div>
                </div>
                <div className="flex flex-col justify-between text-left">
                    <h2 className="text-xl font-bold">{film.uk_name}</h2>
                    <p className="text-sm italic text-gray-300">{film.en_name}</p>
                    <p className="text-sm"><span className="font-semibold">Режисер:</span> {film.director}</p>
                    <p className="text-sm"><span className="font-semibold">Рік:</span> {film.release_year}</p>
                    <p className="text-sm">
                        <span className="font-semibold">Країна:</span>
                        {film.countries && film.countries.length ? " " + film.countries.join(", ") : '—'}
                    </p>
                    <p className="text-sm">
                        <span className="font-semibold">Жанри:</span>
                        {film.genres && film.genres.length ? " " + film.genres.join(", ") : '—'}
                    </p>
                </div>
        </motion.li>
    )
}


function FilmList ({ currentFilms, setCurrentFilms, createSession }) {
    async function performSuicide(film_id) {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE)
            if (token && film_id) {
                try {
                    const gettedFilms = await fetch(`${BACKEND_API_URL}/films/${film_id}`, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        },
                        method: "DELETE"
                    })
                    if (gettedFilms.status === 204) {
                        setCurrentFilms(prev => prev.filter(film => film.id !== film_id))
                        successSmth(SUCCESS_DELETED)
                    }
                    else {
                        const text = await gettedFilms.text()
                        throw new Error(text)
                    }
                }
                catch (error) {
                    alertSmth(isDev() ? `${JSON.parse(error.message).message ?? 'LOL'}` : JUST_ERROR)
                }
            }
            else {
                alertSmth(BAD_CLIENT_DELETE)
            }
    }

    return (
        <section className='flex flex-col items-center flex-1/2'>
            <h1 className="font-semibold mb-2">{CURRENT_FILMS.toUpperCase()}</h1>
            <ul className='flex items-stretch justify-center flex-col md:flex-row md:justify-around flex-wrap'>
                {currentFilms.map((film, index) => (
                    <FilmCard film={film} key={index}>
                        <FilmCardButton clickHandler={() => createSession(film)} iconClass={"fa-solid fa-tv"} />
                        <FilmCardButton clickHandler={() => performSuicide(film.id)} iconClass={"fa-solid fa-trash"} />
                    </FilmCard>
                ))}
            </ul>
        </section>
    )
}

function ParseFilmsSection({ setFilm }) {
    const [searchRequest, setSearchRequest] = useState("")
    const [inputBlock, setInputBlock] = useState(false)
    const [foundedFilms, setFoundedFilms] = useState([])

    useEffect(() => {
        if (inputBlock) {
            setSearchRequest("")
        }
    }, [searchRequest])

    async function searchHandler(e) {
        if (inputBlock) {
            return
        }

        if (!searchRequest.trim()) {
            alertSmth(REQUEST_CANNOT_BE_EMPTY)
            return
        }

        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE)
        if (token) {
            try {
                alertSmth(WAIT_PLEASE)
                const url = new URL(`${BACKEND_API_URL}/films/uakino`)
                url.searchParams.append("request", searchRequest)
                setSearchRequest("")
                setInputBlock(true)
                const gettedFilms = await fetch(url, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                })
                setInputBlock(false)
                if (gettedFilms.status === 200) {
                    successSmth(SUCCESS_PARSE)
                    setFoundedFilms(await gettedFilms.json())
                }
                else {
                    throw new Error(await gettedFilms.text())
                }
            }
            catch (error) {
                alertSmth(`${JSON.parse(error.message).message ?? JUST_ERROR}`)
            }
        }
    }

    function copyFilm(film) {
        setFilm(prev => {
            const cleanedFilm = Object.fromEntries(
                Object.entries(film).filter(([key, value]) => value !== null && value !== undefined)
            )

            return ({
                ...initialFilm,
                ...cleanedFilm,
                countries: Array.isArray(film.countries) ? film.countries.join(", ") : "",
                genres: Array.isArray(film.genres) ? film.genres.join(", ") : "",
                actors: Array.isArray(film.actors) ? film.actors.join("\n") : "",
                src_photos: Array.isArray(film.src_photos) ? film.src_photos.join("\n") : "",
            })
        })
    }

    return (
        <div className="flex flex-col items-center flex-1/2">
            <h1 className="font-semibold mb-2 mt-7 lg:mt-0">{PARSING_HEAD.toUpperCase()}</h1>
            <div className="flex">
                <input value={searchRequest} 
                       onChange={e => setSearchRequest(e.target.value)}
                       className="bg-gray-700 focus:bg-gray-800 text-white outline-none p-2 rounded-sm"
                       onKeyDown={e => e.key === 'Enter' ? searchHandler() : ""} />
                <button
                    onClick={searchHandler} 
                    className="mx-3 p-2 rounded-sm hover:bg-gray-600 bg-gray-800 text-3xl cursor-pointer duration-300">
                    <i className="fa-brands fa-searchengin"></i>
                </button>
            </div>
            <hr className="w-[95%] my-4 text-amber-700" />
            <ul>
                {foundedFilms.map((film, index) => (
                    <FilmCard key={index} film={film}>
                        <FilmCardButton clickHandler={() => copyFilm(film)} iconClass={"fa-solid fa-clone"} />
                    </FilmCard>
                ))}
            </ul>
        </div>
    )
}

export default function FilmControl({ currentFilms, setCurrentFilms, createSession, initFilms }) {

    const [new_film, setNew_film] = useState(initialFilm);    

    async function saveFilm(film_toSave) {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE)
            if (token) {
                try {
                    const gettedFilms = await fetch(`${BACKEND_API_URL}/films/`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(film_toSave)
                    })
                    if (gettedFilms.status === 201) {
                        initFilms()
                        setNew_film(initialFilm)
                        successSmth(SUCCESS_ADDED)
                    }
                    else if (gettedFilms.status === 400) {
                        throw new Error(BAD_REQUEST)
                    }
                    else {
                        throw new Error(JUST_ERROR)
                    }
                }
                catch (error) {
                    alertSmth(`${error.message}`)
                }
            }
    }

    return (
        <div className="flex flex-col p-8 rounded-md text-white">
            {currentFilms.length > 0 && (
                <div>
                    <FilmList currentFilms={currentFilms} setCurrentFilms={setCurrentFilms} createSession={createSession} />
                    <hr className="my-4 border-amber-800" />
                </div>
            )}
            <motion.section 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1, ease: "easeIn", delay: 0.2 }}
                className="flex mt-4 flex-col md:flex-row">
                <AddFilmSection film={new_film} setFilm={setNew_film} saveFilm={saveFilm} />
                <ParseFilmsSection setFilm={setNew_film} />
            </motion.section>
        </div>
    )
}