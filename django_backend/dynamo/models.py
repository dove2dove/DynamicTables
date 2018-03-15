from django.db import models
from django.core.validators import ValidationError
from . utils import ManageDB


class Appmodel(models.Model):
    name = models.CharField(max_length=255)
    module = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Model(models.Model):
    app = models.ForeignKey(Appmodel, related_name='models', on_delete=models.DO_NOTHING)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    def get_dynamic_model(self):
        fields = [(f.name, f.get_dynamic_field()) for f in self.fields.all()]

        return ManageDB.create_model(self.name, dict(fields), self.app.name, self.app.module)

    class Meta:
        unique_together = (('app', 'name'),)

def is_valid_field(self, field_data, all_data):
    if hasattr(models, field_data) and issubclass(getattr(models, field_data), models.Field):
        return
    raise ValidationError("This is not a valid field type.")

class Field(models.Model):
    model = models.ForeignKey(Model, related_name='fields', on_delete=models.DO_NOTHING)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=255, validators=[is_valid_field])

    def get_dynamic_field(self):
        settings = [(s.name, s.value) for s in self.settings.all()]
        return getattr(models, self.type)(**dict(settings))

    class Meta:
        unique_together = (('model', 'name'),)

class Setting(models.Model):
    field = models.ForeignKey(Field, related_name='settings', on_delete=models.DO_NOTHING)
    name = models.CharField(max_length=255)
    value = models.CharField(max_length=255)

    class Meta:
        unique_together = (('field', 'name'),)