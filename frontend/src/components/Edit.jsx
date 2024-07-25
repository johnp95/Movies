import { useState } from "react";
import { useNavigate, useParams, useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const url = import.meta.env.VITE_API_BASE_URL_LOCAL + `api/movies`;

const Edit = () => {
    const movie = useLoaderData();

    const navigate = useNavigate();

    const [title, setTitle] = useState(movie.title);
    const [director, setDirector] = useState(movie.director);
    const [actor, setActor] = useState(movie.actor);
    const [actress, setActress] = useState(movie.actress);
    const [dateWatched, setDateWatched] = useState(movie.date_watched);
    const [released, setReleased] = useState(movie.released);
    const [image, setImage] = useState(movie.image);
    const { id } = useParams();
    const updateMovie = async (movie) => {
        const res = await fetch(`${url}/${id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(movie),
        });
        return;
    };
    const submitForm = (e) => {
        e.preventDefault();

        const editMovie = {
            id,
            title,
            director,
            actor,
            actress,
            date_watched: dateWatched,
            released: Number(released),
            image,
        };
        updateMovie(editMovie);
        toast.success("Job Updated Successfully");
        return navigate("/");
    };

    return (
        <>
            <section className="bg-indigo-50">
                <div className="container m-auto max-w-2xl py-24">
                    <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
                        <form onSubmit={submitForm}>
                            <h2 className="text-3xl text-center font-semibold mb-6">
                                Update Movie
                            </h2>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="border rounded w-full py-2 px-3 mb-2"
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                    }}
                                    value={title}
                                    placeholder="Title"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">
                                    Director
                                </label>
                                <input
                                    type="text"
                                    id="director"
                                    name="director"
                                    className="border rounded w-full py-2 px-3 mb-2"
                                    onChange={(e) => {
                                        setDirector(e.target.value);
                                    }}
                                    value={director}
                                    placeholder="Director"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">
                                    Actor
                                </label>
                                <input
                                    type="text"
                                    id="actor"
                                    name="actor"
                                    className="border rounded w-full py-2 px-3 mb-2"
                                    onChange={(e) => {
                                        setActor(e.target.value);
                                    }}
                                    value={actor}
                                    placeholder="Actor"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">
                                    Actress
                                </label>
                                <input
                                    type="text"
                                    id="actress"
                                    name="actress"
                                    className="border rounded w-full py-2 px-3 mb-2"
                                    onChange={(e) => {
                                        setActress(e.target.value);
                                    }}
                                    value={actress}
                                    placeholder="Actress"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">
                                    Date Watched
                                </label>
                                <input
                                    type="date"
                                    id="dateWatched"
                                    name="dateWatched"
                                    className="border rounded w-full py-2 px-3 mb-2"
                                    onChange={(e) => {
                                        setDateWatched(e.target.value);
                                    }}
                                    value={dateWatched}
                                    placeholder="Date Watched"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">
                                    Released
                                </label>
                                <input
                                    type="number"
                                    id="released"
                                    name="released"
                                    className="border rounded w-full py-2 px-3 mb-2"
                                    onChange={(e) => {
                                        setReleased(e.target.value);
                                    }}
                                    value={released}
                                    placeholder="Released"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">
                                    Image
                                </label>
                                <input
                                    type="text"
                                    id="image"
                                    name="image"
                                    className="border rounded w-full py-2 px-3 mb-2"
                                    onChange={(e) => {
                                        setImage(e.target.value);
                                    }}
                                    value={image}
                                    placeholder="Image"
                                    required
                                />
                            </div>
                            <div className="flex gap-4">
                                <Link
                                    to="/"
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full w-1/2 focus:outline-none focus:shadow-outline text-center"
                                >
                                    Go Back
                                </Link>
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full w-1/2 focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};
const movieLoader = async ({ params }) => {
    const res = await fetch(`${url}/${params.id}`);
    const data = await res.json();
    return data;
};
export { Edit as default, movieLoader };
