import { useState } from "react";
import MovieCard from "./MovieCard";

export default function MovieList({ list }) {

    const [cardDetailsVisible, setCardDetailsVisible] = useState(-1)

    return (
        <div className="flex flex-wrap justify-around p-10 mb-4">
            {list.map((film, index) => (
                <MovieCard  film={film} 
                            card_index={index}
                            cardDetailsVisible={cardDetailsVisible}
                            setCardDetailsVisible={setCardDetailsVisible}
                            key={index} />
            ))}
        </div>
    )
}
