import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { API, makeMovie, mockFetch, renderRoutes } from "../test/utils";
import Home from "./Home";

const movies = [
    makeMovie({ id: 1, title: "Heat", date_watched: "2024-03-01T20:00:00Z" }),
    makeMovie({
        id: 2,
        title: "Collateral",
        released: 2004,
        actors: ["Tom Cruise", "Jamie Foxx"],
        actresses: [],
    }),
    makeMovie({
        id: 3,
        title: "Alien",
        director: "Ridley Scott",
        actors: [],
        actresses: ["Sigourney Weaver"],
    }),
];

const renderHome = (entry = "/", data = movies) => {
    const fetchMock = mockFetch(() => data);
    renderRoutes([{ path: "/", element: <Home /> }], {
        initialEntries: [entry],
        token: "tok",
    });
    return fetchMock;
};

// The desktop table; phones get a card list with the same rows
const tableTitles = () =>
    within(screen.getByRole("table"))
        .getAllByRole("row")
        .slice(1)
        .map((row) => within(row).getAllByRole("cell")[0].textContent);

describe("Home", () => {
    it("lists every movie from the API", async () => {
        const fetchMock = renderHome();

        expect(await screen.findByRole("table")).toBeInTheDocument();
        expect(fetchMock).toHaveBeenCalledWith(`${API}api/movies/`);
        expect(tableTitles()).toEqual(["Heat", "Collateral", "Alien"]);
    });

    it("shows names as text and dates as YYYY-MM-DD", async () => {
        renderHome();
        const row = within(await screen.findByRole("table")).getAllByRole("row")[1];

        expect(row).toHaveTextContent("Al Pacino, Robert De Niro");
        expect(row).toHaveTextContent("2024-03-01");
    });

    it("links each row to its edit and delete pages", async () => {
        renderHome();
        const row = within(await screen.findByRole("table")).getAllByRole("row")[2];

        expect(within(row).getByRole("link", { name: "Edit" })).toHaveAttribute(
            "href",
            "/edit/2",
        );
        expect(within(row).getByRole("link", { name: "Delete" })).toHaveAttribute(
            "href",
            "/delete/2",
        );
    });

    it.each([
        ["title", "colla", ["Collateral"]],
        ["director", "ridley", ["Alien"]],
        ["actor", "FOXX", ["Collateral"]],
        ["actress", "weaver", ["Alien"]],
    ])("filters by %s from ?q=", async (_, query, expected) => {
        renderHome(`/?q=${query}`);
        await screen.findByRole("table");

        expect(tableTitles()).toEqual(expected);
        expect(screen.getByPlaceholderText("Movie, Director, or Actor")).toHaveValue(
            query,
        );
    });

    it("writes typed searches to the URL", async () => {
        renderHome("/?page=2");
        await screen.findByRole("table");

        await userEvent.type(
            screen.getByPlaceholderText("Movie, Director, or Actor"),
            "alien",
        );

        // Debounced, and resets to page 1
        expect(await screen.findByText("/?q=alien")).toBeInTheDocument();
        expect(tableTitles()).toEqual(["Alien"]);
    });

    it("says when nothing matches", async () => {
        renderHome("/?q=zzz");

        expect(await screen.findByText('No movies match "zzz".')).toBeInTheDocument();
    });

    it("paginates 20 rows per page", async () => {
        const many = Array.from({ length: 25 }, (_, i) =>
            makeMovie({ id: i + 1, title: `Movie ${i + 1}` }),
        );
        renderHome("/", many);
        await screen.findByRole("table");
        expect(tableTitles()).toHaveLength(20);

        await userEvent.click(screen.getByRole("button", { name: "Go to page 2" }));

        expect(tableTitles()).toEqual(
            ["21", "22", "23", "24", "25"].map((n) => `Movie ${n}`),
        );
        expect(screen.getByTestId("location")).toHaveTextContent("/?page=2");
    });
});
