from datetime import datetime

from rest_framework.serializers import ModelSerializer, SerializerMethodField

from .models import CustomUser


class UserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'last_login', 'date_joined', 'is_staff')
class UserIdSerializer(ModelSerializer):
    # Meta data is important to serialize the fields in User Model
    class Meta:
        model = CustomUser
        fields = ('id',)