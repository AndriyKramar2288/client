"use client"

import { useRouter } from "next/navigation"
import { useMainContext } from "../contexts/MainContext"

function HeaderButtonDecoration() {
    return (
        <div className="h-6 w-0 group-hover:pr-3.5 duration-300 bg-amber-300" />
    )
}

function HeaderButton({ iconClass, text, clickHandler }) {
    return (
        <div className="group flex items-center">
            <HeaderButtonDecoration />
            <button className="text-2xl bg-amber-700 p-4 cursor-pointer mx-3.5 group-hover:mx-0 hover:bg-amber-800 duration-300 font-(family-name:--font-pt-mono) text-amber-200"
                    onClick={clickHandler}
            >
                <i className={`${iconClass} mr-3`}></i>
                {text}
            </button>
            <HeaderButtonDecoration />
        </div>
    )
}

function HeaderSign({ text }) {
    return (
        <h1 className="text-2xl bg-amber-600 p-4 mx-3.5 group-hover:mx-0 hover:bg-orange-600 rounded-xl duration-700 font-(family-name:--font-pt-mono) text-amber-200">
            {text}
        </h1>
    )
}

export default function Header({ headText }) {
    const {user} = useMainContext()
    const route = useRouter()

    return (
        <header className="">
            <nav className="flex bg-amber-600 justify-around">
                <HeaderButton iconClass={"fa-regular fa-compass"} text={"Головна"} clickHandler={() => route.push("/")} />
                {/* {user && <HeaderButton iconClass={"fa-regular fa-calendar"} text={"Заброньовані сеанси"} />} */}
                <HeaderSign text={headText} />
                <HeaderButton iconClass={"fa-regular fa-user"} text={"Увійти"} />
            </nav>
        </header>
    )
}