"use client"

import Header from "@/components/common/Header";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion"
import FilmSmallCard from "@/components/booking_page/FilmSmallCard";
import SessionList from "@/components/booking_page/SessionList";
import CinemaHall from "@/components/booking_page/CinemaHall";
import ViewerDataInput from "@/components/booking_page/ViewerDataInput";
import { useParams, useRouter } from "next/navigation";
import { alertSmth, BACKEND_API_URL } from "@/components/services/nonComponents";

const BOOKING_A_MOVIE = "Бронювання квитка"
const FILM_DOESNT_HAVE_FREE_SESSIONS = "Бронювання квитків на цей фільм недоступне!"
const BG_URL = "/images/2025-04-09_20.20.09.png"

const BOOKING_FILM_DATA = {
  id: 6,
  uk_name: "Полювання6",
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

const BOOKING_SESSIONS = [
  {
    id: 1212,
    film_id: 6,
    date: "2025-04-10T14:30:00Z",
    format: "2D",
    price_per_sit: 200,
    hall_data: {
      hall_id: 13141,
      hall_name: "Головна зала",
      occupiedPlaces: [
        {
          booking_id: 13141,
          place: 6
        },
        {
          booking_id: 11,
          place: 7
        }
      ]
    }
  },
  {
    id: 1311,
    film_id: 6,
    date: "2025-04-11T14:30:00Z",
    format: "2D",
    price_per_sit: 100,
    hall_data: {
      hall_id: 13141,
      hall_name: "Головна зала",
      occupiedPlaces: [
        {
          booking_id: 13141,
          place: 11
        },
        {
          booking_id: 11,
          place: 2
        }
      ]
    }
  }
]

function NavigationPanelElement({ text, myLevel, currentLevel, setCurrentLevel, success, available }) {
  function getStateClasses() {
    if (!available) {
      return "bg-gray-600"
    }
    else if (myLevel === currentLevel) {
      return "bg-gray-300"
    }
    else if (success) {
      return "bg-green-700 hover:bg-green-800 cursor-pointer"
    }
    else {
      return "bg-red-800 hover:bg-red-900 cursor-pointer"
    }
  }

  return (
    <motion.button
      onClick={available ? () => setCurrentLevel(myLevel) : () => {}} 
      className={`${getStateClasses()} text-white duration-300 rounded-md text-xl font-bold text-center flex-1/3 px-2 py-1`}
      style={{ fontFamily: "var(--font-pt-mono)" }}>
      {text}
    </motion.button>
  )
}

function NavigationPanelArrow() {
  return (
    <i className="fa-solid fa-angles-right text-white m-2"></i>
  )
}

export default function Home() {
  const router = useRouter()
  const { film_id } = useParams()

  const [ bookingFilm, setBookingFilm] = useState()
  const [ movieSessionList, setMovieSessionList ] = useState([])

  const [ currentLevel, setCurrentLevel ] = useState(1)

  const [ choosedSession, setChoosedSession ] = useState()
  const [ choosedSits, setChoosedSits ] = useState([])
  const [ choosedViewerData, setChoosedViewerData ] = useState({})

  useEffect(() => {
    if (choosedSession) {
      setChoosedSits(prev => [])
      setChoosedViewerData(prev => ({}))
      setCurrentLevel(prev => prev + 1)
    }
  }, [choosedSession])

  useEffect(() => {
    fetchFilms()
  }, [])

  async function fetchFilms() {
      try {
          const response = await fetch(`${BACKEND_API_URL}/session/available`)

          if (!response.ok) {
              throw new Error("LOL")
          }

          const sessions = await response.json()

          const ourSessions = sessions.filter(f => `${f.film.id}` === film_id)

          if (ourSessions.length === 0) {
            alertSmth(FILM_DOESNT_HAVE_FREE_SESSIONS)
            router.push("/")
            return
          }

          setBookingFilm(ourSessions[0].film)
          setMovieSessionList(ourSessions)

      } catch (err) {
          alertSmth(err.message)
      }
  }

  return (
    <div className="bg-center bg-cover bg-fixed" style={{ backgroundImage: `url(${BG_URL})` }}>
      <div className="backdrop-blur-xs backdrop-contrast-100 backdrop-sepia-50 backdrop-grayscale-25 lg:min-h-screen flex flex-col">
        <Header headText={BOOKING_A_MOVIE} />

        <motion.main 
          initial={{ flexGrow: 0 }}
          animate={{ flexGrow: 1, transition: { duration: 0.4 } }}
          className="flex flex-col-reverse lg:flex-row justify-evenly items-stretch mx-16 lg:mx-48">
          <div className="lg:flex-3/4 lg:p-10">

            <nav className="bg-[#5e5e5e29] rounded-md flex justify-between items-center">
              <NavigationPanelElement text={"СЕАНС"} myLevel={1} currentLevel={currentLevel} available={true} setCurrentLevel={setCurrentLevel} success={choosedSession} />
              <NavigationPanelArrow />
              <NavigationPanelElement text={"МІСЦЕ"} myLevel={2} currentLevel={currentLevel} available={choosedSession} setCurrentLevel={setCurrentLevel} success={choosedSits.length} />
              <NavigationPanelArrow />
              <NavigationPanelElement text={"ДАНІ"} myLevel={3} currentLevel={currentLevel} available={choosedSits.length} setCurrentLevel={setCurrentLevel} success={false} />
            </nav>

            <AnimatePresence mode="wait">
              <motion.section
                key={currentLevel}
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 60 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ fontFamily: "var(--font-pt-mono)" }} 
                className="p-3 bg-[#4a291295] my-5 rounded-md">
                  {currentLevel === 1 && <SessionList sessions={movieSessionList} setSession={setChoosedSession} currentSession={choosedSession} />}
                  {currentLevel === 2 && <CinemaHall movieSession={choosedSession} setChoosedSits={setChoosedSits} choosedSits={choosedSits} goNext={() => setCurrentLevel(pr => pr + 1)} />}
                  {currentLevel === 3 && <ViewerDataInput choosedViewerData={choosedViewerData} setChoosedViewerData={setChoosedViewerData} choosedSits={choosedSits} currentSession={choosedSession} />}
              </motion.section>
            </AnimatePresence>
          </div>
          <div className="lg:flex-1/4 lg:bg-[#251f1979]">
              {bookingFilm && <FilmSmallCard film={bookingFilm} />}
          </div>
        </motion.main>
      </div>
    </div>
  );
}