import { useState, useEffect } from "react";
import AxiosInstance from "./Axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const GetData = (id) => {
    return AxiosInstance.get(`api/movies/${id}`);
};

const Delete = () => {
    const MyParam = useParams();
    const MyId = MyParam.id;
    const [myData, setMyData] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await GetData(MyId);
                setMyData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [MyId]);

    const navigate = useNavigate();

    const submission = () => {
        AxiosInstance.delete(`api/movies/${MyId}/`).then(() => {
            navigate(`/`);
        });
        toast.success("Job Deleted Sucessfully");
    };

    return (
        <div className="container mx-auto p-4">
            {loading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div>
                    <div className="bg-blue-500 text-white p-4 mb-4">
                        <h1 className="text-2xl font-bold">
                            Delete Movie {myData.name}
                        </h1>
                    </div>
                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <p className="mb-4">
                            Are you sure that you want to delete:{" "}
                            <strong>{myData.title}</strong>
                        </p>
                        <div className="flex justify-center">
                            <button
                                onClick={submission}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Delete;
