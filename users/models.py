from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
from django.db.models import UniqueConstraint


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    photo = models.FileField(null=True, blank=True)
    description = models.CharField(max_length=2000, blank=True)

    def user_id(self):
        return self.id.__str__()

    def delete(self, *args, **kwargs):
        self.photo.delete(save=False)
        super(User, self).delete(*args, **kwargs)


# class Likes(models.Model):
#     user = models.ForeignKey(User, related_name="likes", on_delete=models.CASCADE)
#     profile = models.ForeignKey(User, related_name="profile", on_delete=models.CASCADE)


class Like(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_id")
    liked_user_id = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="liked_user_id"
    )
    liked_on = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            UniqueConstraint(
                fields=["user_id", "liked_user_id"], name="unique_user_likes"
            )
        ]

    def __str__(self):
        return f"{self.user_id.username} --> {self.liked_user_id.username}"
