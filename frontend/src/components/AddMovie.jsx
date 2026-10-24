import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosInstance from "./Axios";
import { textToNames } from "../utils/names";

const AddMovie = () => {
    const [title, setTitle] = useState("");
    const [director, setDirector] = useState("");
    const [actors, setActors] = useState("");
    const [actresses, setActresses] = useState("");
    const [dateWatched, setDateWatched] = useState("");
    const [released, setReleased] = useState("");
    const [image, setImage] = useState("");

    const navigate = useNavigate();
    const submitForm = async (e) => {
        e.preventDefault();

        const newMovie = {
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
            await AxiosInstance.post("api/movies/", newMovie);
            toast.success("Film Added Successfully");
            navigate("/");
        } catch (error) {
            console.error("Error adding movie:", error);
            toast.error("Could not add the film");
        }
    };

    return (
        <>
            <section className="bg-indigo-50">
                <div className="container m-auto max-w-2xl py-6 md:py-24">
                    <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
                        <form onSubmit={submitForm}>
                            <h2 className="text-3xl text-center font-semibold mb-6">
                                Add Movie
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

                            <div>
                                <button
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-hidden focus:shadow-outline"
                                    type="submit"
                                >
                                    Add Movie
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AddMovie;
