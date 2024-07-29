import { useState, useEffect } from "react";
import MovieItem from "./MovieItem";

const url = import.meta.env.VITE_API_BASE_URL_LOCAL + `api/movies/`;

const ForeignFilms = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await fetch(`${url}`);
                const data = await res.json();
                setMovies(data);
            } catch (error) {
                console.log("Error fetching data", error);
            }
        };
        fetchMovie();
    }, []);

    let myMovies = movies.sort((a, b) => a.released - b.released);
    const seenTitles = new Set();
    const uniqueMovies = myMovies.filter((movie) => {
        if (seenTitles.has(movie.title)) {
            return false;
        } else {
            seenTitles.add(movie.title);
            return true;
        }
    });

    return (
        <div className="container mx-auto">
            <div className="flex flex-wrap justify-center">
                {uniqueMovies.map((movie) => (
                    <MovieItem key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};
export default ForeignFilms;
