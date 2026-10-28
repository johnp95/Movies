from django.contrib.auth.models import User
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

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
