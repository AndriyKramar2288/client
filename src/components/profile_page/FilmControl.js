"use state"
import { useState } from 'react'
import AddFilmSection from './AddFilmSection';
import { alertSmth, BACKEND_API_URL, isDev, successSmth, TOKEN_LOCAL_STORAGE } from '../services/nonComponents';

const SUCCESS_DELETED = "Фільм успішно видалено!"
const SUCCESS_ADDED = "Фільм успішно додано!"
const JUST_ERROR = "Помилка сервера (походу)"
const BAD_REQUEST = "Ви забули вказати деякі дані!"
const CURRENT_FILMS = "Додані фільми"

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
    rating: "",
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

function FilmList ({ currentFilms, setCurrentFilms, createSession }) {

    async function performSuicide(film_id) {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE)
            if (token) {
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
                        throw new Error("LOL")
                    }
                }
                catch (error) {
                    alertSmth(isDev() ? `${error.message}` : JUST_ERROR)
                }
            }
    }

    return (
        <section className='flex flex-col items-center'>
            <h1 className="font-semibold mb-2">{CURRENT_FILMS.toUpperCase()}</h1>
            <ul className='flex justify-center sm:justify-start flex-wrap xl:flex-nowrap'>
                {currentFilms.map((film, index) => (
                    <div
                        key={index}
                        className="flex bg-[#855d2586] hover:bg-[#604d3eb9] p-4 m-3 rounded-xl transition-all duration-300">
                            <div className='flex flex-col items-center justify-between mr-3'>
                                <img
                                src={film.src_poster}
                                alt={`${film.uk_name} poster`}
                                className="w-24 h-36 object-cover rounded-md"
                                />
                                <div className='flex'>
                                    <FilmCardButton clickHandler={() => createSession(film)} iconClass={"fa-solid fa-tv"} />
                                    <FilmCardButton clickHandler={() => performSuicide(film.id)} iconClass={"fa-solid fa-trash"} />
                                </div>
                            </div>
                            <div className="flex flex-col justify-between text-left">
                                <h2 className="text-xl font-bold">{film.uk_name}</h2>
                                <p className="text-sm italic text-gray-300">{film.en_name}</p>
                                <p className="text-sm"><span className="font-semibold">Режисер:</span> {film.director}</p>
                                <p className="text-sm"><span className="font-semibold">Рік:</span> {film.release_year}</p>
                                <p className="text-sm">
                                    <span className="font-semibold">Країна:</span>
                                    {film.countries && film.countries.length ? film.countries.join(", ") : '—'}
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold">Жанри:</span>
                                    {film.genres && film.genres.length ? film.genres.join(", ") : '—'}
                                </p>
                            </div>
                    </div>
                ))}
            </ul>
        </section>
    )
}

export default function FilmControl({ currentFilms, setCurrentFilms, createSession }) {

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
                        body: JSON.stringify([film_toSave])
                    })
                    if (gettedFilms.status === 201) {
                        const gettedJson = await gettedFilms.json()
                        setCurrentFilms(prev => [...prev, ...gettedJson])
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
            <section className="flex mt-4">
                <AddFilmSection film={new_film} setFilm={setNew_film} saveFilm={saveFilm} />
            </section>
        </div>
    )
}