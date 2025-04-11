"use client"

import { AnimatePresence, motion } from "framer-motion"

const films_data = [
    {
        id: 1,
        uk_name: "Полювання",
        en_name: "The Hunt",
        release_year: 2012,
        countries: ["Данія", "Швеція"],
        genres: ["Фільми", "Драми"],
        director: "Томас Вінтерберґ",
        src_poster: "https://uakino.me/uploads/posts/2018-02/1517680168_1.jpg",
        src_photos: [
            "https://uakino.me/uploads/posts/2017-10/TheHunt/5dbjyrbe.jpg",
            "https://uakino.me/uploads/posts/2017-10/TheHunt/42p0j1zh.jpg",
            "https://uakino.me/uploads/posts/2017-10/TheHunt/p12y2pkx.jpg"
        ],
        actors: [
            "Мадс Міккельсен", 
            "Томас Бо Ларсен",
            "Анніка Веддеркопп",
            "Ласе Фоґельстрьом",
            "Сусе Волд",
            "Анне Луізе Гасінґ"
        ],
        duration: 1488,
        voice_acting: "Український (Цікава Ідея)",
        rating: {
            imdb: "8.3/328 000"
        },
        age_limit: "12+",
        about: "Психологічний фільм «Полювання», знятий данцем Томасом Вінтербергом, розповідає історію вигнанця і показує, як людське безумство може бути заразним. Люди звикли вірити натовпу, і не реагують на докази та каяття. Все, що намагається сказати у відповідь вигнанець, сприймається як спроба виправдати себе. Ця вузьколобість людей руйнує долі невинних, що виявилися жертвами дивних, непередбачуваних обставин. У крихітному данському селі живе сорокарічний Лукас. Після розлучення і боротьби за сина підлітка, який вирішив залишитися з ним, він пішов з ліцею і став вихователем в дитсадку. Привабливий Лукас не обділений увагою: у нього навіть закохується його вихованка - п'ятирічна дівчинка Клара. Одного разу дівчинка намагається його поцілувати, і Лукас не стримуючи себе грубить дівчинці. «Покинута» Клара придумує і здійснює блискучий план помсти вихователю. На те, що доводиться пережити Лукасу, емоційно дивитися важко. І навіть після визнання його невинності в суді, суспільство продовжує жорстоке полювання на вигнанця ..."
    }
]

export default function MovieCard({ film, hide_details_other_card, extanded, visible, card_index }) {
    function toggleExtanded() {
        hide_details_other_card(card_index)
    }

    return (
        <AnimatePresence mode="wait">
        {visible && (
            <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: extanded ? "100%" : "50%", transition: { duration: 0.7 } }}
                exit={{ opacity: 0, width: 0, transition: { duration: 0.7 } }}
                className="flex text-amber-100 my-4 overflow-x-hidden"
                key={card_index}>
                <div onClick={(e) => toggleExtanded()} className="bg-[#585858d3] flex justify-center items-center cursor-pointer duration-300 hover:bg-amber-700">
                    <motion.img 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.15 } }}
                        exit={{ opacity: 0, transition: { duration: 0.1 } }} 
                        src={film.src_poster} alt="poster" className="max-h-[70lvh] m-4 shadow-xl rounded-md shadow-black" />
                </div>
                <div style={{ fontFamily: "var(--font-cormorant)" }} className="flex flex-col bg-[#38383862]">
                    <h1 className="m-3 text-3xl">{film.uk_name}</h1>
                    <h1 className="text-xl mx-3 my-0.5 italic text-amber-200">{film.en_name}</h1>
                    <div className="flex mx-3 my-0.5 items-center">
                        <h1 className="font-bold text-2xl">{film.age_limit}</h1>
                        {film.genres.map((genre, index) => <h1 key={index} className="font-bold text-xl ml-2">{`${genre.toLowerCase()}${index !== film.genres.length-1 ? "," : ""}`}</h1>)}
                    </div>
                    <h1 className="text-xl mx-3 my-0.5 text-amber-200">{film.release_year}</h1>
                    <div className="flex items-center mx-3">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" className="max-h-5" />
                        <h1 className="text-xl mx-3 my-1 text-amber-200">{film.rating.imdb}</h1>
                    </div>
                </div>
                {extanded && (
                    <motion.div
                        className="bg-[#7070705e] p-3"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0, transition: { duration: 0.75, delay: 0.25 } }}
                        exit={{ opacity: 0, x: 100, transition: { duration: 0.25 } }}>
                        TEXT
                    </motion.div>
                )}
            </motion.div>
        )}
        </AnimatePresence>
    )
}