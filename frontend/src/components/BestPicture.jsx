import { useState, useEffect } from "react";
import { MovieItem } from "./MovieItem";
import styles from "./styles/bestpicture.module.css";

const url = "http://127.0.0.1:8000/api/movies/";

export const BestPicture = () => {
    const [movies, setMovies] = useState([]);
    useEffect(() => {
        const fetchMovie = async () => {
            const res = await fetch(`${url}`);
            const data = await res.json();
            setMovies(data);
        };
        fetchMovie();
    }, []);

    return (
        <div className={styles.cardContainer}>
            {movies.map((movie) =>
                movie.best_picture ? (
                    <MovieItem key={movie.id} movie={movie} />
                ) : (
                    ""
                )
            )}
        </div>
    );
};
