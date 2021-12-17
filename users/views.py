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
        return Response(serializer.data)

    def post(self, request, user_that_likes, user_that_is_liked):
        new_like = Like(
            user_id=User.objects.get(id=user_that_likes),
            liked_user_id=User.objects.get(id=user_that_is_liked),
        )
        new_like.save()
        likes_on_pk_post = Like.objects.filter(liked_user_id=user_that_is_liked)
        serializer = UserLikeSerializer(likes_on_pk_post, many=True)
        # if serializer.is_valid():
        #     serializer.save()
        return Response(serializer.data)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)
    authentication_classes = ()


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
