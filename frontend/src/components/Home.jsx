import React, { useEffect, useMemo, useState } from "react";
import Dayjs from "dayjs";
import { Link, useSearchParams } from "react-router-dom";
import Spinner from "./Spinner";
import Search from "./Search";
import PageControls from "./PageControls";
import usePagination from "../hooks/usePagination";
import { API_BASE_URL } from "../config";
import { namesToText } from "../utils/names";

const url = API_BASE_URL + `api/movies`;
const rowsPerPage = 20;

// Same fields as the API search, but filtered client-side so every viewing
// (not one row per title) stays listed with its own Edit/Delete.
const matchesQuery = (movie, query) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return [
        movie.title,
        movie.director,
        ...(movie.actors ?? []),
        ...(movie.actresses ?? []),
    ].some((value) => value?.toLowerCase().includes(needle));
};

const Home = () => {
    const [myData, setMyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") ?? "";
    const [input, setInput] = useState(query);

    // Debounce typing, then write the query to the URL and reset to page 1.
    // `replace` keeps each keystroke out of the browser history.
    useEffect(() => {
        if (input === query) return;
        const timeout = setTimeout(() => {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    if (input) next.set("q", input);
                    else next.delete("q");
                    next.delete("page");
                    return next;
                },
                { replace: true },
            );
        }, 300);
        return () => clearTimeout(timeout);
    }, [input, query, setSearchParams]);

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
                accessorFn: (row) => namesToText(row.actors),
                header: "Actor(s)",
            },
            {
                accessorFn: (row) => namesToText(row.actresses),
                header: "Actresses",
            },
            {
                accessorFn: (row) =>
                    Dayjs(row.date_watched).format("YYYY-MM-DD"),
                header: "Date Watched",
            },
        ],
        [],
    );

    const filteredData = useMemo(
        () => myData.filter((movie) => matchesQuery(movie, query)),
        [myData, query],
    );

    const {
        currentItems: currentRows,
        page,
        totalPages,
        handlePageChange,
    } = usePagination(filteredData, rowsPerPage);

    return (
        <div className="container mx-auto p-4">
            <Search value={input} onChange={setInput} />
            {loading ? (
                <div className="flex justify-center">
                    <Spinner loading={loading} />
                </div>
            ) : (
                <>
                    {filteredData.length === 0 && (
                        <p className="text-center text-gray-500">
                            No movies match &quot;{query}&quot;.
                        </p>
                    )}
                    {/* Phones: one card per movie instead of a wide table */}
                    <ul className="md:hidden space-y-3">
                        {currentRows.map((row) => (
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
                                {currentRows.map((row) => (
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
                    <PageControls
                        page={page}
                        totalPages={totalPages}
                        onChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};

export default Home;
