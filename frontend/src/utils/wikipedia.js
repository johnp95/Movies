// Finds a film's Wikipedia article. Mirrors backend/MovieApp/wikipedia.py,
// which `manage.py check_wiki_links` uses to report films that don't resolve.
const API_URL = "https://en.wikipedia.org/w/api.php";

const candidates = (title, year) => [
    `${title} (${year} film)`,
    `${title} (film)`,
    title,
];

export const articleUrl = (name) =>
    "https://en.wikipedia.org/wiki/" +
    encodeURIComponent(name.replaceAll(" ", "_"));

// Used until the article is found, and if it never is
export const searchUrl = (title, year) =>
    "https://en.wikipedia.org/wiki/Special:Search?" +
    new URLSearchParams({ search: `${title} ${year} film` });

export const resolveWikiUrl = async (title, year) => {
    const names = candidates(title, year);
    const params = new URLSearchParams({
        action: "query",
        format: "json",
        formatversion: 2,
        redirects: 1,
        prop: "pageprops|description",
        ppprop: "disambiguation",
        titles: names.join("|"),
        origin: "*",
    });
    const { query } = await (await fetch(`${API_URL}?${params}`)).json();

    const renames = Object.fromEntries(
        [...(query.normalized || []), ...(query.redirects || [])].map((r) => [
            r.from,
            r.to,
        ]),
    );
    const pages = Object.fromEntries(query.pages.map((p) => [p.title, p]));

    for (const name of names) {
        let final = name;
        for (let i = 0; i < 5 && renames[final]; i++) final = renames[final];
        const page = pages[final];
        if (!page || page.missing || page.invalid) continue;
        if (page.pageprops && "disambiguation" in page.pageprops) continue;
        // The bare title is often about something else (e.g. "Heat")
        if (
            name === title &&
            !final.endsWith("film)") &&
            !(page.description || "").toLowerCase().includes("film")
        )
            continue;
        return articleUrl(final);
    }
    return searchUrl(title, year);
};
