import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import MovieItem from "./MovieItem";

const TestSearch = () => {
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState([]);
    const url = "http://localhost:8080/movies";
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await fetch(url);
                const data = await res.json();
                console.log(data);
                setMovies(data);
            } catch (error) {
                console.log("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    return (
        <>
            <div className="container mx-auto">
                {loading ? (
                    <Spinner loading={loading} />
                ) : (
                    <div className="flex flex-wrap justify-center">
                        {movies.map((movie) => (
                            <MovieItem key={movie.id} movie={movie} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};
export default TestSearch;
