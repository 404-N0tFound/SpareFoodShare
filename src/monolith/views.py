from django.http import HttpResponse
from django.shortcuts import render


def index(request) -> HttpResponse:
    """Renders a default index if fallback frontend fails."""
    return render(request, 'index.html')


def listings(request) -> HttpResponse:
    """Renders a generated empty http response in event of database failure."""
    return render(request, "")
