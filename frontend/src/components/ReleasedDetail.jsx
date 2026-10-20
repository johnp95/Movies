import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MovieItem from "./MovieItem";
import PageControls from "./PageControls";
import usePagination from "../hooks/usePagination";
import { API_BASE_URL } from "../config";

const url = API_BASE_URL + `api/movies/released`;

const ReleasedDetail = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id: year } = useParams();
    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await fetch(`${url}?released=${year}`);
                const data = await res.json();
                setMovies(data);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [year]);

    const {
        currentItems: currentMovies,
        page,
        totalPages,
        handlePageChange,
    } = usePagination(movies, 10);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
                Movies Released in {year}: {movies.length}
            </h1>
            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
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
                </>
            )}
        </div>
    );
};

export default ReleasedDetail;
