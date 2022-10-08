from rest_framework.routers import DefaultRouter
# , GradedAssignmentCreateView
from api.views import CourseViewSet, AssignmentViewSet, AssignmentSubmissionView
from django.urls import path
from api.views import DownloadPDF, DownloadAllPDF, setFeedback  # , CodeViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet, base_name='courses')
router.register(r'', AssignmentViewSet, base_name='assignments')

urlpatterns = router.urls
temp = [
    path('posts/', AssignmentSubmissionView.as_view(), name='posts_list'),
    path('download/<course_id>/<title>/<username>', DownloadPDF, name='download_pdf'),
    path('downloadAll/<course_id>/<title>', DownloadAllPDF, name='download_all'),
    # path('feedback/<title>/<username>', getFeedback, name='feedback'),
    path('feedback/', setFeedback, name='feedback'),
    # path('create/', GradedAssignmentCreateView.as_view())
]

urlpatterns = temp + urlpatterns
