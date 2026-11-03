import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { API, makeMovie, mockFetch, renderRoutes } from "../test/utils";
import SearchComponent from "./SearchComponent";

const movies = [
    makeMovie({ id: 1, title: "Heat", released: 1995, date_watched: "2024-01-15" }),
    makeMovie({ id: 2, title: "Alien", released: 1979, date_watched: "2024-06-01" }),
    makeMovie({ id: 3, title: "Collateral", released: 2004, date_watched: "2023-05-20" }),
];

const renderSearch = (entry = "/search", data = movies) => {
    const fetchMock = mockFetch(() => data);
    renderRoutes([{ path: "/search", element: <SearchComponent /> }], {
        initialEntries: [entry],
    });
    return fetchMock;
};

const shownTitles = () => screen.getAllByRole("img").map((img) => img.alt);

describe("SearchComponent", () => {
    it("searches the API with the ?q= query", async () => {
        const fetchMock = renderSearch("/search?q=al%20pacino");

        await screen.findAllByRole("img");
        expect(fetchMock).toHaveBeenCalledWith(
            `${API}api/movies/search/?query=al%20pacino`,
            expect.anything(),
        );
        expect(screen.getByPlaceholderText("Movie, Director, or Actor")).toHaveValue(
            "al pacino",
        );
    });

    it("links each result to its detail page", async () => {
        renderSearch();
        await screen.findAllByRole("img");

        expect(screen.getAllByRole("link")[0]).toHaveAttribute(
            "href",
            "/movie_details/2",
        );
    });

    it("sorts by most recently watched by default", async () => {
        renderSearch();
        await screen.findAllByRole("img");

        expect(shownTitles()).toEqual(["Alien", "Heat", "Collateral"]);
    });

    it.each([
        ["Oldest", "oldest", ["Alien", "Heat", "Collateral"]],
        ["Newest", "newest", ["Collateral", "Heat", "Alien"]],
    ])("sorts by %s release and saves it in the URL", async (label, param, expected) => {
        const user = userEvent.setup();
        renderSearch("/search?page=2");
        await screen.findAllByRole("img");

        await user.click(screen.getByRole("button", { name: "Sort By" }));
        await user.click(screen.getByRole("button", { name: label }));

        expect(shownTitles()).toEqual(expected);
        expect(screen.getByTestId("location")).toHaveTextContent(
            `/search?sort=${param}`,
        );
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("reads the sort from the URL", async () => {
        renderSearch("/search?sort=newest");
        await screen.findAllByRole("img");

        expect(shownTitles()).toEqual(["Collateral", "Heat", "Alien"]);
    });

    it("drops ?sort= when switching back to Recently Watched", async () => {
        const user = userEvent.setup();
        renderSearch("/search?sort=oldest");
        await screen.findAllByRole("img");

        await user.click(screen.getByRole("button", { name: "Sort By" }));
        await user.click(screen.getByRole("button", { name: "Recently Watched" }));

        expect(screen.getByTestId("location").textContent).toBe("/search");
    });

    it("closes the sort menu when clicking outside it", async () => {
        const user = userEvent.setup();
        renderSearch();
        await screen.findAllByRole("img");

        await user.click(screen.getByRole("button", { name: "Sort By" }));
        expect(screen.getByRole("menu")).toBeInTheDocument();

        await user.click(screen.getByPlaceholderText("Movie, Director, or Actor"));
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("refetches after typing, debounced into the URL", async () => {
        const fetchMock = renderSearch();
        await screen.findAllByRole("img");

        await userEvent.type(
            screen.getByPlaceholderText("Movie, Director, or Actor"),
            "heat",
        );

        await waitFor(() =>
            expect(fetchMock).toHaveBeenLastCalledWith(
                `${API}api/movies/search/?query=heat`,
                expect.anything(),
            ),
        );
        expect(screen.getByTestId("location")).toHaveTextContent("/search?q=heat");
        // One request for the empty query, one for the debounced "heat"
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });
});
