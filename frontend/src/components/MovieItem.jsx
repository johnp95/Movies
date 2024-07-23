import { Link } from "react-router-dom";

const MovieItem = ({ movie }) => {
    return (
        <div className="w-64 rounded-lg shadow-md m-5 overflow-hidden font-sans">
            <img
                className="w-64 h-[290px] object-cover"
                src={movie.image}
                alt={movie.title}
            />
            <div className="text-center font-arial">
                <p className="text-base font-semibold text-gray-700 mt-2">
                    {movie.title}
                </p>
            </div>
            <div className="mb-5 flex justify-around text-center mt-4">
                <Link to={`/movie_details/${movie.id}`}>
                    <button className="bg-[#000d33] text-white px-4 py-2 rounded hover:bg-[#001a66] transition duration-300">
                        View Movie
                    </button>
                </Link>
            </div>
        </div>
    );
};
export default MovieItem;
