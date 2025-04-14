import { motion } from "framer-motion"

const FUTURE_SESSIONS = "Майбутні сеанси"
import { formatUkrainianDate } from "@/components/nonComponents";

const CURRENCY = "₴"
const ONE_TICKET_PRICE = "Вартість квитка"

export default function SessionList({ sessions, setSession, currentSession }) {
    return (
      <div>
        <h1 className="text-lg text-white text-center">{FUTURE_SESSIONS.toUpperCase()}</h1>
        <div className="flex items-center md:flex-wrap flex-col md:flex-row">
          {sessions.map((session, index) => (
          <motion.button
            onClick={() => {
              setSession(session)
            }}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.4, delay: (index + 1) * 0.1 } }}
            className={`${session === currentSession ? "bg-gray-200" : "bg-amber-600 hover:bg-gray-400 cursor-pointer"}
                         p-3 transition-colors duration-300 rounded-xl m-2 flex flex-col items-start
                      `} 
            key={index}>
            <div className="flex flex-col md:flex-row">
              <div className="flex items-center justify-center">
                <i className="fa-solid fa-calendar-days text-white mr-2"></i>
                <span className="mr-2 font-bold">{formatUkrainianDate(session.date)[0]}</span>
              </div>
              <span>{formatUkrainianDate(session.date)[1]}</span>
            </div>
            <div className="flex items-center justify-center">
              {ONE_TICKET_PRICE}: 
              <span className="font-bold ml-3">{session.price_per_sit}{CURRENCY}</span>
            </div>
          </motion.button>
        ))} 
        </div> 
      </div>
    )
  }