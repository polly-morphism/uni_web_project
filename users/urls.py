from django.urls import path, include
from . import views

urlpatterns = [
    path("registration/", views.RegistrationView.as_view(), name="registartion"),
    path("", views.ListView.as_view(), name="list"),
    path(
        "<str:user_that_likes>/<str:user_that_is_liked>/like/",
        views.LikesListView.as_view(),
        name="user_likes",
    ),
    path(
        "user/",
        views.UserDetailsView.as_view(),
        name="user_info",
    )
    # path("login/", views.login_view, name="login"),
    # path("logout/", views.LogoutView),
    # path(
    #     "update_profile/", views.UpdateProfileView.as_view(), name="auth_update_profile"
    # ),
]
