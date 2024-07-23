import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MovieItem from "./MovieItem";

const ActressDetail = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [moviesPerPage] = useState(10);
    const { id: actress } = useParams();
    const url = "http://127.0.0.1:8000/api/movies/actress";

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await fetch(`${url}?actress=${actress}`);
                const data = await res.json();
                setMovies(data);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [actress]);

    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">
                {actress} Movies Seen: {movies.length}
            </h1>
            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {currentMovies.map((movie) => (
                            <MovieItem key={movie.id} movie={movie} />
                        ))}
                    </div>
                    <Pagination
                        moviesPerPage={moviesPerPage}
                        totalMovies={movies.length}
                        paginate={paginate}
                        currentPage={currentPage}
                    />
                </>
            )}
        </div>
    );
};

const Pagination = ({ moviesPerPage, totalMovies, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalMovies / moviesPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="mt-8">
            <ul className="flex justify-center space-x-2">
                {pageNumbers.map((number) => (
                    <li key={number}>
                        <button
                            onClick={() => paginate(number)}
                            className={`px-3 py-2 rounded-md focus:outline-none ${
                                currentPage === number
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default ActressDetail;
