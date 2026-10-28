from django.core.management.base import BaseCommand

from MovieApp import wikipedia
from MovieApp.models import Movie


class Command(BaseCommand):
    help = (
        "Check that every film resolves to a Wikipedia article, the same way "
        "the movie detail page does. Films that don't fall back to a search."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--all",
            action="store_true",
            help="Also list films that resolved, with the article they link to.",
        )

    def handle(self, *args, **options):
        # One row per viewing, so check each (title, year) once
        films = list(
            Movie.objects.order_by("title", "released")
            .values_list("title", "released")
            .distinct()
        )
        names = list(
            dict.fromkeys(
                name
                for title, year in films
                for name in wikipedia.candidates(title, year)
            )
        )
        pages = wikipedia.fetch_pages(names)

        unresolved = 0
        for title, year in films:
            article = wikipedia.resolve(title, year, pages)
            if article is None:
                unresolved += 1
                self.stdout.write(
                    self.style.WARNING(f"NOT FOUND  {title} ({year})")
                    + f"  -> {wikipedia.search_url(title, year)}"
                )
            elif options["all"]:
                self.stdout.write(
                    f"ok         {title} ({year})  -> {wikipedia.article_url(article)}"
                )

        summary = f"{len(films) - unresolved}/{len(films)} films link to an article"
        style = self.style.SUCCESS if unresolved == 0 else self.style.WARNING
        self.stdout.write(style(summary))
