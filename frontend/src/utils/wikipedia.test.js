import { describe, expect, it } from "vitest";
import { mockFetch } from "../test/utils";
import { articleUrl, resolveWikiUrl, searchUrl } from "./wikipedia";

describe("articleUrl", () => {
    it("replaces spaces with underscores and encodes the rest", () => {
        expect(articleUrl("Heat (1995 film)")).toBe(
            "https://en.wikipedia.org/wiki/Heat_(1995_film)",
        );
        expect(articleUrl("Amélie")).toBe(
            "https://en.wikipedia.org/wiki/Am%C3%A9lie",
        );
    });
});

describe("searchUrl", () => {
    it("searches for the title, year and 'film'", () => {
        const url = new URL(searchUrl("Heat", 1995));
        expect(url.pathname).toBe("/wiki/Special:Search");
        expect(url.searchParams.get("search")).toBe("Heat 1995 film");
    });
});

describe("resolveWikiUrl", () => {
    const respondWith = (query) => mockFetch(() => ({ query }));

    it("asks for all candidate titles in one request", async () => {
        const fetchMock = respondWith({ pages: [] });
        await resolveWikiUrl("Heat", 1995);

        const url = new URL(fetchMock.mock.calls[0][0]);
        expect(url.origin + url.pathname).toBe(
            "https://en.wikipedia.org/w/api.php",
        );
        expect(url.searchParams.get("titles")).toBe(
            "Heat (1995 film)|Heat (film)|Heat",
        );
    });

    it("prefers the year-specific film article", async () => {
        respondWith({
            pages: [
                { title: "Heat (1995 film)" },
                { title: "Heat (film)" },
                { title: "Heat", description: "Film" },
            ],
        });
        expect(await resolveWikiUrl("Heat", 1995)).toBe(
            articleUrl("Heat (1995 film)"),
        );
    });

    it("skips missing pages and disambiguation pages", async () => {
        respondWith({
            pages: [
                { title: "Heat (1995 film)", missing: true },
                { title: "Heat (film)", pageprops: { disambiguation: "" } },
                { title: "Heat", description: "1995 film by Michael Mann" },
            ],
        });
        expect(await resolveWikiUrl("Heat", 1995)).toBe(articleUrl("Heat"));
    });

    it("follows chained normalizations and redirects", async () => {
        respondWith({
            normalized: [{ from: "Se7en (1995 film)", to: "Se7en (1995 Film)" }],
            redirects: [{ from: "Se7en (1995 Film)", to: "Seven (1995 film)" }],
            pages: [{ title: "Seven (1995 film)" }],
        });
        expect(await resolveWikiUrl("Se7en", 1995)).toBe(
            articleUrl("Seven (1995 film)"),
        );
    });

    it("ignores a bare-title article that isn't about a film", async () => {
        respondWith({
            pages: [
                { title: "Heat (1995 film)", missing: true },
                { title: "Heat (film)", missing: true },
                { title: "Heat", description: "Energy in transfer" },
            ],
        });
        expect(await resolveWikiUrl("Heat", 1995)).toBe(searchUrl("Heat", 1995));
    });

    it("falls back to a search when nothing matches", async () => {
        respondWith({ pages: [{ title: "Heat", invalid: true }] });
        expect(await resolveWikiUrl("Heat", 1995)).toBe(searchUrl("Heat", 1995));
    });
});
