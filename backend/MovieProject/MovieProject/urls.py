from django.contrib import admin
from django.conf import settings
from django.urls import path,include
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include('api.urls')),
    path('',include('MovieApp.urls')),
    path('api-auth/', include('rest_framework.urls')),
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.site_header = "Movie Administration"
admin.site.index_title = "Welcome To Movie Administration"