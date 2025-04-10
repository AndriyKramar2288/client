"use client";

import { motion } from "framer-motion"


function Sides() {
    return (
        <motion.div 
        initial={{ backgroundColor: "black" }}
        animate={{ backgroundColor: "var(--color-amber-600)" }}
        className="flex-1 transition-all duration-300 ease-out"
        ></motion.div>
    )
}

export default function Introduction() {
    const IMAGE_SRC = "/images/2025-04-09_20.35.47.png"
    const FILM_STRIP_SRC = "/images/tikigiki_filmstrip-01.svg"
    const LOGO_PART1 = "Undisputed"
    const LOGO_PART2 = "canvas"

    return (
        <div style={{ backgroundImage: `url(${IMAGE_SRC})` }} className="min-h-lvh flex justify-center items-stretch flex-col w-full">
            <Sides />
            <motion.div
                initial={{ opacity: 1, minHeight: "0lvh" }}
                animate={{ opacity: 1, minHeight: "100lvh" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="backdrop-blur-xs backdrop-sepia-50 flex justify-center items-center">
                <motion.div className="scrolling-background flex items-center justify-center w-full text-5xl text-white"
                            style={{ backgroundImage: `url(${FILM_STRIP_SRC})` }}>
                    <motion.div className="p-10 w-[444px] text-[#FFDD55] flex items-center justify-center shadow-2xl"
                                initial={{ background: "rgb(14,14,14)",
                                           background: "linear-gradient(90deg, rgba(14,14,14,0.7) 0%, rgba(14,14,14,0.7) 100%)" }}
                                animate={{ background: "rgb(43,25,9)",
                                           background: "linear-gradient(90deg, rgba(43,25,9,0) 0%, rgba(14,14,14,0.7) 50%)" }}
                                transition={{ duration: 0.3 }}
                                style={{ fontFamily: "var(--font-dancing)" }}>
                        {LOGO_PART1}
                    </motion.div>
                    <motion.div className="p-7 bg-[#FFDD55] text-gray-950 flex items-center justify-center text-7xl shadow-2xl" 
                                initial={{ width: "0", opacity: 0 }} 
                                animate={{ width: "444px", opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                style={{ fontFamily: "var(--font-big-shoulders)" }}
                                >
                        {LOGO_PART2}
                    </motion.div>
                </motion.div>
            </motion.div>
            <Sides />
        </div>
    )
}