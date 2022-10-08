from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.deletion import SET_NULL
from django.db.models.fields import CharField
import datetime

class User(AbstractUser):
    is_student = models.BooleanField()
    is_teacher = models.BooleanField()

    def __str__(self):
        return self.username


class Code(models.Model):

    code = models.CharField(default='', null=True, max_length=10)
    users = models.ManyToManyField(User)
    
    def __str__(self):
        return self.code


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # code = models.ForeignKey(Code, on_delete=models.DO_NOTHING)

    def __str__(self):
        return self.user.username

class TeachAssist(models.Model):
    student = models.ForeignKey(Student, on_delete=models.DO_NOTHING)

    def __str__(self):
        return self.student.user.username

class Message(models.Model):
    sender = models.ForeignKey(
        User, related_name="sender", on_delete=models.CASCADE)
    receiver = models.ForeignKey(
        User, related_name="receiver", on_delete=models.CASCADE)

    msg_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return str(self.msg_content)

