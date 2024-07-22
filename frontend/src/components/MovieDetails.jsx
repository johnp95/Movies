import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

export const MovieDetails = () => {
    const [movie, setMovie] = useState(null);
    const [watchCount, setWatchCount] = useState(0);
    const MyParam = useParams();
    const myId = MyParam.id;
    const url = `http://127.0.0.1:8000/api/movies/${myId}`;
    const allMoviesUrl = `http://127.0.0.1:8000/api/movies/`;

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await fetch(url);
                const data = await res.json();
                const allMoviesRes = await fetch(allMoviesUrl);
                const allMoviesData = await allMoviesRes.json();
                setMovie(data);
                const count = allMoviesData.filter(
                    (m) => m.title === data.title
                ).length;
                setWatchCount(count);
            } catch (error) {
                console.log("Error fetching data", error);
            }
        };
        fetchMovie();
    }, [url, allMoviesUrl]);

    if (!movie) {
        return <div className="text-center mt-8">Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-20 bg-gray-100 rounded-lg shadow-md overflow-hidden">
            <div className="flex p-6">
                <div className="flex-1">
                    <h6 className="text-sm mb-2 text-gray-700">
                        Director:{" "}
                        <Link
                            to={`/director_detail/${movie.director}`}
                            className="text-purple-700 hover:text-purple-900"
                        >
                            {movie.director}
                        </Link>
                    </h6>

                    <h6 className="text-sm mb-2 text-gray-700">
                        Actor:{" "}
                        {movie.actor ? (
                            <Link
                                to={`/actor_detail/${movie.actor}`}
                                className="text-purple-700 hover:text-purple-900"
                            >
                                {movie.actor}
                            </Link>
                        ) : (
                            "N/A"
                        )}
                    </h6>

                    <h6 className="text-sm mb-2 text-gray-700">
                        Actress:{" "}
                        {movie.actress ? (
                            <Link
                                to={`/actress_detail/${movie.actress}`}
                                className="text-purple-700 hover:text-purple-900"
                            >
                                {movie.actress}
                            </Link>
                        ) : (
                            "N/A"
                        )}
                    </h6>
                </div>

                <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-36 h-auto rounded-lg cursor-pointer"
                    onClick={() =>
                        window.open(
                            `https://en.wikipedia.org/wiki/${movie.title}`,
                            "_blank"
                        )
                    }
                />

                <div className="flex-1 ml-4">
                    <p className="text-sm mb-2 text-gray-700">
                        Date Watched: {movie.date_watched}
                    </p>

                    <p className="text-sm mb-2 text-gray-700">
                        Released: {movie.released}
                    </p>

                    <p className="text-sm mb-2 text-gray-700">
                        Times Watched: {watchCount}
                    </p>

                    {movie.best_picture && (
                        <div
                            className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mt-2"
                            role="alert"
                        >
                            Best Picture Winner
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-center p-4">
                <Link to={`/search/`}>
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded flex items-center"
                        title="Go back to Movies"
                    >
                        <KeyboardReturnIcon className="mr-2" />
                        Go Back
                    </button>
                </Link>
            </div>
        </div>
    );
};
