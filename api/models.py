from django.db import models
from users.models import User, Code, TeachAssist
import os
from home.settings.base import BASE_DIR, MEDIA_ROOT

class Course (models.Model):
    title = models.CharField(max_length=50, unique=True)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.OneToOneField(Code, null=True, on_delete=models.DO_NOTHING)
    teachassists = models.ManyToManyField(TeachAssist, blank=True)

    def __str__(self):
        return self.title


class Permission(models.Model):
    course = models.OneToOneField(Course, null=True, on_delete=models.CASCADE)
    make_assignments = models.BooleanField(default=False)
    add_TAs = models.BooleanField(default=False)
    make_announcements = models.BooleanField(default=False)
    upload_grades = models.BooleanField(default=False)
    allow_dm = models.BooleanField(default=False)
    # make_announcements = models.BooleanField(default = False)

    def __str__(self):
        try:
            return(self.course.title)
        except:
            return "Course not assigned"


class Assignment(models.Model):
    title = models.CharField(max_length=50)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE)
    problemStatement = models.CharField(default='', max_length=50)
    # code = models.CharField(default='', max_length=10)
    course = models.ForeignKey(Course, null=True, on_delete=models.DO_NOTHING)
    weightage = models.IntegerField(null=True)
    deadline = models.DateTimeField(null=True)
    # is_submitted = models.BooleanField(default=False)
    is_graded = models.BooleanField(default=False)

    def __str__(self):
        return self.title


def upload_function(instance, filename):
    string = '%s' % instance.user.username

    # filename = string + '_' + filename

    if (instance.user.is_student):
        filename = string + '_' + filename

    path_to_file = MEDIA_ROOT + '/' + str(os.path.join('%s/' % instance.course.title, '%s/' % instance.assignment.title, filename))
    print("in upload ", path_to_file)
    if os.path.exists(path_to_file):
        os.remove(path_to_file)

    return os.path.join('%s/' % instance.course.title, '%s/' % instance.assignment.title, filename)




class AssignmentSubmission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    submissionfile = models.FileField(upload_to=upload_function, null=True)
    time_rem = models.BooleanField(default=False)
    assignment = models.ForeignKey(Assignment, null=True, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, null=True, on_delete=models.DO_NOTHING)

    def __str__(self):
        return (self.user.username)


class GradedAssignment(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    grade = models.IntegerField(null=True, default=0)
    feedback = models.CharField(max_length=100, null=True, default="NA")
    assignment = models.ForeignKey(
        Assignment, on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return str(f'{self.student.username} - {self.grade}')

class Announcement(models.Model):
    title = models.CharField(max_length=50)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=200, null=True)

    course = models.ForeignKey(Course, null=True, on_delete=models.DO_NOTHING)

    def __str__(self):
        return self.title
