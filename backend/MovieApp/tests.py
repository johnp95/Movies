from io import StringIO
from unittest.mock import patch

from django.contrib.auth.models import User
from django.core.management import call_command
from django.test import SimpleTestCase, TestCase, override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from . import wikipedia
from .models import Movie


# Test client speaks plain HTTP; don't let the prod HTTPS redirect turn every response into a 301
@override_settings(SECURE_SSL_REDIRECT=False)
class MovieAPITests(APITestCase):
    def setUp(self):
        self.top_gun = Movie.objects.create(
            title="Top Gun",
            director="Tony Scott",
            actors=["Tom Cruise"],
            actresses=[],
            date_watched="2026-01-01",
            released=1986,
        )
        self.barbie = Movie.objects.create(
            title="Barbie",
            director="Greta Gerwig",
            actors=["Ryan Gosling"],
            actresses=["Margot Robbie"],
            date_watched="2026-01-01",
            released=2023,
        )
        self.user = User.objects.create_user("tester", password="pw")
        self.client.force_authenticate(self.user)

    def test_health(self):
        response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_movie(self):
        response = self.client.get(f"/api/movies/{self.top_gun.id}/")
        self.assertEqual(response.data["title"], "Top Gun")

    def test_movies(self):
        response = self.client.get("/api/movies/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_movie(self):
        response = self.client.put(
            f"/api/movies/{self.top_gun.id}/",
            {
                "title": "Edited",
                "director": "director",
                "actors": ["actor"],
                "actresses": ["actress"],
                "date_watched": "2026-01-01",
                "released": 2026,
                "language": "",
                "best_picture": False,
                "female_director": False,
                "image": "",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.top_gun.refresh_from_db()
        self.assertEqual(self.top_gun.title, "Edited")

    def test_update_movie_updates_other_viewings(self):
        rewatch = Movie.objects.create(
            title="Top Gun",
            director="Tony Scott",
            actors=["Tom Cruise"],
            date_watched="2026-02-01",
            released=1986,
        )
        remake = Movie.objects.create(
            title="Top Gun",
            director="Someone Else",
            actors=["Other Actor"],
            date_watched="2026-03-01",
            released=2030,
        )
        response = self.client.put(
            f"/api/movies/{self.top_gun.id}/",
            {
                "title": "Top Gun",
                "director": "Tony Scott",
                "actors": ["Tom Cruise", "Val Kilmer"],
                "actresses": ["Kelly McGillis"],
                "date_watched": "2026-01-15",
                "released": 1986,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        rewatch.refresh_from_db()
        self.assertEqual(rewatch.actors, ["Tom Cruise", "Val Kilmer"])
        self.assertEqual(rewatch.actresses, ["Kelly McGillis"])
        # date_watched belongs to each viewing, so it is not copied
        self.assertEqual(str(rewatch.date_watched), "2026-02-01")
        remake.refresh_from_db()
        self.assertEqual(remake.actors, ["Other Actor"])

    def test_create_movie(self):
        response = self.client.post(
            "/api/movies/",
            {
                "title": "title",
                "director": "director",
                "actors": ["actor"],
                "actresses": ["actress"],
                "date_watched": "2026-01-01",
                "released": 2026,
                "language": "",
                "best_picture": False,
                "female_director": False,
                "image": "",
            },
            format="json",
        )
        self.assertEqual(Movie.objects.count(), 3)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_delete_movie(self):
        response = self.client.delete(f"/api/movies/{self.top_gun.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Movie.objects.count(), 1)

    def test_actor(self):
        response = self.client.get("/api/movies/actor/", {"actor": "Tom Cruise"})
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["actors"], ["Tom Cruise"])

    def test_actress(self):
        response = self.client.get(
            "/api/movies/actress/", {"actress": "Margot Robbie"}
        )
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["actresses"], ["Margot Robbie"])

    def test_director(self):
        response = self.client.get(
            "/api/movies/director/", {"director": "Greta Gerwig"}
        )
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_released(self):
        response = self.client.get("/api/movies/released/", {"released": 2023})
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_best_picture(self):
        Movie.objects.create(
            title="Oppenheimer",
            director="Christopher Nolan",
            date_watched="2026-01-01",
            released=2023,
            best_picture=True,
        )
        # a rewatch is a second row, but the film should only be listed once
        Movie.objects.create(
            title="Oppenheimer",
            director="Christopher Nolan",
            date_watched="2026-02-01",
            released=2023,
            best_picture=True,
        )
        response = self.client.get("/api/movies/best-picture/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([m["title"] for m in response.data], ["Oppenheimer"])

    def test_foreign_films(self):
        Movie.objects.create(
            title="Parasite",
            director="Bong Joon-ho",
            date_watched="2026-01-01",
            released=2019,
            language="Korean",
        )
        Movie.objects.create(
            title="Parasite",
            director="Bong Joon-ho",
            date_watched="2026-02-01",
            released=2019,
            language="Korean",
        )
        # language can be stored as NULL (setUp movies) or "", neither is foreign
        Movie.objects.create(
            title="Blank Language",
            director="director",
            date_watched="2026-01-01",
            released=2020,
            language="",
        )
        response = self.client.get("/api/movies/foreign-films/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([m["title"] for m in response.data], ["Parasite"])

    def test_search(self):
        response = self.client.get("/api/movies/search/", {"query": "Gerwig"})
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Barbie")

    def test_create_movie_without_title_fails(self):
        response = self.client.post("/api/movies/", {"title": ""}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_movies_not_found(self):
        response = self.client.delete("/api/movies/9999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_released_non_numeric(self):
        response = self.client.get("/api/movies/released/", {"released": "abc"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_create_movie_requires_login(self):
        self.client.force_authenticate(None)
        response = self.client.post("/api/movies/", {"title": "Sneaky"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Movie.objects.count(), 2)


class WikipediaTests(SimpleTestCase):
    def test_parse_query_follows_normalisation_and_redirects(self):
        pages = wikipedia.parse_query(
            ["barbie (2023 film)", "Nope (film)"],
            {
                "normalized": [
                    {"from": "barbie (2023 film)", "to": "Barbie (2023 film)"}
                ],
                "redirects": [{"from": "Barbie (2023 film)", "to": "Barbie (film)"}],
                "pages": [
                    {"title": "Barbie (film)", "description": "2023 film"},
                    {"title": "Nope (film)", "missing": True},
                ],
            },
        )
        self.assertEqual(pages["barbie (2023 film)"]["title"], "Barbie (film)")
        self.assertFalse(pages["barbie (2023 film)"]["missing"])
        self.assertTrue(pages["Nope (film)"]["missing"])

    def page(self, title, missing=False, disambiguation=False, description=""):
        return {
            "title": title,
            "missing": missing,
            "disambiguation": disambiguation,
            "description": description,
        }

    def test_resolve_prefers_year_film_article(self):
        pages = {
            "Heat (1995 film)": self.page("Heat (1995 film)"),
            "Heat (film)": self.page("Heat (film)", disambiguation=True),
            "Heat": self.page("Heat", description="Type of energy transfer"),
        }
        self.assertEqual(wikipedia.resolve("Heat", 1995, pages), "Heat (1995 film)")

    def test_resolve_skips_bare_title_that_is_not_a_film(self):
        pages = {
            "Heat (1995 film)": self.page("Heat (1995 film)", missing=True),
            "Heat (film)": self.page("Heat (film)", disambiguation=True),
            "Heat": self.page("Heat", description="Type of energy transfer"),
        }
        self.assertIsNone(wikipedia.resolve("Heat", 1995, pages))

    def test_resolve_accepts_bare_title_that_is_a_film(self):
        pages = {
            "Oppenheimer (2023 film)": self.page("x", missing=True),
            "Oppenheimer (film)": self.page("x", missing=True),
            "Oppenheimer": self.page(
                "Oppenheimer (film)", description="2023 film by Christopher Nolan"
            ),
        }
        self.assertEqual(
            wikipedia.resolve("Oppenheimer", 2023, pages), "Oppenheimer (film)"
        )

    def test_resolve_accepts_bare_title_naming_a_film_article(self):
        title = "Gravity (2013 film)"
        pages = {
            f"{title} (2013 film)": self.page("x", missing=True),
            f"{title} (film)": self.page("x", missing=True),
            title: self.page(title, description="Science fiction thriller"),
        }
        self.assertEqual(wikipedia.resolve(title, 2013, pages), title)

    def test_article_url_encodes_special_characters(self):
        self.assertEqual(
            wikipedia.article_url("What's Up, Doc? (1972 film)"),
            "https://en.wikipedia.org/wiki/What%27s_Up%2C_Doc%3F_%281972_film%29",
        )


class CheckWikiLinksTests(TestCase):
    def test_reports_films_without_an_article(self):
        for date_watched in ["2026-01-01", "2026-02-01"]:
            Movie.objects.create(
                title="Top Gun",
                director="Tony Scott",
                date_watched=date_watched,
                released=1986,
            )
        Movie.objects.create(
            title="Unknown Film", director="x", date_watched="2026-01-01", released=2020
        )

        def fake_fetch(names):
            # a rewatch shouldn't be looked up twice
            self.assertEqual(len(names), len(set(names)))
            return {
                name: {
                    "title": name,
                    "missing": name != "Top Gun (1986 film)",
                    "disambiguation": False,
                    "description": "",
                }
                for name in names
            }

        out = StringIO()
        with patch.object(wikipedia, "fetch_pages", side_effect=fake_fetch):
            call_command("check_wiki_links", stdout=out)
        output = out.getvalue()
        self.assertIn("NOT FOUND  Unknown Film (2020)", output)
        self.assertNotIn("Top Gun", output)
        self.assertIn("1/2 films link to an article", output)
