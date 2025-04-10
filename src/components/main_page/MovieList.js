import MovieCard from "./MovieCard";

export default function MovieList({ list }) {
    return (
        <div className="flex flex-wrap justify-around">
            {list.map((film, index) => (
                <MovieCard film={film} key={index}/>
            ))}
        </div>
    )
}