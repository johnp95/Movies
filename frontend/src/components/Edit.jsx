import { useState } from "react";
import { useNavigate, useParams, useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";
import AxiosInstance from "./Axios";
import useGoBack from "../hooks/useGoBack";
import { namesToText, textToNames } from "../utils/names";

const url = API_BASE_URL + `api/movies`;

const Edit = () => {
    const movie = useLoaderData();

    const navigate = useNavigate();
    const goBack = useGoBack();

    const [title, setTitle] = useState(movie.title);
    const [director, setDirector] = useState(movie.director);
    const [actors, setActors] = useState(namesToText(movie.actors));
    const [actresses, setActresses] = useState(namesToText(movie.actresses));
    const [dateWatched, setDateWatched] = useState(movie.date_watched);
    const [released, setReleased] = useState(movie.released);
    const [image, setImage] = useState(movie.image);
    const { id } = useParams();
    const submitForm = async (e) => {
        e.preventDefault();

        const editMovie = {
            id,
            title,
            director,
            actors: textToNames(actors),
            actresses: textToNames(actresses),
            date_watched: dateWatched,
            released: Number(released),
            image,
        };
        try {
            // AxiosInstance attaches the auth token the API requires for writes
            await AxiosInstance.put(`api/movies/${id}/`, editMovie);
            toast.success("Film Updated Successfully");
            navigate("/");
        } catch (error) {
            console.error("Error updating movie:", error);
            toast.error("Could not update the film");
        }
    };

    return (
        <>
            <section className="bg-indigo-50">
                <div className="container m-auto max-w-2xl py-6 md:py-24">
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
                                    className="border rounded-sm w-full py-2 px-3 mb-2"
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
                                    className="border rounded-sm w-full py-2 px-3 mb-2"
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
                                    Actor(s)
                                </label>
                                <input
                                    type="text"
                                    id="actors"
                                    name="actors"
                                    className="border rounded-sm w-full py-2 px-3 mb-2"
                                    onChange={(e) => {
                                        setActors(e.target.value);
                                    }}
                                    value={actors}
                                    placeholder="Actor(s), separated by commas"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">
                                    Actresses
                                </label>
                                <input
                                    type="text"
                                    id="actresses"
                                    name="actresses"
                                    className="border rounded-sm w-full py-2 px-3 mb-2"
                                    onChange={(e) => {
                                        setActresses(e.target.value);
                                    }}
                                    value={actresses}
                                    placeholder="Actresses, separated by commas"
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
                                    className="border rounded-sm w-full py-2 px-3 mb-2"
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
                                    className="border rounded-sm w-full py-2 px-3 mb-2"
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
                                    className="border rounded-sm w-full py-2 px-3 mb-2"
                                    onChange={(e) => {
                                        setImage(e.target.value);
                                    }}
                                    value={image}
                                    placeholder="Image"
                                    required
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={goBack}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full w-1/2 focus:outline-hidden focus:shadow-outline text-center"
                                >
                                    Go Back
                                </button>
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full w-1/2 focus:outline-hidden focus:shadow-outline"
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
