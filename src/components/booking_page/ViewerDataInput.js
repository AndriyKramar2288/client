"use client"

import { useEffect, useState } from "react"
import { alertSmth, formatUkrainianDate, isValidEmail, isValidPhoneNumber, successSmth } from "../nonComponents"
import { useRouter } from "next/navigation"

const PUT_YOUR_DATA = "Введіть дані"
const SIT_NUMBER = "Місце"
const FIELD_LIST = [
    {
        "namek": "email",
        "text": "електронна скринька"
    }, 
    {
        "namek": "phone_number",
        "text": "номер телефону"
    }, 
    {
        "namek": "full_name",
        "text": "повне ім'я"
    }
]

const DATE = "Дата"
const FORMAT = "Формат"
const HALL = "Зала"
const BASIC_INFO = "Інформація про сеанс"
const TO_BOOK = "Забронювати"

const FIELD_SIZE = 3
const TOO_SHORT_FIELD_MESSAGE = "Одне зі вказаних значень пусте, або занадто коротке!"
const BAD_EMAIL_MESSAGE = "Одна з вказаних електронних скриньок хибна!"
const BAD_PHONE_NUMBER_MESSAGE = "Один з вказаних номерів телефонів хибний!"
const GOOD_BOOKING_MESSAGE = "Ваші місця успішно заброньовано!"


function InputField({ field, choosedViewerData, setChoosedViewerData, sit }) {
    const [ text, setText ] = useState(choosedViewerData[sit] ? choosedViewerData[sit][field["namek"]] : "")

    useEffect(() => {
        setChoosedViewerData(prev => ({ ...prev, [sit]: {...prev[sit], [field["namek"]] : text }}))
        
    }, [text])

    return (
        <li className="flex items-center justify-between my-1 flex-col sm:flex-row">
            <span>{field["text"].toUpperCase()}:</span>
            <input className="ml-3 bg-amber-900 border-none text-amber-50 p-1 outline-none focus:bg-amber-700 hover:bg-amber-800 duration-200"
                    onChange={(e) => setText(e.target.value)}
                    value={text} />
        </li>
    )
}

function ConfirmButton({ clickHandler, text }) {
    return (
        <div className="group flex m-4 bg-[#cd812f]">
            <div className="w-0 group-hover:pr-3 duration-300 bg-gray-400" />
            <button onClick={clickHandler} style={{ fontFamily: "var(--font-pt-mono)" }} className="text-black font-bold cursor-pointer bg-gray-100 hover:bg-gray-200 duration-300 px-8 group-hover:px-5 py-2 whitespace-nowrap">
                {text}
            </button>
            <div className="w-0 group-hover:pl-3 duration-300 bg-gray-400" />
        </div>
    )
}

function checkSize(data, size) {
    return FIELD_LIST.map(el => el.namek).every(el => Object.entries(data).every(([key, value]) => value[el].trim().length >= size ))
}

function checkEmail(data) {
    return Object.entries(data).every(([key, value]) => isValidEmail(value["email"]) )
}

function checkPhoneNumber(data) {
    return Object.entries(data).every(([key, value]) => isValidPhoneNumber(value["phone_number"]) )
}

export default function ViewerDataInput({ choosedViewerData, setChoosedViewerData, choosedSits, currentSession }) {

    const router = useRouter()

    function confirmBookButtonHandler() {
        const clearViewerData = Object.fromEntries(
            Object.entries(choosedViewerData).filter(([key, value]) => choosedSits.includes(Number(key)))
        )

        if (!checkSize(clearViewerData, FIELD_SIZE)) {
            alertSmth(TOO_SHORT_FIELD_MESSAGE)
            return
        }

        if (!checkEmail(clearViewerData)) {
            alertSmth(BAD_EMAIL_MESSAGE)
            return
        }

        if (!checkPhoneNumber(clearViewerData)) {
            alertSmth(BAD_PHONE_NUMBER_MESSAGE)
            return
        }

        successSmth(GOOD_BOOKING_MESSAGE)
        router.push("/")
    }

    return (
        <div className="text-white flex flex-col-reverse lg:flex-row">
            <div className="lg:flex-2/5 bg-[#42393929] py-2 px-4 m-1 text-sm flex flex-col items-center">
                <h1 className="text-md font-bold my-3 text-center">{BASIC_INFO.toUpperCase()}</h1>
                <ul>
                    <li className="flex items-center mb-2">
                        <i className="fa-solid fa-calendar-days text-white mr-2"></i>
                        <span className="mr-2">{DATE.toUpperCase()}</span>
                        <span className="mr-2 font-bold">{formatUkrainianDate(currentSession.date)[0]}</span>
                        <span>{formatUkrainianDate(currentSession.date)[1]}</span>
                    </li>
                    <li className="flex items-center mb-2">
                        <i className="fa-solid fa-video"></i>
                        <span className="mx-2">{FORMAT.toUpperCase()}:</span>
                        <span className="font-bold">{currentSession.format}</span>
                    </li>
                    <li className="flex items-center">
                        <i className="fa-solid fa-house"></i>
                        <span className="mx-2">{HALL.toUpperCase()}:</span>
                        <span className="font-bold">{currentSession.hall_data.hall_name}</span>
                    </li>
                </ul>
                <ConfirmButton text={TO_BOOK.toUpperCase()} clickHandler={() => confirmBookButtonHandler()} />
            </div>
            <div className="lg:flex-3/5 m-1">
                {choosedSits.map((sit, sit_index) => (
                    <div key={sit_index} className="flex flex-col justify-items-stretch bg-[#6f6f6f29] py-2 px-4 mb-2">
                        <div className="flex justify-between items-center my-3 font-semibold">
                            <h1>
                                {PUT_YOUR_DATA.toUpperCase()}
                            </h1>
                            <h1>
                                {`${SIT_NUMBER.toUpperCase()}: [${sit}]`}
                            </h1>
                        </div>

                        <ul className="flex flex-col justify-between">
                            {FIELD_LIST.map((field, field_index) => (
                                <InputField 
                                    key={field_index}
                                    field={field}
                                    setChoosedViewerData={setChoosedViewerData}
                                    choosedViewerData={choosedViewerData}
                                    sit={sit} />
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}