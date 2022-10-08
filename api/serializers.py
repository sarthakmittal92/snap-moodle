from rest_framework import serializers
import subprocess
from os import path
from users.models import User, Code, Student, TeachAssist
from .models import Assignment, AssignmentSubmission, Course, GradedAssignment, Announcement, Permission
from home.settings.base import BASE_DIR, MEDIA_ROOT
import shutil
import pandas

from django.conf import settings
from django.core.mail import send_mail

class StringSerializer(serializers.StringRelatedField):
    def to_internal_value(self, value):
        return value


class CourseSerializer(serializers.ModelSerializer):
    teacher = StringSerializer(many=False)

    class Meta:
        model = Course
        fields = ('__all__')

    def create(self, request):
        data = request.data

        course = Course()
        teacher = User.objects.get(username=data['teacher'])
        course.teacher = teacher
        course.title = data['title']

        temp_code = Code()
        temp_code.code = data['code']
        temp_code.save()
        temp_code.users.add(teacher)
        temp_code.save()

        course.code = temp_code

        print()

        course.save()
        return course


class AssignmentSerializer(serializers.ModelSerializer):
    # questions = serializers.SerializerMethodField()
    teacher = StringSerializer(many=False)

    class Meta:
        model = Assignment
        fields = ('__all__')

    # def get_questions(self, obj):
    #     questions = QuestionSerializer(obj.questions.all(), many=True).data
    #     return questions

    def create(self, request):
        data = request.data

        assignment = Assignment()
        teacher = User.objects.get(username=data['teacher'])
        assignment.teacher = teacher
        assignment.title = data['title']
        assignment.problemStatement = data['problemStatement']
        assignment.weightage = data['weightage']
        assignment.deadline = data['deadline']
        print("Got deadline ", data['deadline'])

        temp_course = Course()
        temp_course = Course.objects.get(pk=data['course']['id'])
        print(temp_course)

        assignment.course = temp_course

        assignment.save()
        # print('assignment created')
        return assignment


class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    """Earlier I thought that only student will make a submission
       but now, teacher can also make."""

    class Meta:
        model = AssignmentSubmission
        fields = ('__all__')

    # def create(self, request):
    #     return super().create(validated_data)

    def create(self, request):

        print("in submit", request)

        assignment = request['assignment']
        user = request['user']

        if not user.is_student:
            
            print(assignment.is_graded)
            assignment.is_graded = True
            print(assignment.is_graded)
            assignment.save()

        file = request['submissionfile']
        time_rem = request['time_rem']
        print("in serailzer", file)
        print(len(AssignmentSubmission.objects.all()))

        submission = AssignmentSubmission()
        submission.submissionfile = file
        submission.time_rem = time_rem

        submission.assignment = assignment
        submission.course = assignment.course
        submission.user = user
        # print(submission)
        submission.save()

        print(len(AssignmentSubmission.objects.all()))
        if not user.is_student:
            try:
                path_to_file = MEDIA_ROOT + '/' + assignment.course.title + \
                    '/' + assignment.title + '/' + 'evaluate.sh'
                path_to_output = MEDIA_ROOT + '/' + assignment.course.title + \
                    '/' + assignment.title + '/' + 'out.txt'
                # means teacher uploaded evaluate.sh
                if path.exists(path_to_file) or path.exists(path_to_output):
                    if path.exists(path_to_file) and path.exists(path_to_output):
                        print("starting script")
                        path_to_dir = MEDIA_ROOT + '/' + assignment.course.title + '/' + assignment.title
                        subprocess.call(['chmod', '777', path_to_file])
                        subprocess.call([path_to_file, path_to_dir])
                        print("done yo!")
                    else:
                        print("Required files")
                else:
                    print("its csv")

            except:
                print("Upload required files")


        return submission

class GradedAssignmentSerializer(serializers.ModelSerializer):
    # student = StringSerializer(many=False)

    class Meta:
        model = GradedAssignment
        fields = ('__all__')

    def create(self, data):
        gradedasnt = GradedAssignment(student=User.objects.get(username=data['username']))
        gradedasnt.feedback = data['feedback']
        gradedasnt.grade = data['grade']
        gradedasnt.assignment = data['assignment']
        gradedasnt.save()
        return gradedasnt


class AnnouncementSerializer(serializers.ModelSerializer):
    teacher = StringSerializer(many=False)

    class Meta:
        model = Announcement
        fields = ('__all__')

    def create(self, request):
        data = request
        announcement = Announcement()
        announcement.title = data['title']
        announcement.message = data['message']
        temp_course = data['course']
        announcement.course = temp_course
        announcement.teacher = temp_course.teacher
        announcement.save()
        
        subject = 'Anouncement: {0}'.format(announcement.title)
        message = '{0}'.format(announcement.message)
        email_from = settings.EMAIL_HOST_USER

        coursecode = temp_course.code
        recipient_list = [user.email for user in coursecode.users.all()]
        print(recipient_list)
        
        try:
            send_mail(subject, message, email_from, recipient_list)
        except Exception:
            print("Submission mail failed")
        
        return announcement
    
class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ('__all__') 