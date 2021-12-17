from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import redirect
from django.views.decorators.http import require_http_methods


@ensure_csrf_cookie
@require_http_methods(["GET"])
def index(request, exception=None):
    return render(request, "frontend/index.html")


def view_404(request, exception=None):
    # do something
    return redirect("user/")
