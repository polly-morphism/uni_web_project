import jwt
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework import exceptions


def get_current_user(request):
    User = get_user_model()
    access_token = request.COOKIES.get("access")
    if not access_token:
        raise exceptions.AuthenticationFailed("No access token")
    try:
        payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])

    except jwt.ExpiredSignatureError:
        raise exceptions.AuthenticationFailed("access_token expired")
    except IndexError:
        raise exceptions.AuthenticationFailed("Token prefix missing")

    user = User.objects.filter(id=payload["user_id"]).first()
    if user is None:
        raise exceptions.AuthenticationFailed("User not found")

    if not user.is_active:
        raise exceptions.AuthenticationFailed("user is inactive")

    return user
