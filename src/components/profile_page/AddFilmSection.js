"use state"
import { useState } from 'react'
import { emptyListSplitter } from '../services/nonComponents';

const FILM_CREATION = "Додавання фільму"
const ADD_FILM = "Додати фільм"

const Field = ({ label, name, value, onChange, type = "text", textarea = false, ...rest }) => (
    <label className="flex items-center justify-between bg-amber-800 my-2 p-1 rounded-lg">
        <h1 className='mr-2'>{label}</h1>
        {textarea ? (
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                className="p-2 bg-[#43281173] rounded resize-y outline-none focus:bg-amber-900"
                {...rest}
                autoComplete='off'
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="p-2 bg-[#43281173] rounded outline-none focus:bg-amber-900"
                {...rest}
                autoComplete='off'
            />
        )}
    </label>
);

export default function AddFilmSection({ film, setFilm, saveFilm }) {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const readyFilm = {
            ...film,
            rating: [{name: "imdb", rate: film.rating}],
            actors: emptyListSplitter(film.actors, "\n").map(actor => ({fullname: actor})),
            src_photos: emptyListSplitter(film.src_photos, "\n"),
            genres: emptyListSplitter(film.genres, ", "),
            countries: emptyListSplitter(film.countries, ", ")
        }

        saveFilm(readyFilm)
        console.log(readyFilm)
    };

    return (
        <section className="flex-col items-center max-w-4xl">
            <h1 className="text-xl font-bold mb-6 text-center">{FILM_CREATION}</h1>
            <div className="flex flex-col">
                <Field label="Українська назва" name="uk_name" value={film.uk_name} onChange={handleChange} />
                <Field label="Англійська назва" name="en_name" value={film.en_name} onChange={handleChange} />
                <Field label="Рік випуску" name="release_year" type="number" value={film.release_year} onChange={handleChange} min={1900} />
                <Field label="Режисер" name="director" value={film.director} onChange={handleChange} />
                <Field label="Постер (URL)" name="src_poster" value={film.src_poster} onChange={handleChange} />
                <Field label="Фото (через Enter)" name="src_photos" textarea rows={3} value={film.src_photos} onChange={handleChange} />
                <Field label="Країни (через кому)" name="countries" value={film.countries} onChange={handleChange} />
                <Field label="Жанри (через кому)" name="genres" value={film.genres} onChange={handleChange} />
                <Field label="Актори (через Enter)" name="actors" textarea rows={4} value={film.actors} onChange={handleChange} />
                <Field label="Тривалість (хв)" name="duration" type="number" value={film.duration} onChange={handleChange} min={0} />
                <Field label="Озвучення" name="voice_acting" value={film.voice_acting} onChange={handleChange} />
                <Field label="Рейтинг IMDb" name="rating" value={film.rating} onChange={handleChange} placeholder="8.3/328 000" />
                <Field label="Вікове обмеження" name="age_limit" value={film.age_limit} onChange={handleChange} placeholder="12+" />
                <Field label="Про фільм" name="about" textarea rows={6} value={film.about} onChange={handleChange} />
            </div>
            <div className="flex justify-center mt-6">
                <button
                    onClick={handleSubmit}
                    className="bg-amber-800 hover:bg-amber-700 duration-300 px-6 py-2 rounded text-white font-semibold"
                >
                    {ADD_FILM}
                </button>
            </div>
        </section>
    )
}