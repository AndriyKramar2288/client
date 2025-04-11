import { useState } from "react";
import MovieCard from "./MovieCard";

export default function MovieList({ list }) {

    const [cardDetailsVisible, setCardDetailsVisible] = useState(-1)

    function hide_details_other_card(index) {
        if (cardDetailsVisible === index) {
            setCardDetailsVisible(-1)
        }
        else {
            setCardDetailsVisible(index)
        }
    }

    return (
        <div className="flex flex-wrap justify-around p-10">
            {list.map((film, index) => (
                <MovieCard  film={film} 
                            hide_details_other_card={hide_details_other_card}
                            extanded={cardDetailsVisible === index}
                            card_index={index}
                            visible={!(index % 2 ? cardDetailsVisible + 1 === index : cardDetailsVisible - 1 === index)}
                            key={index} />
            ))}
        </div>
    )
}
