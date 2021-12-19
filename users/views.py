from rest_auth.registration.views import RegisterView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserRegistrationSerializer, UserSerializer, UserLikeSerializer
from .models import User, Like
from rest_framework import viewsets
from django.http import HttpResponse
from django.views import View
import json
from django.core import serializers


class RegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = (AllowAny,)
    authentication_classes = ()


class LikesListView(APIView):
    """
    List all likes, or create a new likes.
    """

    def get(self, request, user_that_likes, user_that_is_liked):
        likes_on_pk_post = Like.objects.filter(liked_user_id=user_that_is_liked)
        serializer = UserLikeSerializer(likes_on_pk_post, many=True)

        is_liked_by = []
        match = []
        for user in serializer.data:
            print(user)
            you = User.objects.get(id=user["user_id"])
            me = User.objects.get(id=user_that_is_liked)
            try:
                Like.objects.get(
                    user_id=you,
                    liked_user_id=me,
                )
                Like.objects.get(
                    user_id=me,
                    liked_user_id=you,
                )
                data = serializers.serialize(
                    "json",
                    [
                        you,
                    ],
                )
                struct = json.loads(data)
                data = json.dumps(struct[0])
                match.append(data)

            except Like.DoesNotExist:
                data = serializers.serialize(
                    "json",
                    [
                        you,
                    ],
                )
                struct = json.loads(data)
                data = json.dumps(struct[0])
                is_liked_by.append(data)

        return Response({"match": match, "likes": is_liked_by})

    def post(self, request, user_that_likes, user_that_is_liked):
        # new_like = Like(
        #     user_id=User.objects.get(id=user_that_likes),
        #     liked_user_id=User.objects.get(id=user_that_is_liked),
        # )
        # new_like.save()

        try:
            Like.objects.get(
                user_id=User.objects.get(id=user_that_likes),
                liked_user_id=User.objects.get(id=user_that_is_liked),
            ).delete()
        except Like.DoesNotExist:
            Like.objects.create(
                user_id=User.objects.get(id=user_that_likes),
                liked_user_id=User.objects.get(id=user_that_is_liked),
            )

        likes_on_pk_post = Like.objects.filter(liked_user_id=user_that_is_liked)
        serializer = UserLikeSerializer(likes_on_pk_post, many=True)
        # if serializer.is_valid():
        #     serializer.save()
        return Response(serializer.data)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IsLikedView(APIView):
    def get(self, request, user_that_likes, user_that_is_liked):
        # new_like = Like(
        #     user_id=User.objects.get(id=user_that_likes),
        #     liked_user_id=User.objects.get(id=user_that_is_liked),
        # )
        # new_like.save()

        try:
            Like.objects.get(
                user_id=User.objects.get(id=user_that_likes),
                liked_user_id=User.objects.get(id=user_that_is_liked),
            )
            return Response({"is_liked": True})

        except Like.DoesNotExist:
            return Response({"is_liked": False})
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class ListView(generics.ListAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = (AllowAny,)
#     authentication_classes = ()
#


class ListView(APIView):
    """
    List all users
    """

    def get(self, request, user_id):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        resp = []
        for user in serializer.data:
            print(user)
            is_liked = False
            try:
                Like.objects.get(
                    user_id=User.objects.get(id=user_id),
                    liked_user_id=User.objects.get(id=user["id"]),
                )
                is_liked = True

            except Like.DoesNotExist:
                is_liked = False

            user["is_liked"] = is_liked
            resp.append(user)

        return Response(resp)


class UserDetailsView(generics.RetrieveUpdateAPIView):
    """
    Reads and updates UserModel fields
    Accepts GET, PUT, PATCH methods.
    Default accepted fields: username, first_name, last_name
    Default display fields: pk, username, email, first_name, last_name
    Read-only fields: pk, email
    Returns UserModel fields.
    """

    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def get_queryset(self):
        """
        Adding this method since it is sometimes called when using
        django-rest-swagger
        https://github.com/Tivix/django-rest-auth/issues/275
        """
        return get_user_model().objects.none()


# class LikeRetrieveAPIView(generics.RetrieveAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserLikeSerializer
#     permission_classes = (AllowAny,)
#     authentication_classes = ()
#
#
# class LikeCreateAPIView(generics.CreateAPIView):
#
#
# class LikeListCreate(View):
#     def get(self, request, pk):
#         liked_user_likes = Like.objects.filter(liked_user_id=pk)
#         like_count = liked_user_likes.all().count()
#         serializer_class = UserLikeSerializer
#         return HttpResponse(str({pk: int(like_count)}))
#
#     def post(self, request, pk):
#         """
#         curl -i -H "Content-Type: application/json"  -X POST http://localhost:1337/auth/a3efeee8-2485-4249-a217-ea9488e750d9/like/
#
#         """
#         user_id = request.user
#         # liked_user_id = User.objects.filter(pk=pk)
#         serializer_class = UserLikeSerializer
#
#         new_like = Like(user_id=user_id, liked_user_id=pk)
#         new_like.save()
#
#         return HttpResponse(str({"Status": 200}))


# class LikesViewSet(viewsets.ModelViewSet):
#     permission_classes = (AllowAny,)
#     queryset = Like.objects.all()
#     serializer_class = UserLikeSerializer
