from django.contrib import admin
from . models import Appmodel, Model, Field, Setting

# Register your models here.
admin.site.register(Appmodel)
admin.site.register(Model)
admin.site.register(Field)
admin.site.register(Setting)
