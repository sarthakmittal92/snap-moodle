from django.contrib import admin

# from .models import Choice, Question, Assignment, GradedAssignment
from .models import Assignment, AssignmentSubmission, GradedAssignment, Course, Announcement

admin.site.register(Assignment)
admin.site.register(Course)
admin.site.register(Announcement)
admin.site.register(AssignmentSubmission)
admin.site.register(GradedAssignment)
