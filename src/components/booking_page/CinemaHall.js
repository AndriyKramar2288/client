"use client"

import { range } from "../services/nonComponents"
import { AnimatePresence, motion } from "framer-motion"

const BLOCK_SETTINGS = {
    "f0": "40",
    "f1": "50",
    "f2": "60",
    "f3": "70",
    "f4": "80",
}

const CINEMA_AREA = `
    'sc f1 f1 f_2 f_2 f_2 s1 f__3 s2 s3 f__4 s4'
    'sc f1 f1 f_2 f_2 f_2 s5 f__3 s6 s7 f__4 s8'
    'sc f1 f1 f0 f0 f0 f3 f3 f3 f4 f4 f4'
    'sc f1 f1 f0 f0 f0 f3 f3 f3 f4 f4 f4'
    'sc f1 f1 f2 f2 f2 s9 f_3 s10 s11 f_4 s12'
    'sc f1 f1 f2 f2 f2 s13 f_3 s14 s15 f_4 s16'
`

const CHOOSED_SITS_COUNT = "Обрано місць"
const CURRENT_PRICE = "Поточна ціна"
const CURRENCY = "₴"
const GO_NEXT_TEXT = "ПЕРЕЙТИ ДАЛІ"
const HALL_NAME = "Зала"

function Sit({number, setChoosedSits, choosedSits, available }) {

    function isChoosed() {
        return choosedSits.includes(number)
    }

    function clickHandler(e) {
        if (available && !isChoosed()) {
            setChoosedSits(prev => [...prev, number])
        }
        else if (isChoosed()) {
            setChoosedSits(prev => prev.filter(elm => elm !== number))
        }
    }

    return (
        <div className={`group duration-100 ease-in text-lg text-white flex justify-center items-center p-3
                ${available && !isChoosed() ? "bg-green-800 hover:bg-green-900 cursor-pointer" : 
                  !available ? "bg-red-700" : "bg-blue-700 cursor-pointer hover:bg-blue-800"
                }
            `}
             style={{ gridArea: `s${number}` }}
             onClick={clickHandler}>
             <span className={`absolute text-xs lg:-translate-y-4 -translate-y-3 font-bold text-gray-200 duration-200 
                               ${available && !isChoosed() ? "opacity-0 group-hover:opacity-100" : ""}
                             `}>
                {number}
            </span>
            <i className="fa-solid fa-couch lg:text-lg text-xs"></i>
        </div>
    )
}

function Block({ changedName }) {
    const settingsName = changedName.replace("__", "").replace("_", "")

    return (
        <div className="w-full h-full" style={{ gridArea: changedName, backdropFilter: `brightness(${BLOCK_SETTINGS[settingsName]}%)` }} />
    )
}

function AnimatedListItem({ first, last }) {
    return (
        <li className="flex">
            {first}:
            <AnimatePresence mode="wait">
                <motion.span
                    key={last}
                    className="text-white ml-2 font-semibold"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.1 }}>
                    {last}
                </motion.span>
            </AnimatePresence>
        </li>
    )
}

export default function CinemaHall({ setChoosedSits, choosedSits, movieSession, goNext }) {
    return (
        <section>
            <div className="flex justify-between lg:flex-row flex-col items-center text-white px-3">
                <ul className="mb-5">
                    <AnimatedListItem first={CHOOSED_SITS_COUNT} last={choosedSits.length} />
                    <AnimatedListItem first={CURRENT_PRICE} last={`${choosedSits.length * movieSession.price_per_sit}${CURRENCY}`} />
                    <AnimatedListItem first={HALL_NAME} last={movieSession.hall_data.name} />
                </ul>
                <AnimatePresence mode="wait">
                    {choosedSits.length > 0 && (
                        <motion.button 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="py-2 px-4 rounded-md bg-yellow-600 hover:bg-yellow-400 duration-200 cursor-pointer" onClick={goNext}>
                            {GO_NEXT_TEXT}
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            <div className="grid grid-rows-6 grid-cols-12 lg:min-h-[40vh] m-5"
                style={{ gridTemplateAreas: CINEMA_AREA }}>
                <div className="bg-gray-600 flex justify-center items-center" style={{ gridArea: "sc" }}>
                    <i className="fa-solid fa-tv text-white sm:text-2xl texl-lg"></i>
                </div>
                <Block changedName={"f0"} />
                <Block changedName={"f1"} />
                <Block changedName={"f2"} />
                <Block changedName={"f_2"} />
                <Block changedName={"f3"} />
                <Block changedName={"f_3"} />
                <Block changedName={"f__3"} />
                <Block changedName={"f4"} />
                <Block changedName={"f_4"} />
                <Block changedName={"f__4"} />

                {range(1, 17).map((element, key) => (
                    <Sit number={element}
                        key={key}
                        setChoosedSits={setChoosedSits}
                        available={!movieSession.bookings.map(e => e.sit).includes(element)} 
                        choosedSits={choosedSits} />
                ))}
            </div>
        </section>
    )
}