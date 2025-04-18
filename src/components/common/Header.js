"use client"

import { useRouter } from "next/navigation"
import { useMainContext } from "../contexts/MainContext"
import { useEffect } from "react"
import { alertSmth, BACKEND_API_URL, GOOGLE_CLIENT_ID, logout, successSmth, TOKEN_LOCAL_STORAGE } from "../services/nonComponents"
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"

const USER_LOADING_ERROR = "Непередбачувана помилка завантаження користувача!"
const MAIN_PAGE = "Головна"
const SUCCESS_LOGIN = "Автентифікація через Google успішна!"
const PROFILE_PAGE = "Профіль"
const SERVER_GG = "Сервер помер... 😭"
const FAILURE_LOGIN = "Непередбачена загадкова помилка!"

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
    const [user, setUser] = useMainContext()
    const router = useRouter()

    async function successGoogleLoginHandler(credentialResponse) {
        console.log(credentialResponse)

        try {
            const api_response = await fetch(`${BACKEND_API_URL}/auth/google_id_token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token: `${credentialResponse.credential}` })
            })
            if (api_response.ok) {
                const data = await api_response.json()
                router.push("/")
                successSmth(SUCCESS_LOGIN)
                setUser(data.cinemaUser)
                localStorage.setItem(TOKEN_LOCAL_STORAGE, data.accessToken)
            }
            else {
                alertSmth(FAILURE_LOGIN)
            }
        }
        catch (error) {
            alertSmth(SERVER_GG)
        }
    }

    async function checkAndUpdateUser() {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE)
        if (token && !user) {
            try {
                const gettedUser = await fetch(`${BACKEND_API_URL}/users/`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                if (gettedUser.ok) {
                    const gettedUserJson = await gettedUser.json()
                    setUser(gettedUserJson)
                }
                else if (gettedUser.status === 401) {
                    logout(setUser, router)
                }
                else {
                    alertSmth(USER_LOADING_ERROR)
                }
            }
            catch (error) {
                alertSmth(SERVER_GG)
            }
        }
        else if (!token && user) {
            alertSmth("wtf maaan")
            logout(setUser, router)
        }
    }

    useEffect(() => {
        checkAndUpdateUser()
    }, [])


    return (
        <header className="">
            <nav className="flex bg-amber-600 justify-around">
                <HeaderButton iconClass={"fa-regular fa-compass"} text={MAIN_PAGE} clickHandler={() => router.push("/")} />
                {/* {user && <HeaderButton iconClass={"fa-regular fa-calendar"} text={"Заброньовані сеанси"} />} */}
                <HeaderSign text={headText} />
                {user ? 
                    <HeaderButton iconClass={"fa-regular fa-user"} text={PROFILE_PAGE} clickHandler={() => router.push("/profile")} /> 
                :   <div className="flex justify-center items-center bg-amber-700 px-3 mx-3.5 hover:bg-amber-800 duration-300 font-(family-name:--font-pt-mono)">
                        <div className="invert-100 cursor-pointer">
                            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                                <GoogleLogin
                                    onError={() => alertSmth(FAILURE_LOGIN)}
                                    onSuccess={response => successGoogleLoginHandler(response)}
                                />
                            </GoogleOAuthProvider>
                        </div>
                    </div>
                }
            </nav>
        </header>
    )
}