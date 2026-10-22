import React, { useEffect, useMemo, useState } from "react";
import Dayjs from "dayjs";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import { API_BASE_URL } from "../config";

const url = API_BASE_URL + `api/movies`;

const Home = () => {
    const [myData, setMyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await fetch(url);
                const data = await res.json();
                setMyData(data);
            } catch (error) {
                console.log("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    const columns = useMemo(
        () => [
            {
                accessorKey: "title",
                header: "Title",
            },
            {
                accessorKey: "released",
                header: "Released",
            },
            {
                accessorKey: "director",
                header: "Director",
            },
            {
                accessorKey: "actor",
                header: "Actor",
            },
            {
                accessorKey: "actress",
                header: "Actress",
            },
            {
                accessorFn: (row) =>
                    Dayjs(row.date_watched).format("YYYY-MM-DD"),
                header: "Date Watched",
            },
        ],
        [],
    );

    return (
        <div className="container mx-auto p-4">
            {loading ? (
                <div className="flex justify-center">
                    <Spinner loading={loading} />
                </div>
            ) : (
                <>
                    {/* Phones: one card per movie instead of a wide table */}
                    <ul className="md:hidden space-y-3">
                        {myData.map((row) => (
                            <li
                                key={row.id}
                                className="border rounded-md p-4 shadow-xs bg-white"
                            >
                                <div className="flex items-baseline justify-between gap-2">
                                    <h2 className="font-semibold text-lg">
                                        {row.title}
                                    </h2>
                                    <span className="text-sm text-gray-500 shrink-0">
                                        {row.released}
                                    </span>
                                </div>
                                <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                                    {columns
                                        .filter(
                                            (column) =>
                                                !["title", "released"].includes(
                                                    column.accessorKey,
                                                ),
                                        )
                                        .map((column) => (
                                            <React.Fragment
                                                key={
                                                    column.accessorKey ||
                                                    column.header
                                                }
                                            >
                                                <dt className="text-gray-500">
                                                    {column.header}
                                                </dt>
                                                <dd>
                                                    {column.accessorFn
                                                        ? column.accessorFn(row)
                                                        : row[
                                                              column.accessorKey
                                                          ]}
                                                </dd>
                                            </React.Fragment>
                                        ))}
                                </dl>
                                <div className="mt-3 flex gap-2">
                                    <Link
                                        to={`edit/${row.id}`}
                                        className="flex-1 text-center p-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        to={`delete/${row.id}`}
                                        className="flex-1 text-center p-2 bg-red-500 text-white rounded-sm hover:bg-red-600"
                                    >
                                        Delete
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                            <thead>
                                <tr>
                                    {columns.map((column) => (
                                        <th
                                            key={
                                                column.accessorKey ||
                                                column.header
                                            }
                                            className="p-2 border bg-gray-100"
                                        >
                                            {column.header}
                                        </th>
                                    ))}
                                    <th className="p-2 border bg-gray-100">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {myData.map((row) => (
                                    <tr key={row.id}>
                                        {columns.map((column) => (
                                            <td
                                                key={
                                                    column.accessorKey ||
                                                    column.header
                                                }
                                                className="p-2 border"
                                            >
                                                {column.accessorFn
                                                    ? column.accessorFn(row)
                                                    : row[column.accessorKey]}
                                            </td>
                                        ))}
                                        <td className="p-2 border">
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`edit/${row.id}`}
                                                    className="p-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600"
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    to={`delete/${row.id}`}
                                                    className="p-2 bg-red-500 text-white rounded-sm hover:bg-red-600"
                                                >
                                                    Delete
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
