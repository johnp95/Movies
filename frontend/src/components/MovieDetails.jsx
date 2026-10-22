import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { API_BASE_URL } from "../config";

const MovieDetails = () => {
    const [movie, setMovie] = useState(null);
    const [watchCount, setWatchCount] = useState(0);
    const [watchDates, setWatchDates] = useState([]);
    const { id: myId } = useParams();
    const url = API_BASE_URL + `api/movies/${myId}`;
    const allMoviesUrl = API_BASE_URL + `api/movies`;

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const [movieRes, allMoviesRes] = await Promise.all([
                    fetch(url),
                    fetch(allMoviesUrl),
                ]);
                const [movieData, allMoviesData] = await Promise.all([
                    movieRes.json(),
                    allMoviesRes.json(),
                ]);
                setMovie(movieData);
                const viewings = allMoviesData.filter(
                    (m) => m.title === movieData.title,
                );
                setWatchCount(viewings.length);
                setWatchDates(
                    viewings
                        .map((m) => m.date_watched)
                        .filter(Boolean)
                        .sort(),
                );
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchMovie();
    }, []);

    if (!movie) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-4 sm:mx-auto my-6 sm:mt-10 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
                <div className="md:shrink-0">
                    <img
                        className="w-40 mx-auto mt-6 rounded-md md:mt-0 md:rounded-none md:h-full md:w-48 object-cover cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
                        src={movie.image}
                        alt={movie.title}
                        onClick={() =>
                            window.open(
                                `https://en.wikipedia.org/wiki/${movie.title}`,
                                "_blank",
                            )
                        }
                    />
                </div>
                <div className="p-6 sm:p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        {movie.title}
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-y-4">
                        <MovieDetailItem
                            label="Director"
                            value={movie.director}
                            link={`/director_detail/${movie.director}`}
                        />
                        <MovieDetailItem
                            label="Actor"
                            value={movie.actor}
                            link={`/actor_detail/${movie.actor}`}
                        />
                        <MovieDetailItem
                            label="Actress"
                            value={movie.actress}
                            link={`/actress_detail/${movie.actress}`}
                        />
                        <MovieDetailItem
                            label="Date(s) Watched"
                            value={watchDates.join(", ")}
                        />
                        <MovieDetailItem
                            label="Released"
                            value={movie.released}
                            link={`/released_detail/${movie.released}`}
                        />

                        <MovieDetailItem
                            label="Times Watched"
                            value={watchCount}
                        />
                        {movie.language && (
                            <MovieDetailItem
                                label="Language"
                                value={movie.language}
                            />
                        )}
                    </div>
                    {movie.best_picture && (
                        <div
                            className="mt-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4"
                            role="alert"
                        >
                            <p className="font-bold">Best Picture Winner</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-center">
                <Link
                    to="/search/"
                    className="inline-flex items-center justify-center rounded-md border border-transparent shadow-xs px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out"
                >
                    <FaArrowLeft className="mr-2 text-xl" />
                    Go Back
                </Link>
            </div>
        </div>
    );
};

const MovieDetailItem = ({ label, value, link }) => (
    <div className="mb-2">
        <span className="text-gray-600 font-semibold">{label}: </span>
        {link ? (
            <Link
                to={link}
                className="text-purple-600 hover:text-purple-800 transition duration-300 ease-in-out"
            >
                {value || "N/A"}
            </Link>
        ) : (
            <span className="text-gray-800">{value || "N/A"}</span>
        )}
    </div>
);

export default MovieDetails;
