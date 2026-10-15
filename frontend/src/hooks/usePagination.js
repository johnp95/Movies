import { useSearchParams } from "react-router-dom";

// Paginates `items` client-side, keeping the current page in the `?page=` URL param
// so back/forward, refresh, and shared links all land on the same page.
const usePagination = (items, perPage = 10) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const requestedPage = Number(searchParams.get("page")) || 1;

    const totalPages = Math.ceil(items.length / perPage);
    // Clamp so a stale or hand-edited ?page= never shows an empty page.
    const page = Math.min(Math.max(requestedPage, 1), Math.max(totalPages, 1));
    const startIndex = (page - 1) * perPage;
    const currentItems = items.slice(startIndex, startIndex + perPage);

    const handlePageChange = (event, value) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (value === 1) next.delete("page");
            else next.set("page", value);
            return next;
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return { currentItems, page, totalPages, handlePageChange };
};

export default usePagination;
