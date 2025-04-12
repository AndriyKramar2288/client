import { motion } from "framer-motion"

const IMDB_SVG_SRC = "https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
export default function FilmSmallCard({ film }) {
  return (
    <motion.div initial={{ opacity: 0, marginTop: 0 }}
                animate={{ opacity: 1, x: 0,  marginTop: "calc(var(--spacing) * 24)" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col bg-cover bg-center text-white" 
                style={{ backgroundImage: `url(${film.src_poster})` }}>
      <div style={{ fontFamily: "var(--font-cormorant)" }} className="flex flex-col bg-[#ffffff20] backdrop-blur-xs">
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
      </div>
    </motion.div>
  )
}