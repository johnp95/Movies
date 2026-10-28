import json
import time
from urllib.error import HTTPError
from urllib.parse import urlencode, quote
from urllib.request import Request, urlopen

API_URL = "https://en.wikipedia.org/w/api.php"
# Wikipedia rate-limits clients whose User-Agent isn't "name/version (contact)"
USER_AGENT = "MovieLog/1.0 (https://johnpennyman.com) check_wiki_links"
# Max titles per query for a normal (non-bot) account
BATCH_SIZE = 50


def candidates(title, year):
    """Article names to try for a film, most specific first.

    Keep in sync with frontend/src/utils/wikipedia.js.
    """
    return [f"{title} ({year} film)", f"{title} (film)", title]


def article_url(name):
    return "https://en.wikipedia.org/wiki/" + quote(name.replace(" ", "_"), safe="")


def search_url(title, year):
    return "https://en.wikipedia.org/wiki/Special:Search?" + urlencode(
        {"search": f"{title} {year} film"}
    )


def fetch_pages(names):
    """Look up article names, following normalisation and redirects.

    Returns {name: {"title", "missing", "disambiguation", "description"}}.
    """
    results = {}
    for i in range(0, len(names), BATCH_SIZE):
        batch = names[i : i + BATCH_SIZE]
        params = urlencode(
            {
                "action": "query",
                "format": "json",
                "formatversion": 2,
                "redirects": 1,
                "prop": "pageprops|description",
                "ppprop": "disambiguation",
                "titles": "|".join(batch),
            }
        )
        results.update(parse_query(batch, get_json(f"{API_URL}?{params}")["query"]))
        # Stay well under the API's rate limit
        time.sleep(1)
    return results


def get_json(url, retries=3):
    request = Request(url, headers={"User-Agent": USER_AGENT})
    for attempt in range(retries + 1):
        try:
            with urlopen(request, timeout=30) as response:
                return json.load(response)
        except HTTPError as error:
            if error.code != 429 or attempt == retries:
                raise
            time.sleep(int(error.headers.get("Retry-After", 5)))


def parse_query(names, query):
    renames = {r["from"]: r["to"] for r in query.get("normalized", [])}
    renames.update({r["from"]: r["to"] for r in query.get("redirects", [])})
    pages = {p["title"]: p for p in query.get("pages", [])}

    results = {}
    for name in names:
        final = name
        # normalised -> redirected; bounded in case of a redirect loop
        for _ in range(5):
            if final not in renames:
                break
            final = renames[final]
        page = pages.get(final, {"missing": True})
        results[name] = {
            "title": final,
            "missing": bool(page.get("missing") or page.get("invalid")),
            "disambiguation": "disambiguation" in page.get("pageprops", {}),
            "description": page.get("description", ""),
        }
    return results


def resolve(title, year, pages):
    """Pick the article for a film from fetch_pages() results, or None.

    The "(film)" names are trusted as long as they exist and aren't a
    disambiguation page; the bare title only counts if the article is named
    "... film)" or described as a film, since it's often about something else
    (e.g. "Heat").
    """
    names = candidates(title, year)
    for name in names:
        page = pages.get(name)
        if not page or page["missing"] or page["disambiguation"]:
            continue
        if name == title and not is_film(page):
            continue
        return page["title"]
    return None


def is_film(page):
    return page["title"].endswith("film)") or "film" in page["description"].lower()
