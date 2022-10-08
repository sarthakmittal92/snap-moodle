from django.db.models import query
from django.db.models.query import QuerySet
from rest_framework import viewsets
from django.shortcuts import render


from .models import User, TeachAssist, Student, Message
# , ChangePasswordSerializer
from .serializers import MessageSerializer, UserSerializer, TeachAssistSerializer
from api.models import Course

from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import UpdateAPIView

import json
from rest_framework.response import Response
from django.core.files import File
from django.http import HttpResponse
from rest_framework.decorators import api_view

from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST
)
from django.conf import settings
from django.core.mail import send_mail

import random


# class ChangePasswordView(UpdateAPIView):
#     """
#     An endpoint for changing password.
#     """
#     serializer_class = ChangePasswordSerializer
#     model = User
#     permission_classes = (IsAuthenticated,)

#     def get_object(self, queryset=None):
#         obj = self.request.user
#         return obj

#     def update(self, request, *args, **kwargs):
#         self.object = self.get_object()
#         serializer = self.get_serializer(data=request.data)

#         if serializer.is_valid():
#             # Check old password
#             if not self.object.check_password(serializer.data.get("old_password")):
#                 return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
#             # set_password also hashes the password that the user will get
#             self.object.set_password(serializer.data.get("new_password"))
#             self.object.save()
#             response = {
#                 'status': 'success',
#                 'code': status.HTTP_200_OK,
#                 'message': 'Password updated successfully',
#                 'data': []
#             }

#             return Response(response)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class TeachAssistViewSet(viewsets.ModelViewSet):
    serializer_class = TeachAssistSerializer
    queryset = TeachAssist.objects.all()

    def create(self, request):
        data = request.data

        course = Course.objects.get(title=data["course"]["title"])

        try:
            student = Student.objects.get(
            user__username=data["student"])
        except Exception:
            return Response({'message': 'Student does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ta = TeachAssist.objects.get(student=student)

        except:
            ta = TeachAssist(student=student)

        ta.save()

        ta.course_set.add(course)
        course.save()

        return Response({
            'status': 'success',
            'code': status.HTTP_200_OK,
            'message': 'TA created successfully',
            'data': []
        })

    def list(self, request):
        queryset = TeachAssist.objects.all()
        
        print("list called")
        output = []
        for teachassist in queryset:
            data = {}
            data['id'] = teachassist.id
            data['student'] = teachassist.student.id
            data['student_name'] = teachassist.student.user.username
            output.append(data)

        return Response(output)
        
    def retrieve(self, request, pk=None):
        teachassist = TeachAssist.objects.get(pk=pk)
        
        data = {}
        data['id'] = teachassist.id
        data['student'] = teachassist.student.id
        data['student_name'] = teachassist.student.user.username

        return Response(data)


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    queryset = Message.objects.all()

    def get_queryset(self):
        queryset = Message.objects.all()
        sender = self.request.query_params.get('sender')
        receiver = self.request.query_params.get('receiver')
        if sender is not None:
            queryset = queryset.filter(sender__username=sender)
        elif receiver is not None:
            queryset = queryset.filter(receiver__username=receiver)

        return queryset

    def create(self, request):
        data = request.data

        sender = User.objects.get(username=data["sender"])
        receiver = User.objects.get(username=data["receiver"])

        msg_content = data["message"]

        message = Message(sender=sender, receiver=receiver,
                          msg_content=msg_content)

        message.save()
        return Response({
            'status': 'success',
            'code': status.HTTP_200_OK,
            'message': 'Message created successfully',
            'data': []
        })

@api_view(['GET'])
def checkInTaList(self, course_id, username):
    course = Course.objects.get(id=course_id)
    check = False
    for ta in course.teachassists.iterator():
        if ta.student.user.username == username:
            check = True
            break
    return HttpResponse(json.dumps(check))


@api_view(['GET'])
def generateOTP(self, username):
    otp = random.randint(10001, 99999)
    user = User.objects.get(username=username)

    subject = 'FloatMoodle: OTP for Password Update'
    message = 'Hi {0}. The OTP for updating the password is {1}.'.format(username, otp) # add deadline here later
    email_from = settings.EMAIL_HOST_USER

    recipient_list = [user.email]
    print(recipient_list, "in generateATP in users/views.py")
    try:
        send_mail(subject, message, email_from, recipient_list)
    except Exception:
        print("Message mail failed")

    return HttpResponse(json.dumps(otp))


@api_view(['POST'])
def update_password(request, username):
    print(request.data)
    user = User.objects.get(username=username)
    user.set_password(request.data['password'])
    user.save()
    print(user.check_password(request.data['password']))
    
    return HttpResponse({'':''}, status=status.HTTP_200_OK)
