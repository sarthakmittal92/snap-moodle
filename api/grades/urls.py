from rest_framework.routers import DefaultRouter
# , GradeDetailViewSet
from api.views import CourseListViewSet, CourseViewSet, AssignmentSubmissionView, \
					  GradeListViewSet, getCourseStats, getCourseTotals
from django.urls import path

router = DefaultRouter()

router.register(r'', GradeListViewSet, base_name='grades')

temp = [
	path(r'stats/<course_id>/<assignment_id>/', getCourseStats, name='stats'),
	path(r'stats/<course_id>/', getCourseStats, name='courseStats'),
	path(r'totals/', getCourseTotals, name='courseTotals'),
]

urlpatterns = temp+router.urls
