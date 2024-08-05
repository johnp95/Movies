import Search from "./Search";
import { useState, useRef, useEffect } from "react";
import MovieList from "./MovieList";
import Container from "./Container";
import InnerContainer from "./InnerContainer";
import Pagination from "@mui/material/Pagination";

const SearchComponent = () => {
    const [movies, setMovies] = useState([]);
    const [displayedMovies, setDisplayedMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortMethod, setSortMethod] = useState("recent");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const cardsPerPage = 10;

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleSortSelect = (method) => {
        setSortMethod(method);
        setIsDropdownOpen(false);
        sortMovies(method);
    };

    const sortMovies = (method) => {
        let sortedMovies = [];
        switch (method) {
            case "recent":
                sortedMovies = [...movies].sort(
                    (a, b) =>
                        new Date(b.date_watched) - new Date(a.date_watched)
                );
                break;
            case "oldest":
                const moviesByYear = movies.reduce((acc, movie) => {
                    if (
                        !acc[movie.released] ||
                        movie.id < acc[movie.released].id
                    ) {
                        acc[movie.released] = movie;
                    }
                    return acc;
                }, {});
                sortedMovies = Object.values(moviesByYear).sort(
                    (a, b) => a.released - b.released
                );
                break;
            case "newest":
                sortedMovies = [...movies].sort(
                    (a, b) => b.released - a.released
                );
                break;
            default:
                sortedMovies = [...movies];
        }
        setDisplayedMovies(sortedMovies);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        sortMovies(sortMethod);
    }, [movies]);

    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const currentCards = displayedMovies.slice(startIndex, endIndex);

    return (
        <div className="relative">
            <div className="absolute top-0 right-0 z-10" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Sort By
                </button>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                        >
                            <button
                                onClick={() => handleSortSelect("recent")}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                            >
                                Recently Watched
                            </button>
                            <button
                                onClick={() => handleSortSelect("oldest")}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                            >
                                Oldest
                            </button>
                            <button
                                onClick={() => handleSortSelect("newest")}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                            >
                                Newest
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Search setMovieData={setMovies} setLoading={setLoading} />
            <Container>
                <InnerContainer>
                    <MovieList loading={loading} movies={currentCards} />
                </InnerContainer>
            </Container>
            <div className="flex items-center justify-center m-0">
                <Pagination
                    size="large"
                    count={Math.ceil(displayedMovies.length / cardsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </div>
        </div>
    );
};

export default SearchComponent;
