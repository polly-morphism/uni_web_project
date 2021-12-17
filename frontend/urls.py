from django.urls import path
from . import views

urlpatterns = [
    path("", views.index),
    # path("reports/", views.index),
    # path("settings/", views.index),
]
