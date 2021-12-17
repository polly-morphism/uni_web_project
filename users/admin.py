from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Like


class CustomUserAdmin(UserAdmin):
    fieldsets = (
        *UserAdmin.fieldsets,  # original form fieldsets, expanded
        (  # new fieldset added on to the bottom
            # group heading of your choice; set to None for a blank space instead of a header
            "Custom Field",
            {
                "fields": (
                    "photo",
                    "description",
                ),
            },
        ),
    )


admin.site.register(User, CustomUserAdmin)

admin.site.register(Like)

# admin.site.register(User, UserAdmin)
