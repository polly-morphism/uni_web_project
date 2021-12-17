import datetime
import jwt
from django.conf import settings
from django.core.mail import EmailMessage


def generate_access_token(user):
    access_token_payload = {
        "user_id": str(user.id),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=0, minutes=20),
        "iat": datetime.datetime.utcnow(),
    }
    access_token = jwt.encode(
        access_token_payload, settings.SECRET_KEY, algorithm="HS256"
    ).decode("utf-8")
    return access_token


def generate_refresh_token(user):
    refresh_token_payload = {
        "user_id": str(user.id),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
        "iat": datetime.datetime.utcnow(),
    }
    refresh_token = jwt.encode(
        refresh_token_payload, settings.REFRESH_TOKEN_SECRET, algorithm="HS256"
    ).decode("utf-8")

    return refresh_token
