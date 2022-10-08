from api.models import Permission
from rest_framework.routers import DefaultRouter
from api.views import CourseListViewSet, CourseViewSet, AssignmentSubmissionView, PermissionViewSet
from django.urls import path
from api.views import get_permissions, update_permissions

router = DefaultRouter()
router.register(r'permission', PermissionViewSet, base_name='permissions')
router.register(r'code', CourseViewSet, base_name='Code_viewset')
router.register(r'', CourseListViewSet, base_name='courses')

urlpatterns = router.urls

temp = [
    path('get_permissions/<courseID>', get_permissions, name='get_permissions'),
    path('update_permissions/<courseID>', update_permissions, name='update_permissions')
]

urlpatterns = temp + urlpatterns