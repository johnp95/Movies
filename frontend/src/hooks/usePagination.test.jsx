import { act, renderHook } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import usePagination from "./usePagination";

const items = Array.from({ length: 25 }, (_, i) => i + 1);

const renderPagination = (url, list = items, perPage = 10) =>
    renderHook(
        () => ({ ...usePagination(list, perPage), location: useLocation() }),
        {
            wrapper: ({ children }) => (
                <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
            ),
        },
    );

describe("usePagination", () => {
    it("starts on page 1 with no ?page= param", () => {
        const { result } = renderPagination("/");
        expect(result.current.page).toBe(1);
        expect(result.current.totalPages).toBe(3);
        expect(result.current.currentItems).toEqual(items.slice(0, 10));
    });

    it("reads the page from ?page=", () => {
        const { result } = renderPagination("/?page=3");
        expect(result.current.page).toBe(3);
        expect(result.current.currentItems).toEqual([21, 22, 23, 24, 25]);
    });

    it.each([
        ["past the last page", "/?page=99", 3],
        ["below 1", "/?page=-2", 1],
        ["not a number", "/?page=abc", 1],
    ])("clamps a page %s", (_, url, expected) => {
        const { result } = renderPagination(url);
        expect(result.current.page).toBe(expected);
        expect(result.current.currentItems).not.toHaveLength(0);
    });

    it("handles an empty list", () => {
        const { result } = renderPagination("/?page=4", []);
        expect(result.current.page).toBe(1);
        expect(result.current.totalPages).toBe(0);
        expect(result.current.currentItems).toEqual([]);
    });

    it("writes the new page to the URL, keeping other params", () => {
        const { result } = renderPagination("/search?q=heat");
        act(() => result.current.handlePageChange(null, 2));

        expect(result.current.location.search).toBe("?q=heat&page=2");
        expect(result.current.page).toBe(2);
        expect(window.scrollTo).toHaveBeenCalled();
    });

    it("removes ?page= when going back to page 1", () => {
        const { result } = renderPagination("/search?q=heat&page=2");
        act(() => result.current.handlePageChange(null, 1));

        expect(result.current.location.search).toBe("?q=heat");
        expect(result.current.page).toBe(1);
    });
});
