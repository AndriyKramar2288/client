"use client"

import { useEffect, useState } from "react"
import { alertSmth, BACKEND_API_URL, TOKEN_LOCAL_STORAGE } from "../services/nonComponents"
import BookingList from "./BookingList"

const INTERNET_ERROR = "Помилка!"

export default function WorkerPanel({ initBookings }) {

    const [sessionAvailableInfos, setSessionAvailableInfos] = useState()

    async function initWorkerBookings() {
        try {
            const result = await fetch(`${BACKEND_API_URL}/session/available_worker`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN_LOCAL_STORAGE)}`
                }
            })
            if (result.ok) {
                const data = await result.json()
                setSessionAvailableInfos(data)
            }
            else {
                throw new Error(await result.text())
            }
        }
        catch (err) {
            alertSmth(JSON.parse(err).message ?? INTERNET_ERROR)
        }
    }

    useEffect(() => {
        initWorkerBookings()
    }, [])

    useEffect(() => {
        console.log(sessionAvailableInfos)
    }, [sessionAvailableInfos])

    return (
        <div>
            <BookingList full sessionInfos={sessionAvailableInfos} setSessionInfos={setSessionAvailableInfos} initBookings={initBookings} />
        </div>
    )
}