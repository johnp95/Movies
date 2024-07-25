import { useState, useEffect } from "react";
import MovieItem from "./MovieItem";

const url = import.meta.env.VITE_API_BASE_URL_LOCAL + `api/movies/`;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="flex justify-center mt-8">
            <ul className="flex space-x-2">
                <li>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md ${
                            currentPage === 1
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                    >
                        Prev
                    </button>
                </li>
                {pageNumbers.map((number) => (
                    <li key={number}>
                        <button
                            onClick={() => onPageChange(number)}
                            className={`px-3 py-1 rounded-md ${
                                currentPage === number
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            {number}
                        </button>
                    </li>
                ))}
                <li>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md ${
                            currentPage === totalPages
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

const ForeignFilms = () => {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 10; // Adjust as needed

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await fetch(`${url}`);
                const data = await res.json();
                setMovies(data.filter((movie) => movie.language));
            } catch (error) {
                console.log("Error fetching data", error);
            }
        };
        fetchMovie();
    }, []);

    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mx-auto">
            <div className="flex flex-wrap justify-center">
                {currentMovies.map((movie) => (
                    <MovieItem key={movie.id} movie={movie} />
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(movies.length / moviesPerPage)}
                onPageChange={handlePageChange}
            />
        </div>
    );
};
export default ForeignFilms;
