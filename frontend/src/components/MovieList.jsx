import MovieItem from "./MovieItem";

const MovieList = ({ loading, movies }) => {
    return (
        <div className="container mx-auto">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="flex justify-around flex-wrap">
                    {movies.map((movie) => (
                        <MovieItem key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MovieList;
