"use client"

import Header from "@/components/common/Header";
import { useMainContext } from "@/components/contexts/MainContext";
import { useRouter } from "next/navigation";

const BG_URL = "/images/2025-04-09_20.36.09.png"
const PROFILE_HEAD = "Профіль"

export default function LoginPage() {

    const router = useRouter();
    const [user, setUser] = useMainContext()

    return (
        <div>
            <Header headText={PROFILE_HEAD.toUpperCase()} />
            <div className="" style={{ backgroundImage: `url(${BG_URL})`, fontFamily: "var(--font-pt-mono)" }}>
                <main className="min-h-screen backdrop-blur-sm backdrop-contrast-150 flex justify-center items-center text-white">
                    <div className="p-3 rounded-md bg-[#74471093] flex flex-col items-center">
                        <nav className="">

                        </nav>
                        <section>

                        </section>
                    </div>
                </main>
            </div>
        </div>
    )
}