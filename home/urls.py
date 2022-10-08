from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    path('admin/', admin.site.urls),
    path('assignments/', include('api.assignments.urls')),
    path('announcements/', include('api.announcements.urls')),
    path('courses/', include('api.courses.urls')),
    path('grades/', include('api.grades.urls')),
    path('users/', include('users.urls'))
]
