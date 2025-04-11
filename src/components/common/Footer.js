import Link from "next/link"

const CONTACTS = "Контакти"
const LINKS = "Посилання"
const RIGHTS_IS_UNDER_DEFENCE = "© ВСІ ПРАВА ЗАХИЩЕНО ©"

const ITEMS_DATA = [
    {
        first: "Адреса",
        last: "Minecraft Java Edition 1.16.5, UAPolit, м. Великая Точка, сел. Беззаперечна_^, при в'їзді - перша дорога наліво"
    },
    {
        first: "Електронна скринька",
        last: "aboba@gmail.com"
    },
    {
        first: "Час роботи",
        last: "майже ніколи"
    }
]

const LINKS_DATA = [
    {
        text: "DISCORD",
        icon_class: "fa-brands fa-discord",
        url: "https://discord.gg/EDks4xYPz5"
    },
    {
        text: "YOUTUBE",
        icon_class: "fa-brands fa-square-youtube",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
        text: "TWITTER",
        icon_class: "fa-brands fa-square-twitter",
        url: "https://x.com/elonmusk"
    },
    {
        text: "TELEGRAM",
        icon_class: "fa-brands fa-telegram",
        url: "http://t.me/smak_media"
    }
]

function FooterListItem({first, last}) {
    return (
        <li className="flex items-center mb-3">
            <i className="fa-regular fa-circle mr-2 text-xs"></i>
            <span className="font-extrabold mr-2">{first}:</span>
            {last}
        </li>
    )
}

function FooterLinkItem({text, icon_class, url}) {
    return (
        <Link href={url} className="text-2xl hover:bg-[#000000] duration-300 rounded-md p-2 mx-1 flex-2/6 flex justify-center">
            <i className={`${icon_class} mr-2`}></i>
            {text}
        </Link>
    )
}

function FooterSection({children, icon_class, text}) {
    return (
        <section className="bg-[#181818] rounded-md px-4 py-10 mx-3 flex flex-col items-center flex-1/2" style={{ fontFamily: "var(--font-pt-mono)" }}>
            <div className="flex items-center mb-3 font-semibold">
                <i className={`${icon_class} mr-2`}></i>
                <h1 className="text-center">{text}</h1>
            </div>
            {children}
        </section>
    )
}

export default function Footer() {
    return (
        <footer className="bg-[#131313f3] text-white">
            <div className="flex">
                <FooterSection text={CONTACTS} icon_class={"fa-regular fa-address-book"}>
                    <ul>
                        {ITEMS_DATA.map((element, key) => <FooterListItem first={element.first} last={element.last} key={key} />)}
                    </ul>
                </FooterSection>
                <FooterSection text={LINKS} icon_class={"fa-regular fa-star"}>
                    <div className="flex flex-wrap justify-around">
                        {LINKS_DATA.map((element, key) => <FooterLinkItem text={element.text} url={element.url} icon_class={element.icon_class} key={key} />)}
                    </div>
                </FooterSection>
            </div>
            <h1 style={{ fontFamily: "var(--font-greate-vibes)" }} className="py-10 bg-[#292929] text-shadow-lg/90 text-shadow-black text-center text-2xl font-bold tracking-widest">
                {RIGHTS_IS_UNDER_DEFENCE}
            </h1>
        </footer>
    )
}