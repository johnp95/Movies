import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { API, makeMovie, mockFetch, renderRoutes } from "../test/utils";
import ActorDetail from "./ActorDetail";
import ActressDetail from "./ActressDetail";
import BestPicture from "./BestPicture";
import DirectorDetail from "./DirectorDetail";
import ForeignFilms from "./ForeignFilms";
import ReleasedDetail from "./ReleasedDetail";

// Pages that fetch a filtered list and show it as paginated movie cards
const pages = [
    {
        name: "ActorDetail",
        Component: ActorDetail,
        path: "/actor_detail/:id",
        entry: "/actor_detail/Al Pacino",
        request: "api/movies/actor/?actor=Al%20Pacino",
        heading: "Al Pacino Movies Seen: 12",
    },
    {
        name: "ActressDetail",
        Component: ActressDetail,
        path: "/actress_detail/:id",
        entry: "/actress_detail/Ashley Judd",
        request: "api/movies/actress/?actress=Ashley%20Judd",
        heading: "Ashley Judd Movies Seen: 12",
    },
    {
        name: "DirectorDetail",
        Component: DirectorDetail,
        path: "/director_detail/:id",
        entry: "/director_detail/Michael Mann",
        request: "api/movies/director/?director=Michael%20Mann",
        heading: "Michael Mann Movies Seen: 12",
    },
    {
        name: "ReleasedDetail",
        Component: ReleasedDetail,
        path: "/released_detail/:id",
        entry: "/released_detail/1995",
        request: "api/movies/released/?released=1995",
        heading: "Movies Released in 1995: 12",
    },
    {
        name: "BestPicture",
        Component: BestPicture,
        path: "/best-picture",
        entry: "/best-picture",
        request: "api/movies/best-picture/",
    },
    {
        name: "ForeignFilms",
        Component: ForeignFilms,
        path: "/foreign-films",
        entry: "/foreign-films",
        request: "api/movies/foreign-films/",
    },
];

const movies = Array.from({ length: 12 }, (_, i) =>
    makeMovie({ id: i + 1, title: `Movie ${i + 1}` }),
);

describe.each(pages)("$name", ({ Component, path, entry, request, heading }) => {
    const renderPage = () => {
        const fetchMock = mockFetch(() => movies);
        renderRoutes([{ path, element: <Component /> }], { initialEntries: [entry] });
        return fetchMock;
    };

    it("fetches its movies from the API", async () => {
        const fetchMock = renderPage();
        await screen.findAllByRole("img");

        expect(fetchMock).toHaveBeenCalledWith(`${API}${request}`);
        if (heading) {
            expect(screen.getByRole("heading")).toHaveTextContent(heading);
        }
    });

    it("shows 10 cards per page", async () => {
        renderPage();

        expect(await screen.findAllByRole("img")).toHaveLength(10);

        await userEvent.click(screen.getByRole("button", { name: "Go to page 2" }));

        expect(screen.getAllByRole("img").map((img) => img.alt)).toEqual([
            "Movie 11",
            "Movie 12",
        ]);
        expect(screen.getByTestId("location")).toHaveTextContent("?page=2");
    });
});
