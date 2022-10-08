from rest_framework import serializers
from typing import Union
from rest_framework import viewsets
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.response import Response
from django.core.files import File
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.serializers import Serializer
from home.settings.base import BASE_DIR, MEDIA_ROOT
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST
)

from django.conf import settings
from django.core.mail import send_mail

from os import path, walk 
from pathlib import Path
import shutil
import pandas
import json
import numpy as np
import matplotlib as mpl
import matplotlib.pyplot as plt
from matplotlib import colors
from matplotlib.ticker import PercentFormatter
import re

from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import Course, Assignment, AssignmentSubmission, GradedAssignment, Announcement, Permission
from .serializers import CourseSerializer, AssignmentSerializer, AssignmentSubmissionSerializer, GradedAssignmentSerializer, AnnouncementSerializer, PermissionSerializer


from users.models import User, Student, Code

from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status


class CourseListViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()

    def create(self, request):
        serializer = CourseSerializer(data=request.data)

        course = serializer.create(request)
        if course:
            p = Permission.objects.create()
            p.course = course
            p.save()
            return Response(status=HTTP_201_CREATED)

        return Response(status=HTTP_400_BAD_REQUEST)


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer

    def create(self, request):
        serializer = CourseSerializer(data=request.data)

        course = serializer.create(request)
        if course:
            return Response(status=HTTP_201_CREATED)

        return Response(status=HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        username = self.request.query_params.get('username')
        code = self.request.query_params.get('accessCode')

        try:
            codeObj = Code.objects.get(code=code)
            userObj = User.objects.get(username=username)
            codeObj.users.add(userObj)
            codeObj.save()

        except Exception:
            print('course exception')

        courses = Course.objects.all()
        filtered_courses = courses

        list = []

        for course in courses.iterator():
            
            try:
                found = False
                for ta in course.teachassists.all():
                    if (ta.student.user.username == username):
                        list.append(course.id)
                        break

                if(found):
                    continue
            except:     
                print("TAException: in api/views.py CourseViewset")
            
            try:
                CodeObject = course.code
                UserObjects = CodeObject.users.all()
                userObj = User.objects.get(username=username)

                for userobject in UserObjects.iterator():
                    if (userobject.username == userObj.username):
                        list.append(course.id)
                        break

            except Exception:
                print('exception here')

        filtered_courses = filtered_courses.filter(pk__in=list)
        return filtered_courses


class AssignmentViewSet(viewsets.ModelViewSet):
    serializer_class = AssignmentSerializer

    def create(self, request):
        serializer = AssignmentSerializer(data=request.data)
        
        course = Course.objects.get(id=request.data['course']['id'])
        subject = 'Assignment created for course {0}'.format(request.data['course']['title'])
        message = 'Hi. A new assignment has been created for the course {0}'.format(request.data['course']['title']) # add deadline here later
        email_from = settings.EMAIL_HOST_USER

        coursecode = course.code

        recipient_list = [user.email for user in coursecode.users.all()]
        print(recipient_list)
        try:
            send_mail(subject, message, email_from, recipient_list)
        except Exception:
            print("Creation mail failed")

        assignment = serializer.create(request)
        if assignment:
            return Response(status=HTTP_201_CREATED)

        return Response(status=HTTP_400_BAD_REQUEST)

    def get_queryset(self):

        print("inside queryset")
        course = self.request.query_params.get('course')
        print(course)
        if (course is None):
            return Assignment.objects.all()

        try:
            courseObj = Course.objects.get(pk=course)
            courseObj.save()
            print(courseObj)

        except Exception:
            print("caught exception")

        assignments = Assignment.objects.all()
        filtered_assgn = assignments

        list = []

        for assignment in assignments.iterator():

            try:
                if (courseObj == assignment.course):
                    list.append(assignment.id)

            except Exception:
                print("exception")

        filtered_assgn = filtered_assgn.filter(pk__in=list)
        return filtered_assgn

class AnnouncementViewSet(viewsets.ModelViewSet):
    serializer_class = AnnouncementSerializer
    queryset = Announcement.objects.all()

    # def create(self, request):
    #     serializer = AnnouncementSerializer(data=request.data)
    #     announcement = serializer.create(request)
    #     if announcement:
    #         return Response(status=HTTP_201_CREATED)
    #     return Response(status=HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `course` query parameter in the URL.
        """
        queryset = Announcement.objects.all()
        course = self.request.query_params.get('course')
        if course is not None:
            queryset = queryset.filter(course__pk=course)
        return queryset


class AssignmentSubmissionView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = []

    def get(self, request, *args, **kwargs):
        posts = AssignmentSubmission.objects.all()
        serializer = AssignmentSubmissionSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):

        # ###################################################################################3
        # here (or in the serializer) we will save the grade model instance
        # we have the assignment, and when the user is a teacher, we get the csv for grading
        # using that (maybe we need to read the file) we can assign grades
        # ####################################################################################

        # Reply (Neeraj) : Yes
        print('Request files', request.FILES)
        uname = request.data['username']
        data1 = {}
        data1['submissionfile'] = request.FILES['submissionfile'] 
        print('data submission', data1['submissionfile'])
        data1['time_rem'] = request.data['time_rem']
        data1['user'] = User.objects.get(username=uname).id
        user = User.objects.get(username=uname)
        data1['assignment'] = Assignment.objects.get(pk=request.data['currentAssignment']).id
        course = Course.objects.filter(assignment=data1['assignment'])[0]

        # data1['assignment'] = request.data['currentAssignment']

        assignmentSubmission_serializer = AssignmentSubmissionSerializer(data=data1)
        if assignmentSubmission_serializer.is_valid():
            subject = 'Assignment submission for course {0}'.format(course.title)
            message = 'Hi. A new assignment submission has been done for the course {0}'.format(course.title)
            email_from = settings.EMAIL_HOST_USER

            recipient_list = [user.email]
            print(recipient_list)
            try:
                send_mail(subject, message, email_from, recipient_list)
            except Exception:
                print("Submission mail failed")
            assignmentSubmission_serializer.save()
            return Response(assignmentSubmission_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', assignmentSubmission_serializer.errors)
            return Response(assignmentSubmission_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GradeListViewSet(viewsets.ModelViewSet):
    """Class only to list out the assignments"""
    serializer_class = GradedAssignmentSerializer

    def get_queryset(self):

        username = self.request.query_params.get('username')
        course_id = self.request.query_params.get('course')
        assignment_id = self.request.query_params.get('assignment')
        queryset = GradedAssignment.objects.all()

        print("Received Assignment : ", assignment_id)

        if(username is None):
            if(course_id is None):
                if(assignment_id is None):
                    return queryset
                else:
                    queryset = queryset.filter(assignment=assignment_id)
                    return queryset
            else:
                queryset = queryset.filter(assignment__course=course_id)

                if(assignment_id is None):
                    return queryset
                else:
                    queryset = queryset.filter(assignment=assignment_id)
                    return queryset
        else:
            user = User.objects.get(username=username)
            if(user.is_student):
                queryset = queryset.filter(student__username=username)
            else:
                queryset = queryset.filter(assignment__teacher__username=username)

            if(course_id is None):
                if(assignment_id is None):
                    return queryset
                else:
                    queryset = queryset.filter(assignment=assignment_id)
                    return queryset
            else:
                queryset = queryset.filter(assignment__course=course_id)

                if(assignment_id is None):
                    return queryset
                else:
                    queryset = queryset.filter(assignment=assignment_id)
                    return queryset

            # #################################################################################
            # here we need to filter and return grade model list
            # if student we return list having his marks for assignments in the course
            # if teacher we return aggregates after calculating
            # #################################################################################
            # #################################################################################
            # Reply (Neeraj) : Are I tried doing two things in the same API, but REST does not
            #                  support heterogenous model objects in the same API
            #                  So, the below ViewSet is inevitable, but we will only use an
            #                  api_view
            # #################################################################################

class PermissionViewSet(viewsets.ModelViewSet):
    serializer_class = PermissionSerializer
    queryset = Permission.objects.all()

    def create(self, request):
        data = request.data

        # course = Course.objects.get(title=data["course"]["title"])
        print(request)

    def update(self, request):
        data = request.data

        return Response("recieved info", status=status.HTTP_201_CREATED)

@api_view(['GET'])
def getCourseStats(self, course_id=None, assignment_id=None):
    """Assumption : Can be called as either course_id or course_id/assignment_id
                    So course_id is always not None
                    Also, I am assuming that instructor will always grade between 0-100
                    which will further be scaled by the assignment weightage."""

    coursename = Course.objects.get(pk=course_id).title
    gradedAssignments = GradedAssignment.objects.filter(assignment__course=course_id)

    # Now calculate the mean, variance and marks for each assignment and then plot
    assignment_ids = gradedAssignments.values_list('assignment', flat=True)
    assignment_ids = list(set(list(assignment_ids)))

    final_output = []

    if assignment_id is None:
        mean_data = []
        variance_data = []
        for assignment in assignment_ids:
            # Now, find out those for this assignment
            assignment_name = Assignment.objects.get(pk=assignment).title
            assignment_weightage = Assignment.objects.get(pk=assignment).weightage
            this_assignment_objects = gradedAssignments.filter(assignment=assignment)

            marks_list = [submission.grade for submission in this_assignment_objects]
            
            mean = sum(marks_list)/len(this_assignment_objects)
            variance = sum([(submission.grade-mean)**2 for submission in this_assignment_objects])/len(this_assignment_objects)

            mean_data.append(mean)
            variance_data.append(variance)

            this_assignment_output = {}
            this_assignment_output['assignment_name'] = assignment_name
            this_assignment_output['assignment_weightage'] = assignment_weightage
            this_assignment_output['mean'] = mean
            this_assignment_output['variance'] = variance

            final_output.append(this_assignment_output)
    
        response = Response(final_output, status=200)
        return response
    
    else:
        assignment = assignment_id
        assignment_name = Assignment.objects.get(pk=assignment).title
        assignment_weightage = Assignment.objects.get(pk=assignment).weightage
        this_assignment_objects = gradedAssignments.filter(assignment=assignment)

        if(len(this_assignment_objects) == 0):
            return Response([], status=200)

        marks_list = [submission.grade for submission in this_assignment_objects]
        
        mean = sum(marks_list)/len(marks_list)
        variance = sum([(submission.grade-mean)**2 for submission in this_assignment_objects])/len(marks_list)

        this_assignment_output = {}
        this_assignment_output['assignment_name'] = assignment_name
        this_assignment_output['mean'] = mean
        this_assignment_output['variance'] = variance
        this_assignment_output['marks_list'] = marks_list

        return Response(this_assignment_output, status=200)


@api_view(['GET'])
def DownloadPDF(self, course_id, title, username):

    print(title)
    # path_to_file = MEDIA_ROOT + '/' + filename + '.pdf'
    courseObj = Course.objects.get(pk=course_id)
    course_name = courseObj.title
    rootdir = MEDIA_ROOT + '/' + course_name + '/' + title + '/'
    for root, dirs, files in walk(rootdir):
        for file in files:
            if file.startswith(username):
                print(file)
                # username + '.py'
                f = open(rootdir + file, 'rb')
                pdfFile = File(f)
                print("in the views")
                response = HttpResponse(pdfFile.read())
                response['Content-Disposition'] = 'attachment'
                return response


@api_view(['GET'])
def DownloadAllPDF(self, course_id, title):
    courseObj = Course.objects.get(pk=course_id)
    course_name = courseObj.title
    zip_path = shutil.make_archive('output_filename', 'zip', 'media/' + course_name + '/' + title)
    zip_file = open(zip_path, 'rb')
    response = HttpResponse(zip_file, content_type='application/zip')
    response['Content-Disposition'] = 'attachment; filename=name.zip'
    return response

@api_view(['POST'])
def setFeedback(request):
    assignment = Assignment.objects.get(pk=request.data['currentAssignment'])
    assignment.is_graded = True
    assignment.save()

    try:
        file = open(MEDIA_ROOT+f'/{assignment.course.title}/{assignment.title}/feedback.csv', 'rb')
    except:
        return Response({"message": "feedback.csv not found"}, status=status.HTTP_400_BAD_REQUEST)

    df = pandas.read_csv(file, usecols=['username', 'feedback', 'grade'])

    rows = len(df['username'])
    for i in range(rows):
        username = df['username'][i]
        feedback = df['feedback'][i]
        if len(AssignmentSubmission.objects.filter(user__username=username)) == 0:
            continue
        grade = df['grade'][i]

        student = User.objects.get(username=username)
        if(student is None or student.is_teacher):
            continue
        gradedAsnt = GradedAssignment(student=student)
        gradedAsnt.grade = grade         
        gradedAsnt.feedback = feedback
        gradedAsnt.assignment = assignment
        gradedAsnt.save()

    return Response({"message": "Set the feedbacks and grades"}, status=200)

@api_view(['GET'])
def get_permissions(self, courseID):
    course = Course.objects.get(id=courseID)
    p = course.permission
    # print(p.add_TAs)
    # print(p.make_assignments)
    content = {
        'make_asnts': p.make_assignments,
        'add_ta': p.add_TAs,
        'make_announcements': p.make_announcements,
        'upload_grades': p.upload_grades,
        'allow_dm': p.allow_dm,
    }
    return HttpResponse(json.dumps(content))

@api_view(['PUT'])
def update_permissions(request, courseID):

    data = request.data
    course = Course.objects.get(id=courseID)
    permission_obj = course.permission
    print(data)
    permission_obj.make_assignments = data['permissions']['make_asnts']
    permission_obj.add_TAs = data['permissions']['add_ta']
    permission_obj.make_announcements = data['permissions']['make_announcements']
    permission_obj.upload_grades = data['permissions']['upload_grades']
    permission_obj.allow_dm = data['permissions']['allow_dm']
    permission_obj.save()


    return HttpResponse({'':''}, status=status.HTTP_200_OK)

@api_view(['GET'])
def getCourseTotals(request):
    username = request.query_params.get('username')
    course_id = request.query_params.get('course_id')

    # Check if the username is of a student
    # Then calculate the course totals of all the courses for him

    if(username is None):
        print("Username not passed to grades/totals/")
        return Response({}, status=200)

    user = User.objects.get(username=username)

    if not user.is_student:
        return Response({}, status=200)

    # Calculate all his course totals and send it back
    his_codes = user.code_set.all()
    his_courses = list(map(lambda code: Course.objects.get(code=code), his_codes))
    his_gradedAssignments = GradedAssignment.objects.filter(student=user)

    if course_id is None:
        final_output = []
        # Format = [{"course_id": <>, "course_name": <>, "course_total": <>}...]

        for course in his_courses:
            # Now find his total for this course
            # Things required : GradedAssignment obj, assignment
            #                   and its weightage

            this_course_output = {}
            this_course_output["course_id"] = course.id
            this_course_output["course_name"] = course.title

            this_course_graded_assignments = his_gradedAssignments.filter(assignment__course=course)

            this_course_total = 0

            for gradedAssignment in this_course_graded_assignments:
                this_course_total += (gradedAssignment.grade)*(gradedAssignment.assignment.weightage)/100

            this_course_output["course_total"] = this_course_total

            final_output.append(this_course_output)
        return Response(final_output, status=200)

    else:
        course = Course.objects.get(pk=course_id)

        this_course_output = {}
        this_course_output["course_id"] = course.id
        this_course_output["course_name"] = course.title

        this_course_graded_assignments = his_gradedAssignments.filter(assignment__course=course)

        this_course_total = 0

        for gradedAssignment in this_course_graded_assignments:
            this_course_total += (gradedAssignment.grade)*(gradedAssignment.assignment.weightage)/100

        this_course_output["course_total"] = this_course_total

        return Response(this_course_output, status=200)