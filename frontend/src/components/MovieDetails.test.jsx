import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { API, makeMovie, mockFetch, renderRoutes } from "../test/utils";
import { resolveWikiUrl } from "../utils/wikipedia";
import MovieDetails from "./MovieDetails";

vi.mock("../utils/wikipedia", () => ({
    resolveWikiUrl: vi.fn(),
    searchUrl: (title, year) => `search:${title}:${year}`,
}));

const firstViewing = makeMovie({
    id: 1,
    date_watched: "2024-01-15",
    actors: ["Al Pacino"],
    actresses: ["Ashley Judd"],
});
const rewatch = makeMovie({
    id: 2,
    date_watched: "2022-07-04",
    actors: ["Al Pacino", "Robert De Niro"],
    actresses: [],
});
const other = makeMovie({ id: 3, title: "Alien", released: 1979 });

const renderDetails = ({ movie = firstViewing, entries = ["/movie_details/1"] } = {}) => {
    const fetchMock = mockFetch((url) =>
        url.endsWith("api/movies/") ? [firstViewing, rewatch, other] : movie,
    );
    renderRoutes([{ path: "/movie_details/:id", element: <MovieDetails /> }], {
        initialEntries: entries,
    });
    return fetchMock;
};

describe("MovieDetails", () => {
    it("shows the movie's details", async () => {
        resolveWikiUrl.mockResolvedValue("https://wiki/Heat");
        const fetchMock = renderDetails();

        expect(await screen.findByRole("heading", { name: "Heat" })).toBeInTheDocument();
        expect(fetchMock).toHaveBeenCalledWith(`${API}api/movies/1/`);
        expect(screen.getByRole("link", { name: "Michael Mann" })).toHaveAttribute(
            "href",
            "/director_detail/Michael Mann",
        );
        expect(screen.getByRole("link", { name: "1995" })).toHaveAttribute(
            "href",
            "/released_detail/1995",
        );
        expect(screen.queryByText("Best Picture Winner")).not.toBeInTheDocument();
        expect(screen.queryByText(/Language/)).not.toBeInTheDocument();
    });

    it("combines every viewing of the same title", async () => {
        resolveWikiUrl.mockResolvedValue("https://wiki/Heat");
        renderDetails();
        await screen.findByRole("heading", { name: "Heat" });

        expect(screen.getByText("Times Watched:").nextSibling).toHaveTextContent("2");
        expect(screen.getByText("Date(s) Watched:").nextSibling).toHaveTextContent(
            "2022-07-04, 2024-01-15",
        );
        // Cast merged across viewings without duplicates, one link each
        expect(screen.getAllByRole("link", { name: "Al Pacino" })).toHaveLength(1);
        expect(screen.getByRole("link", { name: "Robert De Niro" })).toHaveAttribute(
            "href",
            "/actor_detail/Robert De Niro",
        );
        expect(screen.getByRole("link", { name: "Ashley Judd" })).toHaveAttribute(
            "href",
            "/actress_detail/Ashley Judd",
        );
    });

    it("shows N/A for an empty cast", async () => {
        resolveWikiUrl.mockResolvedValue("https://wiki/Alien");
        const alien = makeMovie({ id: 9, title: "Alien", actors: [], actresses: [] });
        mockFetch((url) => (url.endsWith("api/movies/") ? [alien] : alien));
        renderRoutes([{ path: "/movie_details/:id", element: <MovieDetails /> }], {
            initialEntries: ["/movie_details/9"],
        });
        await screen.findByRole("heading", { name: "Alien" });

        expect(screen.getByText("Actor(s):").nextSibling).toHaveTextContent("N/A");
        expect(screen.getByText("Actresses:").nextSibling).toHaveTextContent("N/A");
    });

    it("shows language and the Best Picture badge when set", async () => {
        resolveWikiUrl.mockResolvedValue("https://wiki/Parasite");
        renderDetails({
            movie: makeMovie({ best_picture: true, language: "Korean" }),
        });

        expect(await screen.findByText("Best Picture Winner")).toBeInTheDocument();
        expect(screen.getByText("Language:").nextSibling).toHaveTextContent("Korean");
    });

    it("opens the Wikipedia article from the poster", async () => {
        const open = vi.spyOn(window, "open").mockImplementation(() => null);
        resolveWikiUrl.mockResolvedValue("https://wiki/Heat");
        renderDetails();

        await userEvent.click(await screen.findByRole("img", { name: "Heat" }));

        expect(resolveWikiUrl).toHaveBeenCalledWith("Heat", 1995);
        expect(open).toHaveBeenCalledWith("https://wiki/Heat", "_blank", "noopener");
    });

    it("falls back to a Wikipedia search until the article is found", async () => {
        const open = vi.spyOn(window, "open").mockImplementation(() => null);
        resolveWikiUrl.mockReturnValue(new Promise(() => {}));
        renderDetails();

        await userEvent.click(await screen.findByRole("img", { name: "Heat" }));

        expect(open).toHaveBeenCalledWith("search:Heat:1995", "_blank", "noopener");
    });

    it("goes back to search when opened directly", async () => {
        resolveWikiUrl.mockResolvedValue("https://wiki/Heat");
        renderDetails();

        await userEvent.click(await screen.findByRole("button", { name: "Go Back" }));

        expect(screen.getByTestId("location")).toHaveTextContent("/search");
    });
});
