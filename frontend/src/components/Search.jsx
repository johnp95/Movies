import { useState, useEffect } from "react";
import { MdMovie } from "react-icons/md";

const url = import.meta.env.VITE_API_BASE_URL_LOCAL + `api/movies/search`;
// const url = `http://localhost:8080/movies`;

const Search = ({ setMovieData, setLoading }) => {
    const [query, setQuery] = useState("");

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await fetch(`${url}?query=${query}`);
                const data = await res.json();
                setMovieData(data);
            } catch (error) {
                console.log("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [query, setLoading, setMovieData]);

    return (
        <div className="mx-auto my-5 w-full max-w-md relative">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Movie, Director, or Actor"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="text-center w-full px-5 py-2.5 text-base text-gray-700 border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors duration-200 placeholder-center"
                />
                <div
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Search"
                >
                    <MdMovie className="text-4xl text-gray-900" />
                </div>
            </div>
        </div>
    );
};

export default Search;
