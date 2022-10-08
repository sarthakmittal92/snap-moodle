from rest_framework.routers import DefaultRouter
from api.views import CourseViewSet, AnnouncementViewSet
from django.urls import path

router = DefaultRouter()
router.register(r'', AnnouncementViewSet, base_name='announcements')

urlpatterns = router.urls