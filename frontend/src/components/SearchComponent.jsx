import Search from "./Search";
import { useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import MovieList from "./MovieList";
import Container from "./Container";
import InnerContainer from "./InnerContainer";
import PageControls from "./PageControls";
import usePagination from "../hooks/usePagination";
import { API_BASE_URL } from "../config";

const url = API_BASE_URL + `api/movies/search`;
const cardsPerPage = 20;

const sortMovies = (movies, method) => {
    switch (method) {
        case "recent":
            return [...movies].sort(
                (a, b) => new Date(b.date_watched) - new Date(a.date_watched),
            );
        case "oldest":
            return [...movies].sort((a, b) => a.released - b.released);
        case "newest":
            return [...movies].sort((a, b) => b.released - a.released);
        default:
            return [...movies];
    }
};

const SearchComponent = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") ?? "";
    const sortMethod = searchParams.get("sort") ?? "recent";

    const [input, setInput] = useState(query);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Merge param changes into the URL; a null/empty value removes the param.
    const updateParams = (updates, options) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            Object.entries(updates).forEach(([key, value]) => {
                if (value == null || value === "") next.delete(key);
                else next.set(key, value);
            });
            return next;
        }, options);
    };

    // Debounce typing, then write the query to the URL and reset to page 1.
    // `replace` keeps each keystroke out of the browser history.
    useEffect(() => {
        if (input === query) return;
        const timeout = setTimeout(() => {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    if (input) next.set("q", input);
                    else next.delete("q");
                    next.delete("page");
                    return next;
                },
                { replace: true },
            );
        }, 300);
        return () => clearTimeout(timeout);
    }, [input, query, setSearchParams]);

    useEffect(() => {
        const controller = new AbortController();
        const fetchMovies = async () => {
            try {
                const res = await fetch(
                    `${url}?query=${encodeURIComponent(query)}`,
                    { signal: controller.signal },
                );
                const data = await res.json();
                setMovies(data);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.log("Error fetching data", error);
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };
        fetchMovies();
        return () => controller.abort();
    }, [query]);

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

    const handleSortSelect = (method) => {
        setIsDropdownOpen(false);
        updateParams({ sort: method === "recent" ? null : method, page: null });
    };

    const displayedMovies = useMemo(
        () => sortMovies(movies, sortMethod),
        [movies, sortMethod],
    );

    const {
        currentItems: currentCards,
        page,
        totalPages,
        handlePageChange,
    } = usePagination(displayedMovies, cardsPerPage);

    return (
        <div>
            {/* Search and sort share a row so the button never covers the input */}
            <div className="flex items-center gap-2 px-4 max-w-2xl mx-auto">
                <div className="flex-1 min-w-0">
                    <Search value={input} onChange={setInput} />
                </div>
                <div className="relative z-10 shrink-0" ref={dropdownRef}>
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
            </div>
            <Container>
                <InnerContainer>
                    <MovieList loading={loading} movies={currentCards} />
                </InnerContainer>
            </Container>
            <PageControls
                page={page}
                totalPages={totalPages}
                onChange={handlePageChange}
            />
        </div>
    );
};

export default SearchComponent;
