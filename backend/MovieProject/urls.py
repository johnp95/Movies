from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.throttling import ScopedRateThrottle


class ThrottledObtainAuthToken(ObtainAuthToken):
    # limit login attempts per IP (rate set in settings DEFAULT_THROTTLE_RATES)
    throttle_classes = (ScopedRateThrottle,)
    throttle_scope = "token"


urlpatterns = [
    path(settings.ADMIN_URL, admin.site.urls),
    path("api/", include("api.urls")),
    path("api-auth/", include("rest_framework.urls")),
    path("api/token/", ThrottledObtainAuthToken.as_view()),
]
admin.site.site_header = "Movie Administration"
admin.site.index_title = "Welcome To Movie Administration"
