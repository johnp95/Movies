import { useState, useEffect } from "react";
import MovieItem from "./MovieItem";

const url = import.meta.env.VITE_API_BASE_URL_LOCAL + `api/movies/`;

const OldestFilms = () => {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 10; // Adjust the number of movies per page as needed

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

    // Pagination logic
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = uniqueMovies.slice(indexOfFirstMovie, indexOfLastMovie);

    const totalPages = Math.ceil(uniqueMovies.length / moviesPerPage);

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="container mx-auto">
            <div className="flex flex-wrap justify-center">
                {currentMovies.map((movie) => (
                    <MovieItem key={movie.id} movie={movie} />
                ))}
            </div>
            <div className="flex justify-center mt-4">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 mx-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default OldestFilms;
