import { act, renderHook } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import useGoBack from "./useGoBack";

const renderGoBack = (entries, fallback) =>
    renderHook(
        () => ({ goBack: useGoBack(fallback), location: useLocation() }),
        {
            wrapper: ({ children }) => (
                <MemoryRouter
                    initialEntries={entries}
                    initialIndex={entries.length - 1}
                >
                    {children}
                </MemoryRouter>
            ),
        },
    );

describe("useGoBack", () => {
    it("goes back to the previous page, keeping its params", () => {
        const { result } = renderGoBack(["/search?q=heat&page=2", "/movie_details/1"]);
        act(() => result.current.goBack());

        expect(result.current.location.pathname).toBe("/search");
        expect(result.current.location.search).toBe("?q=heat&page=2");
    });

    it("goes to the fallback when the page was opened directly", () => {
        const { result } = renderGoBack(["/movie_details/1"], "/search");
        act(() => result.current.goBack());

        expect(result.current.location.pathname).toBe("/search");
    });

    it("falls back to / by default", () => {
        const { result } = renderGoBack(["/movie_details/1"]);
        act(() => result.current.goBack());

        expect(result.current.location.pathname).toBe("/");
    });
});
