import MovieItem from "./MovieItem";
import Spinner from './Spinner'

const MovieList = ({ loading, movies }) => {

    const myMovies = movies.map((movie) => <MovieItem key={movie.id} movie={movie} />);

    return (
        <div className="container mx-auto">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <Spinner loading={loading} />
                </div>
            ) : (
                <div className="flex justify-around flex-wrap">
                    {myMovies}
                </div>
            )}
        </div>
    );
};

export default MovieList;
