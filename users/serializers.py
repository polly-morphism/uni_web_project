from rest_framework import serializers
from .models import User, Like
import django.contrib.auth.password_validation as validators
from rest_auth.registration.serializers import RegisterSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "photo",
            "description",
        ]


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validators.validate_password]
    )

    class Meta:
        model = User
        extra_kwargs = {"password": {"write_only": True}, "id": {"read_only": True}}
        fields = (
	    "id",
            "username",
            "password",
            "email",
            "first_name",
            "last_name",
            "photo",
            "description",
        )

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = "__all__"
