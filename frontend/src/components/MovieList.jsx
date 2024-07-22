import { MovieItem } from "./MovieItem";

export const MovieList = ({ setMovieId, loading, currentCards }) => {
    return (
        <div className="container mx-auto">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="flex justify-around flex-wrap">
                    {currentCards.map((movie) => (
                        <MovieItem
                            setMovieId={setMovieId}
                            key={movie.id}
                            movie={movie}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
