"use client"

import { useEffect } from "react"
import { range } from "../nonComponents"

function Sit({number}) {
    return (
        <div className="bg-amber-800 hover:bg-amber-900 duration-100 ease-in text-lg text-white flex justify-center items-center"
             style={{ gridArea: `s${number}` }}>

            <i className="fa-solid fa-couch"></i>
        </div>
    )
}

function Block({ changedName }) {
    const settingsName = changedName.replace("__", "").replace("_", "")

    return (
        <div className="w-full h-full" style={{ gridArea: changedName, backdropFilter: `brightness(${BLOCK_SETTINGS[settingsName]}%)` }} />
    )
}

const TV_SRC = "https://media.discordapp.net/attachments/723480661390000210/1360687106992898141/ewwqweqwqwewqe.jpg?ex=67fc061e&is=67fab49e&hm=1b8e18aaa79702259d38205475f2e476ebe3f81f03c157adb1c341763a5bbbda&=&format=webp&width=196&height=928"
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

export default function CinemaHall({ setChoosedSit, movieSession }) {
    return (
        <div className="grid grid-rows-6 grid-cols-12 bg-cover bg-center min-h-[40vh] m-5"
             style={{ gridTemplateAreas: CINEMA_AREA }}>
            <div className="bg-cover" style={{ gridArea: "sc", backgroundImage: `url(${TV_SRC})` }} />
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
                <Sit number={element} key={key} />
            ))}
        </div>
    )
}