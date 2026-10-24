import { FaExclamationTriangle } from "react-icons/fa";
import useGoBack from "../hooks/useGoBack";

const NotFoundPage = () => {
    const goBack = useGoBack();

    return (
        <>
            <section className="text-center flex flex-col justify-center items-center h-96">
                <FaExclamationTriangle className="text-yellow-40 text-6xl mb-4" />
                <h1 className="text-4xl sm:text-6xl font-bold mb-4">
                    404 Not Found
                </h1>
                <p className="text-xl mb-5">This page does not exist</p>
                <button
                    type="button"
                    onClick={goBack}
                    className="text-white bg-indigo-700 hover:bg-indigo-900 rounded-md px-3 py-2 mt-4"
                >
                    Go Back
                </button>
            </section>
        </>
    );
};
export default NotFoundPage;
