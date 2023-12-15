from django.contrib import admin
from django.conf import settings
from django.urls import path,include
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('MovieApp.urls')),
    # path('',include('events.urls')),
    # path('members/',include('django.contrib.auth.urls')),
    # path('members/',include('members.urls')),
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.site_header = "Movie Administration"
admin.site.index_title = "Welcome To Movie Administration"