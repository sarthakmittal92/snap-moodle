from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import checkInTaList, generateOTP, update_password
from .views import  MessageViewSet, UserViewSet, TeachAssistViewSet  # , ChangePasswordView


router = DefaultRouter()
router.register(r'teachassists', TeachAssistViewSet, base_name='teachassists')
router.register(r'messaging', MessageViewSet, base_name='messaging')
router.register(r'', UserViewSet, base_name='users')
# router.register(r'change', ChangePasswordView.as_view(), base_name='change')
urlpatterns = router.urls

temp = [
  path('checkta/<course_id>/<username>', checkInTaList, name='checkta'),
  path('generateOTP/<username>', generateOTP, name="generateOTP"),
  path('update_password/<username>', update_password, name="update_password"),

]

urlpatterns = temp + urlpatterns
