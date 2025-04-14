import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const HEAD_TEXT = "Хто ми?"
const WE_ARE = "Ми -"
const CHANGE_WHO_WE_ARE_TIMEOUT = 5000
const WHO_WHE_ARE_STATES = [
    {
        message: "гаранти якості та комфорту",
        details: "Наше обслуговування - завдаток статусу та престижності. Наш відвідувач не шукатиме прихисток в очікуванні сеансу. Наш відвідувач - актор вишуканості, свідок аристократизму нової доби.",
        photo: "/images/2025-04-09_20.19.38.png",
        background: "/images/2025-04-09_20.19.55.png"
    },
    {
        message: "кращі в регіоні",
        details: "Посеред усіх навколишніх земель, наш заклад гордо забезпечує культурну винятковість, во істину, унікального села.",
        photo: "/images/2025-04-09_20.27.11.png",
        background: "/images/2025-01-03_18.31.46.png"
    },
    {
        message: "провідники в архів епох та мозаїк часу",
        details: "Так як ми не купуємо ліцензії на фільми, у нас ви зустрінете все: індусів, бойовики 90-х, останні піратські новинки.",
        photo: "https://i.ytimg.com/vi/_ktd1usuRBA/mqdefault.jpg",
        background: "/images/2025-04-09_20.20.50.png"
    }
]

function AnimatedBlock({current_state}) {
    return (
        <div    className="bg-cover bg-center"
                style={{ backgroundImage: `url(${current_state.background})` }}>
            <AnimatePresence mode="wait">
                <motion.div key={JSON.stringify(current_state)}
                            className="flex flex-col justify-center lg:items-start items-center lg:flex-row lg:px-32 px-3 py-4 overflow-hidden"
                            initial={{ backdropFilter: "blur(100px)" }}
                            animate={{ backdropFilter: "blur(4px)", transition: { duration: 0.7, ease: "easeOut" } }}
                            exit={{ backdropFilter: "blur(100px)", transition: { duration: 0.1, ease: "easeIn" } }}>
                    <div className="flex-1/2 flex flex-col">
                        <div className="flex whitespace-nowrap"
                            style={{fontFamily: "var(--font-pt-mono)"}}>
                            {WE_ARE}
                                <motion.h1
                                    initial={{ clipPath: "inset(0 100% 0 0)" }}
                                    animate={{ clipPath: "inset(0 0% 0 0)", transition: { duration: 0.75, delay: 0.5, ease: "easeInOut" } }}
                                    exit={{ clipPath: "inset(0 100% 0 0)", transition: { duration: 0.25, ease: "easeOut" } }}
                                    key={current_state.message}
                                    className="overflow-hidden ml-2 font-bold"
                                >
                                    {current_state.message}
                                </motion.h1>
                        </div>
                        <motion.div
                                className="text-xl bg-[#0000008e] p-3 rounded-md mt-4"
                                style={{fontFamily: "var(--font-cormorant)"}}
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0, transition: { duration: 0.75, delay: 0.25 } }}
                                exit={{ opacity: 0, x: 100, transition: { duration: 0.25 } }}
                                key={current_state.details}>
                            {current_state.details}
                        </motion.div>
                    </div>
                    <motion.div className="flex-1/2 rounded-md lg:ml-10 lg:mt-0 mt-5"
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0, transition: { duration: 0.75, delay: 0.25 } }}
                                exit={{ opacity: 0, x: 100, transition: { duration: 0.25 } }}
                                key={current_state.photo}
                        >
                        <img src={current_state.photo} alt="fuck" className="rounded-md shadow-black shadow-xl lg:h-[20lvw] md:max-h-[20lvw]" />
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default function AboutUs() {
    const [intr, setIntr] = useState();
    const [whoWeAre, setWhoWeAre] = useState(0);

    useEffect(() => {
        setIntr(setInterval(() => {
            setWhoWeAre(prev => prev + 1 === WHO_WHE_ARE_STATES.length ? 0 : prev + 1)
        }, CHANGE_WHO_WE_ARE_TIMEOUT))
        return () => {
            clearInterval(intr)
            setIntr(null)
        }
    }, [])

    return (
        <div className="flex flex-col mt-4 text-amber-100">
            <nav className="bg-[#131313f3] flex justify-center">
                <h1 className="text-2xl hover:bg-gray-900 px-4 duration-700 rounded-md" style={{fontFamily: "var(--font-pt-mono)"}}>{HEAD_TEXT}</h1>
            </nav>
            
            <AnimatedBlock current_state={WHO_WHE_ARE_STATES[whoWeAre]} />
        </div>
    )
}