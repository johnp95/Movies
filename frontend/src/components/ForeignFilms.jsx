import { useState, useEffect } from "react";
import MovieItem from "./MovieItem";
import PageControls from "./PageControls";
import usePagination from "../hooks/usePagination";
import { API_BASE_URL } from "../config";

const url = API_BASE_URL + `api/movies/foreign-films`;

const ForeignFilms = () => {
    const [movies, setMovies] = useState([]);
    const moviesPerPage = 10;

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

    const {
        currentItems: currentMovies,
        page,
        totalPages,
        handlePageChange,
    } = usePagination(movies, moviesPerPage);

    return (
        <div className="container mx-auto">
            <div className="flex flex-wrap justify-center">
                {currentMovies.map((movie) => (
                    <MovieItem key={movie.id} movie={movie} />
                ))}
            </div>
            <PageControls
                page={page}
                totalPages={totalPages}
                onChange={handlePageChange}
            />
        </div>
    );
};
export default ForeignFilms;
